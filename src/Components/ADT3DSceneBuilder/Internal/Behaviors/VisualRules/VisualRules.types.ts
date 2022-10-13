export interface IVisualRulesListProps {
    ruleItems: IVisualRule[];
    onRemoveRule: (ruleId: string) => void;
    onEditRule: (ruleId: string) => void;
}
export type IConditionsType = 'Badge' | 'Mesh coloring';

export interface IVisualRule {
    id: string;
    displayName: string;
    conditions: IConditionsType[];
}
