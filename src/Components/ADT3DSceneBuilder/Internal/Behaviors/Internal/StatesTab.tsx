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

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorStatusForm';
const LOC_KEYS = {
    propertyDropdownLabel: `${ROOT_LOC}.propertyDropdownLabel`,
    stateItemLabel: `${ROOT_LOC}.stateItemLabel`,
    notice: `${ROOT_LOC}.notice`
};

const StatesTab: React.FC = () => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );
    const [areValueRangesValid, setAreValueRangesValid] = useState(true);
    const [propertyOptions, setPropertyOptions] = useState<IDropdownOption[]>(
        []
    );
    const [
        statusVisualToEdit,
        setStatusVisualToEdit
    ] = useState<IStatusColoringVisual>(defaultStatusColorVisual);
    const valueRangeRef = useRef<IValueRangeBuilderHandle>(null);
    const { config, sceneId, adapter, state } = useContext(SceneBuilderContext);

    useEffect(() => {
        adapter
            .getTwinPropertiesForBehaviorWithFullName(
                sceneId,
                config,
                behaviorToEdit
            )
            .then((properties) => {
                if (properties?.length) {
                    setPropertyOptions(
                        buildPropertyDropdownOptions(properties)
                    );
                }
            });
    }, [behaviorToEdit, behaviorToEdit.datasources, config, sceneId]);

    console.log(`**${areValueRangesValid}`);
    // useEffect(() => {
    //     const {
    //         valueExpression,
    //         widgetConfiguration: { label }
    //     } = formData;

    //     if (
    //         valueExpression?.length > 0 &&
    //         label?.length > 0 &&
    //         areValueRangesValid
    //     ) {
    //         setIsWidgetConfigValid(true);
    //     } else {
    //         setIsWidgetConfigValid(false);
    //     }
    // }, [behaviorToEdit, areValueRangesValid]);

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
                        alert('Not implemented: need to do create flow');
                    }
                })
            );
        },
        [setBehaviorToEdit]
    );

    useEffect(() => {
        console.log(`**Builder mode changed: ${state.builderMode}`);
        let stateVisual: IStatusColoringVisual;
        if (state.builderMode === ADT3DSceneBuilderMode.CreateBehavior) {
            stateVisual = defaultStatusColorVisual;
        } else {
            stateVisual = getStatusFromBehavior(behaviorToEdit);
        }
        setStatusVisualToEdit(stateVisual);
    }, [state.builderMode]);

    const theme = useTheme();
    const hasProperties = propertyOptions.length;
    return (
        <Stack tokens={sectionStackTokens}>
            <Text styles={{ root: { color: theme.palette.neutralSecondary } }}>
                {t(LOC_KEYS.notice)}
            </Text>
            <Dropdown
                data-testid={'behavior-form-state-dropdown'}
                defaultSelectedKey={propertyOptions?.[0]?.key}
                disabled={!hasProperties}
                errorMessage={!hasProperties && 'No elements selected'}
                label={t(LOC_KEYS.propertyDropdownLabel)}
                onChange={onPropertyChange}
                options={propertyOptions}
            />
            {hasProperties && <Separator />}
            <ValueRangeBuilder
                initialValueRanges={statusVisualToEdit.valueRanges}
                minRanges={1}
                ref={valueRangeRef}
                setAreRangesValid={setAreValueRangesValid}
            />
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
