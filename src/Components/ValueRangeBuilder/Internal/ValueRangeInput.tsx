import React, { useContext } from 'react';
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
                        id={guid}
                        value={String(value)}
                        type="string"
                        onChange={(event) =>
                            dispatch({
                                type:
                                    ValueRangeBuilderActionType.UPDATE_VALUE_RANGE,
                                payload: {
                                    boundary,
                                    newValue: event.target.value,
                                    id: valueRange.id
                                }
                            })
                        }
                        className={`cb-value-range-input ${
                            !isNumericInputValid
                                ? 'cb-value-range-input-invalid'
                                : ''
                        }`}
                        onBlur={() =>
                            dispatch({
                                type:
                                    ValueRangeBuilderActionType.UPDATE_VALUE_RANGE_VALIDATION,
                                payload: {
                                    currentValueRange: valueRange,
                                    isMin,
                                    newValue: value
                                }
                            })
                        }
                    />
                    <button
                        className={`cb-value-range-input-infinity-button ${
                            isMin ? 'cb-value-range-negative-infinity' : ''
                        }`}
                        aria-label={infinityIconMessage}
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
