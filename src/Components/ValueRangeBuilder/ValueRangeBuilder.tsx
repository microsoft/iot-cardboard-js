import React, { createContext, useContext, useMemo, useReducer } from 'react';
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
    ValueRangeBuilderActionType
} from './ValueRangeBuilder.types';
import {
    getValidationMapFromValueRanges,
    areDistinctValueRangesValid,
    getNextColor
} from './ValueRangeBuilder.utils';
import {
    defaultValueRangeBuilderState,
    valueRangeBuilderReducer
} from './ValueRangeBuilder.state';

const ValueRangeBuilderContext = createContext<IValueRangeBuilderContext>(null);

const ValueRangeBuilder: React.FC<IValueRangeBuilderProps> = ({
    initialValueRanges = [],
    customSwatchColors,
    baseComponentProps
}) => {
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
                    validationMap.overlappingIds.length > 0 && (
                        <div className="cb-value-range-validation-error">
                            {
                                'Overlapping ranges detected.  Verify that all value ranges are distinct.  Min values are inclusive, Max values are exclusive.'
                            }
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
                >
                    Add value range
                </ActionButton>
            </BaseComponent>
        </ValueRangeBuilderContext.Provider>
    );
};

const ValueRangeValidationError: React.FC<{
    valueRange: IValueRange;
}> = ({ valueRange }) => {
    const { state } = useContext(ValueRangeBuilderContext);

    const validationData = state.validationMap.validation[valueRange.id];

    const getValidationMessaging = () => {
        if (!validationData.maxValid || !validationData.minValid) {
            return "Values must be numeric, '-Infinity', or 'Infinity'";
        } else if (!validationData.rangeValid) {
            return 'Min value must be less than (<) Max value';
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

    const isOverlapping =
        areDistinctValueRangesValid(validationMap) &&
        !!validationMap.overlappingIds.find((overlap) =>
            [overlap.source, overlap.pair].includes(valueRange.id)
        );

    return (
        <div
            className={`cb-value-range-container ${
                isRangeInvalid ? 'cb-range-invalid' : ''
            } ${isOverlapping ? 'cb-is-overlapping' : ''}`}
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
                aria-label={'Select color for value range'}
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
                title="Delete value range"
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

    const {
        state: { validationMap },
        dispatch
    } = useContext(ValueRangeBuilderContext);

    const isMin = boundary === Boundary.min;

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
                    {isMin ? 'Min' : 'Max'}
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
                        aria-label={
                            isMin
                                ? 'Set value to -Infinity'
                                : 'Set value to Infinity'
                        }
                        title={
                            isMin
                                ? 'Set value to -Infinity'
                                : 'Set value to Infinity'
                        }
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

export default ValueRangeBuilder;
