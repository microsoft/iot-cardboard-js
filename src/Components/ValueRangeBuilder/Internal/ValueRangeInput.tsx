import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IValueRange } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ValueRangeBuilderContext } from '../ValueRangeBuilder';
import {
    Boundary,
    ValueRangeBuilderActionType
} from '../ValueRangeBuilder.types';
import { useId } from '@fluentui/react-hooks';
import { ReactComponent as InfinitySvg } from '../../../Resources/Static/infinity.svg';

const ValueRangeInput: React.FC<{
    value: string;
    valueRange: IValueRange;
    boundary: Boundary;
}> = ({ value, valueRange, boundary }) => {
    const guid = useId();
    const { t } = useTranslation();

    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const {
        state: { validationMap },
        dispatch
    } = useContext(ValueRangeBuilderContext);

    const isMin = boundary === Boundary.min;
    const infinityIconMessage = isMin
        ? t('valueRangeBuilder.negativeInfinityIconMessage')
        : t('valueRangeBuilder.positiveInfinityIconMessage');

    let isNumericInputValid = true;
    if (isMin) {
        isNumericInputValid = validationMap.validation[valueRange.id].minValid;
    } else {
        isNumericInputValid = validationMap.validation[valueRange.id].maxValid;
    }

    return (
        <>
            <div className="cb-range-boundary">
                <label className="cb-range-boundary-label" htmlFor={guid}>
                    {isMin ? t('min') : t('max')}
                </label>
                <div className="cb-range-boundary-input-container">
                    <input
                        autoComplete="false"
                        data-testid={
                            isMin
                                ? 'range-builder-row-input-min'
                                : 'range-builder-row-input-max'
                        }
                        id={guid}
                        value={String(inputValue)}
                        type="string"
                        onChange={(event) => setInputValue(event.target.value)}
                        className={`cb-value-range-input ${
                            !isNumericInputValid
                                ? 'cb-value-range-input-invalid'
                                : ''
                        }`}
                        onBlur={() => {
                            dispatch({
                                type:
                                    ValueRangeBuilderActionType.UPDATE_VALUE_RANGE,
                                payload: {
                                    boundary,
                                    newValue: inputValue,
                                    id: valueRange.id
                                }
                            });
                            dispatch({
                                type:
                                    ValueRangeBuilderActionType.UPDATE_VALUE_RANGE_VALIDATION,
                                payload: {
                                    currentValueRange: valueRange,
                                    isMin,
                                    newValue: inputValue
                                }
                            });
                        }}
                    />
                    <button
                        aria-label={infinityIconMessage}
                        className={`cb-value-range-input-infinity-button ${
                            isMin ? 'cb-value-range-negative-infinity' : ''
                        }`}
                        data-testid={
                            isMin
                                ? 'range-builder-row-infinite-min'
                                : 'range-builder-row-infinite-max'
                        }
                        title={infinityIconMessage}
                        onClick={() =>
                            dispatch({
                                type:
                                    ValueRangeBuilderActionType.SNAP_VALUE_TO_INFINITY,
                                payload: {
                                    boundary,
                                    newValue:
                                        boundary === Boundary.min
                                            ? '-Infinity'
                                            : 'Infinity',
                                    currentValueRange: valueRange
                                }
                            })
                        }
                    >
                        <InfinitySvg />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ValueRangeInput;
