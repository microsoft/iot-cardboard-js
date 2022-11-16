import { IConsoleLogFunction } from '../../../../Models/Constants';
import {
    IDTDLPropertyType,
    IExpressionRangeType,
    IValueRange
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IVisualRuleFormState } from '../Behaviors/VisualRules/VisualRules.types';
import { Condition, ConditionType } from './Internal/ConditionsList.types';
import i18n from '../../../../i18n';
import { IPickerOption } from '../../../Pickers/Internal/Picker.base.types';
import { TFunction } from 'react-i18next';
import { hasBadge } from '../../../../Models/SharedUtils/VisualRuleUtils';

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
    values: unknown[],
    t: TFunction<string>
): string {
    if (type === 'NumericRange') {
        return `${values[0]} (${t('minLower')}) ${t('to')} ${values[1]} (${t(
            'maxLower'
        )})`;
    } else {
        return values.join(', ');
    }
}

/** Create Conditions view model from config types */
export const transformValueRangesIntoConditions = (
    valueRanges: IValueRange[],
    expressionType: IExpressionRangeType,
    t: TFunction<string>
): Condition[] => {
    if (valueRanges) {
        return valueRanges.map((condition) => {
            const hasLabel = !!condition.visual.labelExpression;
            const conditionType = condition.visual.iconName
                ? ConditionType.Badge
                : ConditionType.MeshColoring;
            return {
                id: condition.id,
                primaryText: hasLabel
                    ? condition.visual.labelExpression
                    : `${i18n.t(
                          '3dSceneBuilder.visualRuleForm.unlabeledCondition'
                      )}`,
                secondaryText: getConditionSecondaryText(
                    expressionType,
                    condition.values,
                    t
                ),
                type: conditionType,
                iconName: condition.visual.iconName,
                color: condition.visual.color,
                isUnlabeled: !hasLabel,
                hasBadge: hasBadge(condition)
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

/** Check if property type is numeric */
export const isNumericType = (type: IDTDLPropertyType): boolean => {
    const numericTypes: IDTDLPropertyType[] = [
        'double',
        'float',
        'integer',
        'long'
    ];
    return numericTypes.includes(type);
};

/** Get color for new condition */
export const getNextColor = (
    valueRanges: IValueRange[],
    colorSwatch: IPickerOption[]
) => {
    const randomColor =
        colorSwatch[Math.floor(Math.random() * colorSwatch.length)]?.item ||
        '#FF000';

    for (const { item } of colorSwatch) {
        if (!valueRanges.map((vr) => vr.visual.color).includes(item)) {
            return item;
        }
    }
    return randomColor;
};
