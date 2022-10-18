import produce, { current } from 'immer';
import {
    AddOrUpdateListItemByFilter,
    RemoveItemsFromListByFilter
} from '../../../../Models/Context/BehaviorFormContext/BehaviorFormContextUtility';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IValueRange } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IVisualRuleFormState,
    VisualRuleFormActionType,
    VisualRuleFormAction,
    IVisualRuleFormReducerType
} from '../Behaviors/VisualRules/VisualRules.types';
import { getValuesFromMap, isStateDirty } from './VisualRuleFormUtility';

const debugLogging = false;
const logDebugConsole = getDebugLogger('VisualRuleForm', debugLogging);

export const defaultVisualRuleFormState: IVisualRuleFormState = {
    conditionsHistoryMap: new Map<string, IValueRange[]>(),
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
                draft.visualRuleToEdit.displayName = action.payload.name.trim();
                break;
            }
            case VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_SET: {
                draft.visualRuleToEdit.valueExpression = action.payload.expression.trim();
                break;
            }
            case VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_TYPE_SET: {
                draft.visualRuleToEdit.expressionType = action.payload.type;
                break;
            }
            case VisualRuleFormActionType.FORM_VISUAL_RULE_VALUE_RANGE_TYPE_SET: {
                // In case expression property type changes:
                // 1. Store existing conditions mapped to their expression property type
                // 2. If conditions exist for the new type selected, restore them
                if (
                    draft.visualRuleToEdit.valueRangeType !==
                    action.payload.type
                ) {
                    draft.conditionsHistoryMap.set(
                        draft.visualRuleToEdit.valueRangeType,
                        draft.visualRuleToEdit.valueRanges
                    );
                    draft.visualRuleToEdit.valueRanges = getValuesFromMap(
                        action.payload.type,
                        draft.conditionsHistoryMap
                    );
                }
                draft.visualRuleToEdit.valueRangeType = action.payload.type;
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
