import React, { useCallback, useContext, useEffect } from 'react';
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
import ValueRangeBuilder from '../../../../ValueRangeBuilder/ValueRangeBuilder';
import { defaultStatusColorVisual } from '../../../../../Models/Classes/3DVConfig';
import { IValidityState, TabNames } from '../BehaviorForm.types';
import { deepCopy } from '../../../../../Models/Services/Utils';
import TwinPropertyDropown from './TwinPropertyDropdown';
import useValueRangeBuilder from '../../../../../Models/Hooks/useValueRangeBuilder';

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorStatusForm';
const LOC_KEYS = {
    stateItemLabel: `${ROOT_LOC}.stateItemLabel`,
    notice: `${ROOT_LOC}.notice`,
    noElementsSelected: `${ROOT_LOC}.noElementsSelected`
};

interface IStatesTabProps {
    onValidityChange: (tabName: TabNames, state: IValidityState) => void;
}
const StatesTab: React.FC<IStatesTabProps> = ({ onValidityChange }) => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );

    const statusVisualToEdit =
        getStatusFromBehavior(behaviorToEdit) || defaultStatusColorVisual;

    const {
        state: valueRangeBuilderState,
        valueRangeBuilderReducer
    } = useValueRangeBuilder({
        initialValueRanges: statusVisualToEdit.valueRanges,
        minRanges: 1
    });

    useEffect(() => {
        onValidityChange('Status', {
            isValid: valueRangeBuilderState.areRangesValid
        });
    }, [
        valueRangeBuilderState.areRangesValid,
        behaviorToEdit,
        onValidityChange
    ]);

    const onPropertyChange = useCallback(
        (option: string) => {
            setBehaviorToEdit(
                produce((draft) => {
                    // Assuming only 1 status visual per behavior
                    const stateVisual = getStatusFromBehavior(draft);
                    // Edit flow
                    if (stateVisual) {
                        // selected the none option, clear the data
                        if (!option) {
                            const index = draft.visuals.indexOf(stateVisual);
                            draft.visuals.splice(index, 1);
                        } else {
                            stateVisual.statusValueExpression = option;
                        }
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

    // Mirror value ranges in behavior to edit
    useEffect(() => {
        setBehaviorToEdit(
            produce((draft) => {
                // Assuming only 1 status visual per behavior
                const stateVisual = getStatusFromBehavior(draft);
                if (stateVisual) {
                    stateVisual.valueRanges =
                        valueRangeBuilderState.valueRanges;
                }
            })
        );
    }, [valueRangeBuilderState.valueRanges]);

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
                    valueRangeBuilderReducer={valueRangeBuilderReducer}
                />
            )}
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default StatesTab;
