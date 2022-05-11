import { IValueRange } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IPickerOption } from '../Pickers/Internal/Picker.base.types';
import {
    IValueRangeValidationMap,
    IValueRangeValidation
} from './ValueRangeBuilder.types';

export const getValidationMapFromValueRanges = (valueRanges: IValueRange[]) => {
    const validationMap: IValueRangeValidationMap = {
        overlapFound: false,
        validation: {}
    };

    // Construct validation data
    valueRanges.forEach((vr) => {
        validationMap.validation[vr.id] = getRangeValidation(vr);
    });

    // Check for overlapping ranges
    validationMap.overlapFound = isRangeOverlapFound(
        valueRanges,
        validationMap
    );

    return validationMap;
};

export const getRangeValidation = (
    valueRange: IValueRange
): IValueRangeValidation => {
    let minValid = false,
        maxValid = false,
        rangeValid = false,
        minNumeric,
        maxNumeric;

    try {
        minNumeric = Number(valueRange.values[0]);
        if (!isNaN(minNumeric)) {
            minValid = true;
        }
        maxNumeric = Number(valueRange.values[1]);
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

export const areDistinctValueRangesValid = (
    validationMap: IValueRangeValidationMap
) => {
    let isValid = true;
    for (const key of Object.keys(validationMap.validation)) {
        const validationData = validationMap.validation[key];
        if (
            !validationData.maxValid ||
            !validationData.minValid ||
            !validationData.rangeValid
        ) {
            isValid = false;
            break;
        }
    }
    return isValid;
};

export const isRangeOverlapFound = (
    valueRanges: IValueRange[],
    validationMap: IValueRangeValidationMap
) => {
    // If basic validation (numeric and valid range) fails -- return empty
    if (!areDistinctValueRangesValid(validationMap)) {
        return false;
    }

    // Sort value ranges by min
    const sortedValueRanges = valueRanges.slice(0).sort((a, b) => {
        return Number(a.values[0]) - Number(b.values[0]);
    });

    // Verify all (max @ i) <= min @ i + 1
    let overlapFound = false;
    for (let i = 0; i < sortedValueRanges.length - 1; i++) {
        const valueRange = sortedValueRanges[i];
        const nextValueRange = sortedValueRanges[i + 1];

        if (valueRange.values[1] > nextValueRange.values[0]) {
            overlapFound = true;
            break;
        }
    }
    return overlapFound;
};

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

export const cleanValueRange = (valueRange: IValueRange): IValueRange => {
    const cleanRange = Object.assign({}, valueRange);

    return {
        ...cleanRange,
        values: [
            cleanValueOutput(cleanRange.values[0]),
            cleanValueOutput(cleanRange.values[1])
        ]
    };
};

export const cleanValueOutput = (value: any): number | string => {
    if (typeof value === 'number') {
        switch (value) {
            case Infinity:
                return 'Infinity';
            case -Infinity:
                return '-Infinity';
            default:
                return value;
        }
    }
    if (typeof value === 'string') {
        switch (value) {
            case 'Infinity':
            case '-Infinity':
                return value;
            default:
                return Number(value);
        }
    }
    return Number(value);
};
