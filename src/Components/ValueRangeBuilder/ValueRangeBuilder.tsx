import React, {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useReducer
} from 'react';
import { IValueRange } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ReactComponent as InfinitySvg } from '../../Resources/Static/infinity.svg';
import './ValueRangeBuilder.scss';
import {
    ActionButton,
    Callout,
    IconButton,
    SwatchColorPicker
} from '@fluentui/react';
import { createGUID } from '../../Models/Services/Utils';
import { useBoolean, useId } from '@fluentui/react-hooks';
import {
    IValueRangeBuilderContext,
    IValueRangeBuilderProps,
    Boundary,
    ValueRangeBuilderActionType,
    IValueRangeBuilderHandle
} from './ValueRangeBuilder.types';
import {
    getValidationMapFromValueRanges,
    areDistinctValueRangesValid,
    getNextColor,
    isRangeOverlapFound
} from './ValueRangeBuilder.utils';
import {
    defaultValueRangeBuilderState,
    valueRangeBuilderReducer
} from './ValueRangeBuilder.state';
import { useTranslation } from 'react-i18next';

const ValueRangeBuilderContext = createContext<IValueRangeBuilderContext>(null);

const ValueRangeBuilder: React.ForwardRefRenderFunction<
    IValueRangeBuilderHandle,
    IValueRangeBuilderProps
> = (
    {
        initialValueRanges = [],
        customSwatchColors,
        baseComponentProps,
        setAreRangesValid
    },
    forwardedRef
) => {
    const { t } = useTranslation();

    const initialValidationMap = useMemo(
        () => getValidationMapFromValueRanges(initialValueRanges),
        [initialValueRanges]
    );

    const [state, dispatch] = useReducer(valueRangeBuilderReducer, {
        ...defaultValueRangeBuilderState,
        valueRanges: initialValueRanges,
        validationMap: initialValidationMap,
        ...(customSwatchColors && { colorSwatch: customSwatchColors })
    });

    const { validationMap } = state;

    // Update consumer when validation map changes
    useEffect(() => {
        const areDistinctRangesValid = areDistinctValueRangesValid(
            state.validationMap
        );
        const isOverlapDetected = isRangeOverlapFound(
            state.valueRanges,
            state.validationMap
        );

        const areRangesValid = areDistinctRangesValid && !isOverlapDetected;

        if (typeof setAreRangesValid === 'function') {
            setAreRangesValid(areRangesValid);
        }
    }, [state.validationMap]);

    useImperativeHandle(forwardedRef, () => ({
        getValueRanges: () => {
            return state.valueRanges;
        }
    }));

    return (
        <ValueRangeBuilderContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            <BaseComponent
                {...baseComponentProps}
                containerClassName="cb-value-range-builder-container"
            >
                {state.valueRanges.map((valueRange) => (
                    <div
                        className="cb-value-range-and-messaging-row-container"
                        key={valueRange.id}
                    >
                        <ValueRangeRow valueRange={valueRange} />
                        <ValueRangeValidationError valueRange={valueRange} />
                    </div>
                ))}
                {areDistinctValueRangesValid(validationMap) &&
                    validationMap.overlapFound && (
                        <div className="cb-value-range-validation-error">
                            {t('valueRangeBuilder.overlapDetectedMessage')}
                        </div>
                    )}
                <ActionButton
                    iconProps={{ iconName: 'Add' }}
                    onClick={() => {
                        const id = createGUID(false);

                        dispatch({
                            type: ValueRangeBuilderActionType.ADD_VALUE_RANGE,
                            payload: {
                                id,
                                color: getNextColor(
                                    state.valueRanges,
                                    state.colorSwatch
                                )
                            }
                        });
                    }}
                    ariaLabel={t('valueRangeBuilder.addValueRangeButtonText')}
                >
                    {t('valueRangeBuilder.addValueRangeButtonText')}
                </ActionButton>
            </BaseComponent>
        </ValueRangeBuilderContext.Provider>
    );
};

const ValueRangeValidationError: React.FC<{
    valueRange: IValueRange;
}> = ({ valueRange }) => {
    const { state } = useContext(ValueRangeBuilderContext);
    const { t } = useTranslation();

    const validationData = state.validationMap.validation[valueRange.id];

    const getValidationMessaging = () => {
        if (!validationData.maxValid || !validationData.minValid) {
            return t('valueRangeBuilder.rangeValueInvalidMessage');
        } else if (!validationData.rangeValid) {
            return t('valueRangeBuilder.rangeInvalidMessage');
        } else {
            return null;
        }
    };

    const message = getValidationMessaging();

    if (!message) return null;

    return <div className="cb-value-range-validation-error">{message}</div>;
};

const ValueRangeRow: React.FC<{
    valueRange: IValueRange;
}> = ({ valueRange }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(ValueRangeBuilderContext);

    const labelId = useId('callout-label');
    const colorButtonId = useId('color-button');

    const [
        isRowColorCalloutVisible,
        { toggle: toggleIsRowColorCalloutVisible }
    ] = useBoolean(false);

    const { validationMap, colorSwatch } = state;

    const validationData = validationMap.validation[valueRange.id];
    const isRangeInvalid =
        validationData.minValid &&
        validationData.maxValid &&
        !validationData.rangeValid;

    return (
        <div
            className={`cb-value-range-container ${
                isRangeInvalid ? 'cb-range-invalid' : ''
            }`}
        >
            <RangeBoundaryInput
                value={String(valueRange.min)}
                boundary={Boundary.min}
                valueRange={valueRange}
            />
            <RangeBoundaryInput
                value={String(valueRange.max)}
                boundary={Boundary.max}
                valueRange={valueRange}
            />
            <button
                aria-label={t('valueRangeBuilder.colorButtonAriaLabel')}
                style={{ backgroundColor: valueRange.color }}
                className="cb-value-range-color-button"
                onClick={toggleIsRowColorCalloutVisible}
                id={colorButtonId}
            ></button>
            {isRowColorCalloutVisible && (
                <Callout
                    ariaLabelledBy={labelId}
                    target={`#${colorButtonId}`}
                    onDismiss={toggleIsRowColorCalloutVisible}
                    setInitialFocus
                    styles={{ root: { width: 100 } }}
                >
                    <SwatchColorPicker
                        columnCount={3}
                        cellShape={'square'}
                        colorCells={colorSwatch}
                        aria-labelledby={labelId}
                        onChange={(_e, _id, color) =>
                            dispatch({
                                type:
                                    ValueRangeBuilderActionType.UPDATE_VALUE_RANGE,
                                payload: {
                                    boundary: Boundary.max,
                                    newColor: color,
                                    id: valueRange.id
                                }
                            })
                        }
                        selectedId={
                            colorSwatch.find(
                                (color) => color.color === valueRange.color
                            )?.id
                        }
                    />
                </Callout>
            )}
            <IconButton
                iconProps={{ iconName: 'Delete' }}
                title={t('valueRangeBuilder.deleteValueRangeTitle')}
                styles={{
                    root: { alignSelf: 'flex-end', height: '24px' }
                }}
                onClick={() =>
                    dispatch({
                        type: ValueRangeBuilderActionType.DELETE_VALUE_RANGE,
                        payload: {
                            id: valueRange.id
                        }
                    })
                }
            />
        </div>
    );
};

const RangeBoundaryInput: React.FC<{
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

export default forwardRef(ValueRangeBuilder);
