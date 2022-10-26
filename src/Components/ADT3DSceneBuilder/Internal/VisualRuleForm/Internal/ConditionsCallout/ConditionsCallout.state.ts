import produce, { current } from 'immer';
import { getDefaultCondition } from '../../../../../../Models/Classes/3DVConfig';
import {
    deepCopy,
    getDebugLogger
} from '../../../../../../Models/Services/Utils';
import { isStateDirty } from './ConditionCalloutUtility';
import {
    ConditionCalloutAction,
    ConditionCalloutActionType,
    ConditionCalloutReducerType,
    IConditionCalloutState
} from './ConditionsCallout.types';

const debugLogging = true;
const logDebugConsole = getDebugLogger('Condition', debugLogging);

export const defaultConditionCalloutState: IConditionCalloutState = {
    originalCondition: getDefaultCondition('integer'),
    conditionToEdit: getDefaultCondition('integer'),
    isDirty: false
};

export const ConditionCalloutReducer: ConditionCalloutReducerType = produce(
    (draft: IConditionCalloutState, action: ConditionCalloutAction) => {
        logDebugConsole(
            'info',
            `Updating ConditionCallout ${action.type} with: {payload, visualRule}`,
            (action as any).payload, // ignore that payload doesn't always come since this is just a log
            current(draft.conditionToEdit)
        );
        switch (action.type) {
            /** Condition actions */
            case ConditionCalloutActionType.FORM_CONDITION_COLOR_SET: {
                draft.conditionToEdit.visual.color = action.payload.color;
                break;
            }
            case ConditionCalloutActionType.FORM_CONDITION_ICON_SET: {
                draft.conditionToEdit.visual.iconName = action.payload.iconName;
                break;
            }
            case ConditionCalloutActionType.FORM_CONDITION_LABEL_SET: {
                draft.conditionToEdit.visual.labelExpression =
                    action.payload.label;
                break;
            }
            case ConditionCalloutActionType.FORM_CONDITION_VALUES_SET: {
                draft.conditionToEdit.values = action.payload.values;
                break;
            }
            case ConditionCalloutActionType.INITIALIZE_CONDITION: {
                const resetValueRange = deepCopy(action.payload.valueRange);
                draft.conditionToEdit = resetValueRange;
                draft.originalCondition = resetValueRange;
                break;
            }
            /** Numerical values actions */
            case ConditionCalloutActionType.FORM_CONDITION_NUMERICAL_VALUES_SET: {
                break;
            }
            case ConditionCalloutActionType.FORM_CONDITION_SNAP_VALUE_TO_INFINITY: {
                break;
            }
        }
        // check for changes after every action
        draft.isDirty = isStateDirty(draft, logDebugConsole);
    },
    defaultConditionCalloutState
);
