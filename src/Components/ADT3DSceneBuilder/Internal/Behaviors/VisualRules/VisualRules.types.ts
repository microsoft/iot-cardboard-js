import {
    IDTDLPropertyType,
    IExpressionRangeType,
    IExpressionRangeVisual,
    IValueRange
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IVisualRulesListProps {
    ruleItems: IVisualRule[];
    onRemoveRule: (ruleId: string) => void;
    onEditRule: (ruleId: string) => void;
}

export interface IVisualRule {
    id: string;
    displayName: string;
    conditions: IValueRange[];
    type: IExpressionRangeType;
}

/** Reducer types */
export type IVisualRuleFormReducerType = (
    draft: IVisualRuleFormState,
    action: VisualRuleFormAction
) => IVisualRuleFormState;
export interface IVisualRuleFormState {
    conditionsHistoryMap: Map<string, IValueRange[]>;
    originalVisualRule: IExpressionRangeVisual;
    visualRuleToEdit: IExpressionRangeVisual;
    isDirty: boolean;
}

export enum VisualRuleFormActionType {
    /** Visual rule actions */
    FORM_VISUAL_RULE_DISPLAY_NAME_SET = 'FORM_VISUAL_RULE_DISPLAY_NAME_SET',
    FORM_VISUAL_RULE_EXPRESSION_SET = 'FORM_VISUAL_RULE_EXPRESSION_SET',
    FORM_VISUAL_RULE_EXPRESSION_TYPE_SET = 'FORM_VISUAL_RULE_EXPRESSION_TYPE_SET',
    FORM_VISUAL_RULE_VALUE_RANGE_TYPE_SET = 'FORM_VISUAL_RULE_VALUE_RANGE_TYPE_SET',
    /** Condition actions */
    FORM_CONDITION_ADD_OR_UPDATE = 'FORM_CONDITION_ADD_OR_UPDATE',
    FORM_CONDITION_REMOVE = 'FORM_CONDITION_REMOVE'
}

export type VisualRuleFormAction =
    // VISUAL RULE PROPERTIES
    | {
          type: VisualRuleFormActionType.FORM_VISUAL_RULE_DISPLAY_NAME_SET;
          payload: { name: string };
      }
    | {
          type: VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_SET;
          payload: { expression: string };
      }
    | {
          type: VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_TYPE_SET;
          payload: { type: IExpressionRangeType };
      }
    | {
          type: VisualRuleFormActionType.FORM_VISUAL_RULE_VALUE_RANGE_TYPE_SET;
          payload: {
              type: IDTDLPropertyType;
          };
      }
    // CONDITIONS
    | {
          type: VisualRuleFormActionType.FORM_CONDITION_ADD_OR_UPDATE;
          payload: { condition: IValueRange };
      }
    | {
          type: VisualRuleFormActionType.FORM_CONDITION_REMOVE;
          payload: { conditionId: string };
      };
