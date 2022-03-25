import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BehaviorFormContext } from '../BehaviorsForm';
import {
    IStackTokens,
    Separator,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import { IBehavior } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IValueRangeBuilderHandle } from '../../../../ValueRangeBuilder/ValueRangeBuilder.types';
import ValueRangeBuilder from '../../../../ValueRangeBuilder/ValueRangeBuilder';
import { defaultStatusColorVisual } from '../../../../../Models/Classes/3DVConfig';
import { IValidityState, TabNames } from '../BehaviorForm.types';
import { deepCopy } from '../../../../../Models/Services/Utils';
import TwinPropertyDropown from './TwinPropertyDropdown';

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorStatusForm';
const LOC_KEYS = {
    stateItemLabel: `${ROOT_LOC}.stateItemLabel`,
    notice: `${ROOT_LOC}.notice`,
    noElementsSelected: `${ROOT_LOC}.noElementsSelected`
};

interface IStatesTabProps {
    valueRangeRef: React.MutableRefObject<IValueRangeBuilderHandle>;
    onValidityChange: (tabName: TabNames, state: IValidityState) => void;
}
const StatesTab: React.FC<IStatesTabProps> = ({
    onValidityChange,
    valueRangeRef
}) => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );

    const [areValueRangesValid, setAreValueRangesValid] = useState(true);
    const statusVisualToEdit =
        getStatusFromBehavior(behaviorToEdit) || defaultStatusColorVisual;

    useEffect(() => {
        onValidityChange('Status', {
            isValid: areValueRangesValid
        });
    }, [areValueRangesValid, behaviorToEdit, onValidityChange]);

    const onPropertyChange = useCallback(
        (option: string) => {
            setBehaviorToEdit(
                produce((draft) => {
                    // Assuming only 1 status visual per behavior
                    const stateVisual = getStatusFromBehavior(draft);
                    // Edit flow
                    if (stateVisual) {
                        stateVisual.statusValueExpression = option;
                    } else {
                        const statusVisual = deepCopy(defaultStatusColorVisual);
                        statusVisual.statusValueExpression = option;
                        draft.visuals.push(statusVisual);
                    }
                })
            );
        },
        [setBehaviorToEdit]
    );

    const theme = useTheme();
    const showRangeBuilder = !!statusVisualToEdit.statusValueExpression;
    return (
        <Stack tokens={sectionStackTokens}>
            <Text styles={{ root: { color: theme.palette.neutralSecondary } }}>
                {t(LOC_KEYS.notice)}
            </Text>
            <TwinPropertyDropown
                behavior={behaviorToEdit}
                defaultSelectedKey={statusVisualToEdit.statusValueExpression}
                dataTestId={'behavior-form-state-property-dropdown'}
                onChange={onPropertyChange}
            />
            {showRangeBuilder && <Separator />}
            {showRangeBuilder && (
                <ValueRangeBuilder
                    initialValueRanges={statusVisualToEdit.valueRanges}
                    minRanges={1}
                    ref={valueRangeRef}
                    setAreRangesValid={setAreValueRangesValid}
                />
            )}
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default StatesTab;
