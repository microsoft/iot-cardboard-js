import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { BehaviorFormContext } from '../BehaviorsForm';
import {
    Dropdown,
    IDropdownOption,
    IStackTokens,
    Separator,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import {
    IBehavior,
    IStatusColoringVisual
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IValueRangeBuilderHandle } from '../../../../ValueRangeBuilder/ValueRangeBuilder.types';
import ValueRangeBuilder from '../../../../ValueRangeBuilder/ValueRangeBuilder';
import { ADT3DSceneBuilderMode } from '../../../../../Models/Constants';
import { defaultStatusColorVisual } from '../../../../../Models/Classes/3DVConfig';
import { IValidityState, TabNames } from '../BehaviorForm.types';
import { deepCopy } from '../../../../../Models/Services/Utils';

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorStatusForm';
const LOC_KEYS = {
    propertyDropdownLabel: `${ROOT_LOC}.propertyDropdownLabel`,
    stateItemLabel: `${ROOT_LOC}.stateItemLabel`,
    notice: `${ROOT_LOC}.notice`,
    noElementsSelected: `${ROOT_LOC}.noElementsSelected`
};

interface IStatesTabProps {
    onValidityChange: (tabName: TabNames, state: IValidityState) => void;
}
const StatesTab: React.FC<IStatesTabProps> = ({ onValidityChange }) => {
    const { t } = useTranslation();
    const { config, sceneId, adapter, state } = useContext(SceneBuilderContext);
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );
    const [isPropertyListLoading, setIsPropertyListLoading] = useState(true);
    const [areValueRangesValid, setAreValueRangesValid] = useState(true);
    // const [isTabValid, setIsTabValid] = useState(true);
    const [propertyOptions, setPropertyOptions] = useState<IDropdownOption[]>(
        []
    );
    const [
        statusVisualToEdit,
        setStatusVisualToEdit
    ] = useState<IStatusColoringVisual>(() => {
        if (state.builderMode === ADT3DSceneBuilderMode.CreateBehavior) {
            return defaultStatusColorVisual;
        } else {
            return getStatusFromBehavior(behaviorToEdit);
        }
    });
    const valueRangeRef = useRef<IValueRangeBuilderHandle>(null);

    useEffect(() => {
        console.log('**fetching properties');
        adapter
            .getTwinPropertiesForBehaviorWithFullName(
                sceneId,
                config,
                behaviorToEdit
            )
            .then((properties) => {
                console.log(
                    '**Finished fetching properties: ',
                    properties.length
                );
                setIsPropertyListLoading(false);
                if (properties?.length) {
                    setPropertyOptions(
                        buildPropertyDropdownOptions(properties)
                    );
                }
            });
    }, [behaviorToEdit, behaviorToEdit.datasources, config, sceneId]);

    useEffect(() => {
        console.log(`**State tab validity change: ${areValueRangesValid}`);
        onValidityChange('Status', {
            isValid: areValueRangesValid
        });
    }, [areValueRangesValid, behaviorToEdit, onValidityChange]);

    const onPropertyChange = useCallback(
        (_e, option: IDropdownOption) => {
            setBehaviorToEdit(
                produce((draft) => {
                    // Assuming only 1 status visual per behavior
                    const stateVisual = getStatusFromBehavior(draft);
                    // Edit flow
                    if (stateVisual) {
                        stateVisual.statusValueExpression = option.data;
                    } else {
                        const statusVisual = deepCopy(defaultStatusColorVisual);
                        statusVisual.statusValueExpression = option.data;
                        draft.visuals.push(statusVisual);
                        setStatusVisualToEdit(statusVisual);
                    }
                })
            );
        },
        [setBehaviorToEdit, setStatusVisualToEdit]
    );

    const theme = useTheme();
    const hasProperties = propertyOptions.length;
    const showRangeBuilder = statusVisualToEdit.statusValueExpression;
    return (
        <Stack tokens={sectionStackTokens}>
            <Text styles={{ root: { color: theme.palette.neutralSecondary } }}>
                {t(LOC_KEYS.notice)}
            </Text>
            <Dropdown
                data-testid={'behavior-form-state-dropdown'}
                disabled={!hasProperties}
                errorMessage={
                    !hasProperties &&
                    !isPropertyListLoading &&
                    t(LOC_KEYS.noElementsSelected)
                }
                label={t(LOC_KEYS.propertyDropdownLabel)}
                onChange={onPropertyChange}
                options={propertyOptions}
            />
            {showRangeBuilder && <Separator />}
            {showRangeBuilder && (
                <ValueRangeBuilder
                    initialValueRanges={statusVisualToEdit.valueRanges}
                    minRanges={0}
                    ref={valueRangeRef}
                    setAreRangesValid={setAreValueRangesValid}
                />
            )}
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 12 };
function buildPropertyDropdownOptions(properties: string[]): IDropdownOption[] {
    return properties.map((x) => ({
        key: x,
        data: x,
        text: x
    }));
}

export default StatesTab;
