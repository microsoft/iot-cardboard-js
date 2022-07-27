import { ISpinButtonStyles, SpinButton, Position } from '@fluentui/react';
import React from 'react';
import { getNumericPart } from '../../Models/Services/Utils';

type Props = {
    min: number;
    max: number;
    step: number;
    suffix: string;
    onIncrement: (newValue: number) => any;
    onDecrement: (newValue: number) => any;
    onChange: (newValue: number) => any;
    label: string;
    width: number;
    value: number;
};

/** Increment the value (or return nothing to keep the previous value if invalid) */
const onIncrementSpinner = (
    value: string,
    max: number,
    suffix: string,
    step: number
): string | void => {
    const numericValue = getNumericPart(value);
    if (numericValue !== undefined) {
        return String(Math.min(numericValue + step, max)) + ' ' + suffix;
    }
};

/** Decrement the value (or return nothing to keep the previous value if invalid) */
const onDecrementSpinner = (
    value: string,
    min: number,
    suffix: string,
    step: number
): string | void => {
    const numericValue = getNumericPart(value);
    if (numericValue !== undefined) {
        return String(Math.max(numericValue - step, min)) + ' ' + suffix;
    }
};

/**
 * Clamp the value within the valid range (or return nothing to keep the previous value
 * if there's not valid numeric input)
 */
const onValidateInput = (
    value: string,
    min: number,
    max: number,
    suffix: string
): string => {
    let numericValue = getNumericPart(value);
    if (numericValue !== undefined) {
        numericValue = Math.min(numericValue, max);
        numericValue = Math.max(numericValue, min);
        return String(numericValue) + ' ' + suffix;
    } else return '';
};

const NumericSpinInput = ({
    label,
    max,
    min,
    onChange,
    onDecrement,
    onIncrement,
    step,
    suffix,
    width,
    value
}: Props) => {
    const spinButtonStyles: Partial<ISpinButtonStyles> = {
        spinButtonWrapper: { width }
    };

    return (
        <SpinButton
            label={label}
            labelPosition={Position.top}
            value={onValidateInput(String(value), min, max, suffix)}
            onChange={(_e, newValue) => {
                const numericPart = getNumericPart(newValue);
                if (numericPart) {
                    onChange(numericPart);
                }
            }}
            onIncrement={(value) => {
                const newVal = onIncrementSpinner(value, max, suffix, step);
                newVal && onIncrement(getNumericPart(newVal));
            }}
            onDecrement={(value) => {
                const newVal = onDecrementSpinner(value, min, suffix, step);
                newVal && onDecrement(getNumericPart(newVal));
            }}
            onValidate={(value) => {
                return onValidateInput(value, min, max, suffix);
            }}
            incrementButtonAriaLabel={`Increase value by ${step}`}
            decrementButtonAriaLabel={`Decrease value by ${step}`}
            styles={spinButtonStyles}
        />
    );
};

export default NumericSpinInput;
