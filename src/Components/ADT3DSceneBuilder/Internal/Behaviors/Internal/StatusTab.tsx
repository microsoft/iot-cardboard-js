import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import ValueRangeBuilder from '../../../../ValueRangeBuilder/ValueRangeBuilder';
import { defaultStatusColorVisual } from '../../../../../Models/Classes/3DVConfig';
import { IValidityState, TabNames } from '../BehaviorForm.types';
import { deepCopy } from '../../../../../Models/Services/Utils';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import useValueRangeBuilder from '../../../../../Models/Hooks/useValueRangeBuilder';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import ModelledPropertyBuilder from '../../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    numericPropertyValueTypes,
    PropertyExpression
} from '../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorStatusForm';
const LOC_KEYS = {
    stateItemLabel: `${ROOT_LOC}.stateItemLabel`,
    notice: `${ROOT_LOC}.notice`,
    noElementsSelected: `${ROOT_LOC}.noElementsSelected`
};

interface IStatusTabProps {
    onValidityChange: (tabName: TabNames, state: IValidityState) => void;
}
const StatusTab: React.FC<IStatusTabProps> = ({ onValidityChange }) => {
    const { t } = useTranslation();
    const {
        behaviorToEdit,
        setBehaviorToEdit,
        adapter,
        config,
        sceneId,
        state: { selectedElements }
    } = useContext(SceneBuilderContext);

    const statusVisualToEdit =
        getStatusFromBehavior(behaviorToEdit) || defaultStatusColorVisual;

    const {
        valueRangeBuilderState,
        valueRangeBuilderReducer,
        resetInitialValueRanges
    } = useValueRangeBuilder({
        initialValueRanges: statusVisualToEdit.valueRanges,
        minRanges: 1
    });

    const validateForm = useCallback(
        (visual: IStatusColoringVisual) => {
            let isValid = true;
            if (visual) {
                // only look at the ranges when the expression is populated
                if (visual.statusValueExpression) {
                    isValid = isValid && valueRangeBuilderState.areRangesValid;
                }
            }

            onValidityChange('Status', {
                isValid: isValid
            });
        },
        [valueRangeBuilderState.areRangesValid, onValidityChange]
    );

    const setProperty = useCallback(
        (propertyName: keyof IStatusColoringVisual, value: string) => {
            setBehaviorToEdit(
                produce((draft) => {
                    // Assuming only 1 alert visual per behavior
                    let statusVisual = getStatusFromBehavior(draft);
                    // Edit flow
                    if (statusVisual) {
                        // selected the none option, clear the data
                        if (!value) {
                            const index = draft.visuals.indexOf(statusVisual);
                            draft.visuals.splice(index, 1);
                        }
                        statusVisual[propertyName] = value as any;
                    } else {
                        statusVisual = deepCopy(defaultStatusColorVisual);
                        statusVisual[propertyName] = value as any;
                        statusVisual.valueRanges =
                            valueRangeBuilderState.valueRanges;
                        resetInitialValueRanges(
                            valueRangeBuilderState.valueRanges
                        );
                        draft.visuals.push(statusVisual);
                    }
                    // check form validity
                    validateForm(statusVisual);
                })
            );
        },
        [
            setBehaviorToEdit,
            getStatusFromBehavior,
            deepCopy,
            valueRangeBuilderState,
            resetInitialValueRanges,
            validateForm
        ]
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

    // update validity when range validity changes
    useEffect(() => {
        validateForm(getStatusFromBehavior(behaviorToEdit));
    }, [valueRangeBuilderState.areRangesValid]);

    const onPropertyChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setProperty(
                'statusValueExpression',
                newPropertyExpression.expression
            ),
        [setProperty]
    );

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    const showRangeBuilder = !!statusVisualToEdit.statusValueExpression;
    return (
        <Stack tokens={sectionStackTokens}>
            <Text className={commonPanelStyles.text}>{t(LOC_KEYS.notice)}</Text>
            <div>
                <ModelledPropertyBuilder
                    adapter={adapter}
                    twinIdParams={{
                        behavior: behaviorToEdit,
                        config,
                        sceneId,
                        selectedElements
                    }}
                    mode={ModelledPropertyBuilderMode.TOGGLE}
                    propertyExpression={{
                        expression:
                            getStatusFromBehavior(behaviorToEdit)
                                ?.statusValueExpression || ''
                    }}
                    onChange={onPropertyChange}
                    allowedPropertyValueTypes={numericPropertyValueTypes}
                    enableNoneDropdownOption
                />
                {showRangeBuilder && <Separator />}
            </div>
            {showRangeBuilder && (
                <ValueRangeBuilder
                    valueRangeBuilderReducer={valueRangeBuilderReducer}
                />
            )}
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 4 };

export default StatusTab;
