import { IColorCellProps } from '@fluentui/react';
import { Dispatch, useEffect, useMemo, useReducer, useRef } from 'react';
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

export interface UseValueRangeBuilderParams {
    initialValueRanges: IValueRange[];
    customSwatchColors?: IColorCellProps[];
    minRanges?: number;
    maxRanges?: number;
}

export interface IValueRangeBuilderReducer {
    state: IValueRangeBuilderState;
    dispatch: Dispatch<ValueRangeBuilderAction>;
}

const useValueRangeBuilder = ({
    initialValueRanges = [],
    customSwatchColors,
    minRanges,
    maxRanges
}: UseValueRangeBuilderParams) => {
    const initialValidationMap = useMemo(
        () => getValidationMapFromValueRanges(initialValueRanges),
        [initialValueRanges]
    );

    const initialValueRangesRef = useRef(initialValueRanges);

    const [state, dispatch] = useReducer(valueRangeBuilderReducer, {
        ...defaultValueRangeBuilderState,
        valueRanges: initialValueRangesRef.current.sort(
            (a, b) => Number(a.min) - Number(b.min)
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
        state,
        resetInitialValueRanges: (valueRanges: IValueRange[]) =>
            (initialValueRangesRef.current = valueRanges)
    };
};

export default useValueRangeBuilder;
