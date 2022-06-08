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
import {
    IBehavior,
    IExpressionRangeVisual
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
import { DOCUMENTATION_LINKS } from '../../../../../Models/Constants';
import { useBehaviorFormContext } from './BehaviorFormContext/BehaviorFormContext';
import { BehaviorFormContextActionType } from './BehaviorFormContext/BehaviorFormContext.types';

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorStatusForm';
const LOC_KEYS = {
    stateItemLabel: `${ROOT_LOC}.stateItemLabel`,
    tabDescription: `${ROOT_LOC}.tabDescription`,
    noElementsSelected: `${ROOT_LOC}.noElementsSelected`
};

interface IStatusTabProps {
    onValidityChange: (tabName: TabNames, state: IValidityState) => void;
}
const StatusTab: React.FC<IStatusTabProps> = ({ onValidityChange }) => {
    // contexts
    const {
        adapter,
        config,
        sceneId,
        state: { selectedElements }
    } = useContext(SceneBuilderContext);
    const {
        behaviorFormDispatch,
        behaviorFormState
    } = useBehaviorFormContext();

    // hooks
    const { t } = useTranslation();

    const statusVisualToEdit =
        getStatusFromBehavior(behaviorFormState.behaviorToEdit) ||
        defaultStatusColorVisual;

    const {
        valueRangeBuilderState,
        valueRangeBuilderReducer,
        resetInitialValueRanges
    } = useValueRangeBuilder({
        initialValueRanges: statusVisualToEdit.valueRanges,
        minRanges: 1
    });

    const validateForm = useCallback(
        (visual: IExpressionRangeVisual) => {
            let isValid = true;
            if (visual) {
                // only look at the ranges when the expression is populated
                if (visual.valueExpression) {
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
        (propertyName: keyof IExpressionRangeVisual, value: string) => {
            // Assuming only 1 alert visual per behavior
            let statusVisual = getStatusFromBehavior(
                behaviorFormState.behaviorToEdit
            );
            // Edit flow
            if (statusVisual) {
                // selected the none option, clear the visual
                if (!value) {
                    behaviorFormDispatch({
                        type:
                            BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_REMOVE
                    });
                } else {
                    // update the value
                    statusVisual[propertyName as any] = value as any;

                    behaviorFormDispatch({
                        type:
                            BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE,
                        payload: { visual: statusVisual }
                    });
                }
            } else {
                // create flow
                statusVisual = deepCopy(defaultStatusColorVisual);
                statusVisual[propertyName as any] = value as any;
                statusVisual.valueRanges = valueRangeBuilderState.valueRanges;
                resetInitialValueRanges(valueRangeBuilderState.valueRanges);

                behaviorFormDispatch({
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE,
                    payload: { visual: statusVisual }
                });
            }
            // check form validity
            validateForm(statusVisual);
        },
        [
            behaviorFormState.behaviorToEdit,
            validateForm,
            behaviorFormDispatch,
            valueRangeBuilderState.valueRanges,
            resetInitialValueRanges
        ]
    );

    // Mirror value ranges in behavior to edit
    useEffect(() => {
        // Assuming only 1 status visual per behavior
        const statusVisual = getStatusFromBehavior(
            behaviorFormState.behaviorToEdit
        );
        if (statusVisual) {
            statusVisual.valueRanges = valueRangeBuilderState.valueRanges;
        }
        behaviorFormDispatch({
            type:
                BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE,
            payload: { visual: statusVisual }
        });
    }, [
        behaviorFormDispatch,
        behaviorFormState.behaviorToEdit,
        valueRangeBuilderState.valueRanges
    ]);

    // update validity when range validity changes
    useEffect(() => {
        validateForm(getStatusFromBehavior(behaviorFormState.behaviorToEdit));
    }, [
        behaviorFormState.behaviorToEdit,
        validateForm,
        valueRangeBuilderState.areRangesValid
    ]);

    const onPropertyChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setProperty('valueExpression', newPropertyExpression.expression),
        [setProperty]
    );

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    const showRangeBuilder = !!statusVisualToEdit.valueExpression;
    return (
        <Stack tokens={sectionStackTokens}>
            <Text className={commonPanelStyles.text}>
                {t(LOC_KEYS.tabDescription)}
            </Text>
            <div>
                <ModelledPropertyBuilder
                    adapter={adapter}
                    customLabelTooltip={{
                        buttonAriaLabel: t(
                            '3dSceneBuilder.behaviorStatusForm.propertyExpressionTooltipContent'
                        ),
                        calloutContent: t(
                            '3dSceneBuilder.behaviorStatusForm.propertyExpressionTooltipContent'
                        ),
                        link: {
                            url: DOCUMENTATION_LINKS.howToExpressions
                        }
                    }}
                    twinIdParams={{
                        behavior: behaviorFormState.behaviorToEdit,
                        config,
                        sceneId,
                        selectedElements
                    }}
                    mode={ModelledPropertyBuilderMode.TOGGLE}
                    isClearEnabled={true}
                    propertyExpression={{
                        expression:
                            getStatusFromBehavior(
                                behaviorFormState.behaviorToEdit
                            )?.valueExpression || ''
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
