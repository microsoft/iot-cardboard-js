import { IColorCellProps } from '@fluentui/react';
import produce, { current } from 'immer';
import { IValueRange } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    Boundary,
    IValueRangeBuilderState,
    ValueRangeBuilderAction,
    ValueRangeBuilderActionType
} from './ValueRangeBuilder.types';
import {
    getOverlappingIds,
    getRangeValidation
} from './ValueRangeBuilder.utils';

export const defaultSwatchColors: IColorCellProps[] = [
    { id: 'green', label: 'green', color: '#7DDF64' },
    { id: 'purple', label: 'purple', color: '#7A306C' },
    { id: 'yellow', label: 'yellow', color: '#E8AE68' },
    { id: 'blue', label: 'blue', color: '#3AAED8' },
    { id: 'red', label: 'red', color: '#E84855' }
];

export const defaultValueRangeBuilderState: IValueRangeBuilderState = {
    valueRanges: [],
    validationMap: {
        overlappingIds: [],
        validation: {}
    },
    colorSwatch: defaultSwatchColors
};

const defaultValueRange: Omit<IValueRange, 'id'> = {
    color: '#FF0000',
    min: Number('-Infinity'),
    max: Number('Infinity')
};

export const valueRangeBuilderReducer: (
    draft: IValueRangeBuilderState,
    action: ValueRangeBuilderAction
) => IValueRangeBuilderState = produce(
    (draft: IValueRangeBuilderState, action: ValueRangeBuilderAction) => {
        switch (action.type) {
            case ValueRangeBuilderActionType.ADD_VALUE_RANGE: {
                // Add value range
                const { color, id } = action.payload;
                draft.valueRanges.push({
                    ...defaultValueRange,
                    id,
                    color
                });

                // Add validation entry
                draft.validationMap.validation[id] = {
                    minValid: true,
                    maxValid: true,
                    rangeValid: true
                };

                // Update overlapping IDs
                draft.validationMap.overlappingIds = getOverlappingIds(
                    draft.valueRanges,
                    draft.validationMap
                );
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

                // Remove range from overlapping Ids
                draft.validationMap.overlappingIds.splice(
                    draft.validationMap.overlappingIds.findIndex((overlap) =>
                        [overlap.source, overlap.pair].includes(id)
                    )
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

const updateValueRange = (
    draft: IValueRangeBuilderState,
    id: string,
    boundary: Boundary,
    newValue: string,
    newColor: string
) => {
    const valueToUpdate = draft.valueRanges.find((vr) => vr.id === id);
    if (!valueToUpdate) return;

    if (typeof newValue === 'string') {
        let tryCastNumeric: number | string = newValue;
        try {
            if (!isNaN(Number(newValue))) {
                tryCastNumeric = Number(newValue);
            }
        } catch (err) {
            console.error(err);
        }

        boundary === Boundary.min
            ? (valueToUpdate.min = tryCastNumeric as any)
            : (valueToUpdate.max = tryCastNumeric as any);
    } else if (newColor) {
        valueToUpdate.color = newColor;
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

    draft.validationMap.validation[currentValueRange.id] = getRangeValidation(
        newValueRangeToCheck
    );
    draft.validationMap.overlappingIds = getOverlappingIds(
        draft.valueRanges,
        draft.validationMap
    );
};
