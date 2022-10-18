import { IConsoleLogFunction } from '../../../../Models/Constants';
import {
    IDTDLPropertyType,
    IExpressionRangeType,
    IValueRange
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IVisualRuleFormState } from '../Behaviors/VisualRules/VisualRules.types';
import { Condition, ConditionType } from './Internal/ConditionsList.types';
import i18n from '../../../../i18n';

/**
 * Looks at the state and determines whether anything has been changed
 * @param state the current state of the form contains both draft and original state
 * @returns boolean indicating whether anything has been changed
 */
export function isStateDirty(
    state: IVisualRuleFormState,
    logger: IConsoleLogFunction
): boolean {
    const newVisualRule = state.visualRuleToEdit;

    const hasVisualRuleChanged =
        JSON.stringify(newVisualRule) !==
        JSON.stringify(state.originalVisualRule);
    logger('debug', `hasVisualRuleChanged: ${hasVisualRuleChanged}`);

    return hasVisualRuleChanged;
}

/**
 * Generates secondary text for Conditions view model
 */
export function getConditionSecondaryText(
    type: IExpressionRangeType,
    values: unknown[]
): string {
    if (type === 'NumericRange') {
        return `${values[0]} ${i18n.t('min')} - ${values[1]} ${i18n.t('max')}`;
    } else {
        return values.join(', ');
    }
}

/** Create Conditions view model from config types */
export const transformValueRangesIntoConditions = (
    valueRanges: IValueRange[],
    expressionType: IExpressionRangeType
): Condition[] => {
    if (valueRanges) {
        return valueRanges.map((condition) => {
            const conditionType = condition.visual.iconName
                ? ConditionType.Badge
                : ConditionType.MeshColoring;
            return {
                id: condition.id,
                primaryText: condition.visual.labelExpression
                    ? condition.visual.labelExpression
                    : `(${i18n.t(
                          '3dSceneBuilder.visualRuleForm.unlabeledCondition'
                      )})`,
                secondaryText: getConditionSecondaryText(
                    expressionType,
                    condition.values
                ),
                type: conditionType,
                iconName: condition.visual.iconName,
                color: condition.visual.color
            };
        });
    } else {
        return [];
    }
};

/** Choose values from temporary valueRangeMap, in case user has gone back and forth from one type to another */
export const getValuesFromMap = (
    selectedType: IDTDLPropertyType,
    valueRangeMap: Map<string, IValueRange[]>
): IValueRange[] => {
    if (valueRangeMap.has(selectedType)) {
        return valueRangeMap.get(selectedType);
    } else {
        return [];
    }
};
