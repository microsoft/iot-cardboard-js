import produce, { current } from 'immer';
import {
    AddOrUpdateListItemByFilter,
    RemoveItemsFromListByFilter
} from '../../../../Models/Context/BehaviorFormContext/BehaviorFormContextUtility';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IVisualRuleFormState,
    VisualRuleFormActionType,
    VisualRuleFormAction,
    IVisualRuleFormReducerType
} from '../Behaviors/VisualRules/VisualRules.types';
import { isStateDirty } from './VisualRuleFormUtility';

const debugLogging = false;
const logDebugConsole = getDebugLogger('VisualRuleForm', debugLogging);

export const defaultVisualRuleFormState: IVisualRuleFormState = {
    originalVisualRule: null,
    visualRuleToEdit: null,
    isDirty: false
};

export const VisualRuleFormReducer: IVisualRuleFormReducerType = produce(
    (draft: IVisualRuleFormState, action: VisualRuleFormAction) => {
        logDebugConsole(
            'info',
            `Updating VisualRuleForm ${action.type} with: {payload, visualRule}`,
            (action as any).payload, // ignore that payload doesn't always come since this is just a log
            current(draft.visualRuleToEdit)
        );
        switch (action.type) {
            case VisualRuleFormActionType.FORM_VISUAL_RULE_DISPLAY_NAME_SET: {
                draft.visualRuleToEdit.displayName = action.payload.name;
                break;
            }
            case VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_SET: {
                draft.visualRuleToEdit.valueExpression =
                    action.payload.expression;
                break;
            }
            case VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_TYPE_SET: {
                draft.visualRuleToEdit.expressionType = action.payload.type;
                break;
            }
            case VisualRuleFormActionType.FORM_CONDITION_ADD_OR_UPDATE: {
                draft.visualRuleToEdit.valueRanges = AddOrUpdateListItemByFilter(
                    draft.visualRuleToEdit.valueRanges,
                    action.payload.condition,
                    (x) => x.id === action.payload.condition.id,
                    logDebugConsole
                );
                break;
            }
            case VisualRuleFormActionType.FORM_CONDITION_REMOVE: {
                draft.visualRuleToEdit.valueRanges = RemoveItemsFromListByFilter(
                    draft.visualRuleToEdit.valueRanges,
                    (x) => x.id === action.payload.conditionId,
                    logDebugConsole
                );
                break;
            }
        }
        // check for changes after every action
        draft.isDirty = isStateDirty(draft, logDebugConsole);
    },
    defaultVisualRuleFormState
);
