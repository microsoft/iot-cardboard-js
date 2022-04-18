import produce from 'immer';
import { defaultValueRangeColor } from '../../Models/Constants';
import { createGUID } from '../../Models/Services/Utils';
import { IValueRange } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { defaultSwatchColors } from '../../Theming/Palettes';
import {
    Boundary,
    IValueRangeBuilderState,
    ValueRangeBuilderAction,
    ValueRangeBuilderActionType
} from './ValueRangeBuilder.types';
import {
    isRangeOverlapFound,
    getRangeValidation,
    getNextColor,
    cleanValueRange,
    cleanValueOutput
} from './ValueRangeBuilder.utils';

export const defaultValueRangeBuilderState: IValueRangeBuilderState = {
    valueRanges: [],
    validationMap: {
        overlapFound: false,
        validation: {}
    },
    colorSwatch: defaultSwatchColors,
    minRanges: 0,
    maxRanges: null,
    areRangesValid: true
};

const defaultValueRange: Omit<IValueRange, 'id'> = {
    color: defaultValueRangeColor,
    min: 0,
    max: 'Infinity'
};

export const valueRangeBuilderReducer: (
    draft: IValueRangeBuilderState,
    action: ValueRangeBuilderAction
) => IValueRangeBuilderState = produce(
    (draft: IValueRangeBuilderState, action: ValueRangeBuilderAction) => {
        switch (action.type) {
            case ValueRangeBuilderActionType.SET_ARE_RANGES_VALID: {
                draft.areRangesValid = action.payload;
                break;
            }
            case ValueRangeBuilderActionType.ADD_VALUE_RANGE: {
                const { color, id } = action.payload;
                addValueRange(draft, id, color);
                break;
            }
            case ValueRangeBuilderActionType.PRE_FILL_VALUE_RANGES_TO_MIN_REQUIRED: {
                while (draft.valueRanges.length < draft.minRanges) {
                    const newId = createGUID();
                    const newColor = getNextColor(
                        draft.valueRanges,
                        draft.colorSwatch
                    );
                    addValueRange(draft, newId, newColor);
                }
                break;
            }

            case ValueRangeBuilderActionType.UPDATE_VALUE_RANGE: {
                const { boundary, id, newColor, newValue } = action.payload;
                updateValueRange(draft, id, boundary, newValue, newColor);
                break;
            }
            case ValueRangeBuilderActionType.DELETE_VALUE_RANGE: {
                const { id } = action.payload;
                // Remove value from value range list
                const valueRangeToRemove = draft.valueRanges.findIndex(
                    (vr) => vr.id === id
                );
                draft.valueRanges.splice(valueRangeToRemove, 1);

                // Remove validation entry
                delete draft.validationMap.validation[id];

                // Update overlapping IDs
                draft.validationMap.overlapFound = isRangeOverlapFound(
                    draft.valueRanges,
                    draft.validationMap
                );
                break;
            }
            case ValueRangeBuilderActionType.UPDATE_VALUE_RANGE_VALIDATION: {
                const { newValue, currentValueRange, isMin } = action.payload;
                updateValueRangeValidation(
                    draft,
                    currentValueRange,
                    newValue,
                    isMin
                );

                break;
            }
            case ValueRangeBuilderActionType.SNAP_VALUE_TO_INFINITY: {
                const {
                    boundary,
                    currentValueRange,
                    newValue
                } = action.payload;
                updateValueRange(
                    draft,
                    currentValueRange.id,
                    boundary,
                    newValue,
                    null
                );
                updateValueRangeValidation(
                    draft,
                    currentValueRange,
                    newValue,
                    boundary === Boundary.min
                );
                break;
            }
            default:
                break;
        }
    },
    defaultValueRangeBuilderState
);

const addValueRange = (
    draft: IValueRangeBuilderState,
    id: string,
    color: string
) => {
    // Add value range
    let newMin = Number('-Infinity');
    draft.valueRanges.forEach((vr) => {
        if (!isNaN(Number(vr.max)) && vr.max > newMin) {
            newMin = Number(vr.max);
        }
    });

    // If adding first value range -- set min to 0
    if (draft.valueRanges.length === 0) {
        newMin = 0;
    }

    const newValueRange = cleanValueRange({
        ...defaultValueRange,
        min: newMin,
        id,
        color
    });

    draft.valueRanges.push(newValueRange);

    // Add validation entry
    draft.validationMap.validation[id] = {
        minValid: true,
        maxValid: true,
        rangeValid: true
    };

    // Update min validation
    updateValueRangeValidation(
        draft,
        newValueRange,
        String(newValueRange.min),
        true
    );

    // Update max validation
    updateValueRangeValidation(
        draft,
        newValueRange,
        String(newValueRange.max),
        false
    );

    // Update overlapping IDs
    draft.validationMap.overlapFound = isRangeOverlapFound(
        draft.valueRanges,
        draft.validationMap
    );
};

const updateValueRange = (
    draft: IValueRangeBuilderState,
    id: string,
    boundary: Boundary,
    newValue: string,
    newColor: string
) => {
    const valueToUpdate = draft.valueRanges.find((vr) => vr.id === id);
    if (!valueToUpdate) return;

    if (newColor) {
        valueToUpdate.color = newColor;
    } else {
        const cleanValue = cleanValueOutput(newValue);
        boundary === Boundary.min
            ? (valueToUpdate.min = cleanValue)
            : (valueToUpdate.max = cleanValue);
    }
};

const updateValueRangeValidation = (
    draft: IValueRangeBuilderState,
    currentValueRange: IValueRange,
    newValue: string,
    isMin: boolean
) => {
    const newValueRangeToCheck: IValueRange = {
        ...currentValueRange,
        ...(isMin && { min: newValue as any }),
        ...(!isMin && { max: newValue as any })
    };

    const validation = getRangeValidation(newValueRangeToCheck);
    draft.validationMap.validation[currentValueRange.id] = validation;

    draft.validationMap.overlapFound = isRangeOverlapFound(
        draft.valueRanges,
        draft.validationMap
    );

    return validation;
};
