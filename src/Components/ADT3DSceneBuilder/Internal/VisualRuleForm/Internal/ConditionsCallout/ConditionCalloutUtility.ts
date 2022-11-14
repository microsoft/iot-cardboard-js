import { IConsoleLogFunction } from '../../../../../../Models/Constants/Types';
import { IDTDLPropertyType } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    ConditionValidityMap,
    IConditionCalloutState
} from './ConditionsCallout.types';
import { IValueRangeValidation } from './ConditionSummary.types';

/**
 * Looks at the state and determines whether anything has been changed
 * @param state the current state of the form contains both draft and original state
 * @returns boolean indicating whether anything has been changed
 */
export function isStateDirty(
    state: IConditionCalloutState,
    logger: IConsoleLogFunction
): boolean {
    const newCondition = state.conditionToEdit;

    const hasConditionChanged =
        JSON.stringify(newCondition) !==
        JSON.stringify(state.originalCondition);
    logger('debug', `hasConditionChanged: ${hasConditionChanged}`);

    return hasConditionChanged;
}

export function checkValidity(validityMap: ConditionValidityMap): boolean {
    return validityMap.label && validityMap.ranges;
}

/** Looks at a min-max value and determines if it is valid */
export const getRangeValidation = (values: string[]): IValueRangeValidation => {
    let minValid = false,
        maxValid = false,
        rangeValid = false,
        minNumeric,
        maxNumeric;

    try {
        minNumeric = Number(values[0]);
        if (!isNaN(minNumeric)) {
            minValid = true;
        }
        maxNumeric = Number(values[1]);
        if (!isNaN(maxNumeric)) {
            maxValid = true;
        }
        if (minValid && maxValid && minNumeric < maxNumeric) {
            rangeValid = true;
        }
    } catch (err) {
        console.error(err);
    }

    return {
        minValid,
        maxValid,
        rangeValid
    };
};

export const areRangesValid = (
    values: unknown[],
    type: IDTDLPropertyType
): boolean => {
    if (!values) {
        return false;
    }

    if (!(type === 'boolean' || type === 'string' || type === 'enum')) {
        const rangeValidation = getRangeValidation(values as string[]);
        return (
            rangeValidation.minValid &&
            rangeValidation.maxValid &&
            rangeValidation.rangeValid
        );
    }
    return true;
};
