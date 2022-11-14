import { isNumericType } from '../../Components/ADT3DSceneBuilder/Internal/VisualRuleForm/VisualRuleFormUtility';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import { DTwin } from '../Constants/Interfaces';
import { parseLinkedTwinExpression } from '../Services/Utils';
import {
    IDTDLPropertyType,
    IValueRange
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';

/**
 * Function to determine if visual will be shown based on an evaluated expression
 */
export function shouldShowVisual(
    propertyType: IDTDLPropertyType | undefined,
    twins: Record<string, DTwin>,
    valueExpression: string,
    values: (number | string | boolean)[]
): boolean {
    const evaluatedExpression = parseLinkedTwinExpression(
        valueExpression,
        twins
    );
    if (propertyType === 'boolean') {
        return values[0] === evaluatedExpression;
    } else if (propertyType === 'string') {
        return values.includes(evaluatedExpression);
    } else if (isNumericType(propertyType)) {
        return ViewerConfigUtility.getValueIsWithinRange(
            values as number[],
            evaluatedExpression as number
        );
    } else {
        // Return false since other property types are not yet supported
        return false;
    }
}

/** Utility that returns if a Condition contains or not a badge icon */
export const hasBadge = (condition: IValueRange): boolean => {
    return !!(condition.visual && condition.visual.iconName);
};
