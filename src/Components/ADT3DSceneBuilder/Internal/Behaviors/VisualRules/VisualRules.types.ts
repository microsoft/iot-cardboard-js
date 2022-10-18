import {
    IExpressionRangeType,
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
