import { Dispatch, useMemo, useReducer, useRef } from 'react';
import { IValueRange } from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    valueRangeBuilderReducer,
    defaultValueRangeBuilderState
} from '../../Components/ValueRangeBuilder/ValueRangeBuilder.state';
import { getValidationMapFromValueRanges } from '../../Components/ValueRangeBuilder/ValueRangeBuilder.utils';
import {
    IValueRangeBuilderState,
    ValueRangeBuilderAction
} from '../../Components/ValueRangeBuilder/ValueRangeBuilder.types';
import { IPickerOption } from '../../Components/Pickers/Internal/Picker.base.types';

export interface UseValueRangeBuilderParams {
    initialValueRanges: IValueRange[];
    customSwatchColors?: IPickerOption[];
    minRanges?: number;
    maxRanges?: number;
}

export interface IValueRangeBuilderReducer {
    valueRangeBuilderReducer: {
        state: IValueRangeBuilderState;
        dispatch: Dispatch<ValueRangeBuilderAction>;
    };
    valueRangeBuilderState: IValueRangeBuilderState;
    resetInitialValueRanges: (valueRanges: IValueRange[]) => IValueRange[];
}

const useValueRangeBuilder = ({
    initialValueRanges = [],
    customSwatchColors,
    minRanges,
    maxRanges
}: UseValueRangeBuilderParams): IValueRangeBuilderReducer => {
    const initialValidationMap = useMemo(
        () => getValidationMapFromValueRanges(initialValueRanges),
        [initialValueRanges]
    );

    const initialValueRangesRef = useRef(initialValueRanges);

    const [state, dispatch] = useReducer(valueRangeBuilderReducer, {
        ...defaultValueRangeBuilderState,
        valueRanges: initialValueRangesRef.current.sort(
            (a, b) => Number(a.values[0]) - Number(b.values[0])
        ),
        validationMap: initialValidationMap,
        ...(customSwatchColors && { colorSwatch: customSwatchColors }),
        minRanges,
        maxRanges
    });

    return {
        valueRangeBuilderReducer: {
            state,
            dispatch
        },
        valueRangeBuilderState: state,
        resetInitialValueRanges: (valueRanges: IValueRange[]) =>
            (initialValueRangesRef.current = valueRanges)
    };
};

export default useValueRangeBuilder;
