import produce from 'immer';
import React, { createContext, useContext, useState } from 'react';
import { IValueRange } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ReactComponent as InfinitySvg } from '../../Resources/Static/infinity.svg';
import './ValueRangeBuilder.scss';
import {
    ActionButton,
    Callout,
    IColorCellProps,
    IconButton,
    SwatchColorPicker
} from '@fluentui/react';
import { createGUID } from '../../Models/Services/Utils';
import { useBoolean, useId } from '@fluentui/react-hooks';
import {
    IValueRangeBuilderContext,
    IValueRangeBuilderProps,
    OnRangeValueUpdateParams,
    Boundary,
    IValueRangeValidationMap,
    IValueRangeValidation
} from './ValueRangeBuilder.types';

const ValueRangeBuilderContext = createContext<IValueRangeBuilderContext>(null);

const defaultValueRange: Omit<IValueRange, 'id'> = {
    color: '#FF0000',
    min: '-Infinity',
    max: 'Infinity'
};

export const defaultSwatchColors: IColorCellProps[] = [
    { id: 'green', label: 'green', color: '#7DDF64' },
    { id: 'purple', label: 'purple', color: '#7A306C' },
    { id: 'yellow', label: 'yellow', color: '#E8AE68' },
    { id: 'blue', label: 'blue', color: '#3AAED8' },
    { id: 'red', label: 'red', color: '#E84855' }
];

const getValidationMapFromValueRanges = (valueRanges: IValueRange[]) => {
    const validationMap: IValueRangeValidationMap = {};
    valueRanges.forEach((vr) => {
        validationMap[vr.id] = getRangeValidation(vr);
    });

    return validationMap;
};

const getRangeValidation = (valueRange: IValueRange): IValueRangeValidation => {
    let minValid = false,
        maxValid = false,
        rangeValid = false,
        minNumeric,
        maxNumeric;

    try {
        minNumeric = Number(valueRange.min);
        if (!isNaN(minNumeric)) {
            minValid = true;
        }
        maxNumeric = Number(valueRange.max);
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

const ValueRangeBuilder: React.FC<IValueRangeBuilderProps> = ({
    valueRanges = [],
    setValueRanges,
    customSwatchColors,
    baseComponentProps
}) => {
    const [
        valueRangeValidationMap,
        setValueRangeValidationMap
    ] = useState<IValueRangeValidationMap>(
        getValidationMapFromValueRanges(valueRanges)
    );

    const onRangeValueUpdate = ({
        boundary,
        id,
        newValue,
        newColor
    }: OnRangeValueUpdateParams) => {
        setValueRanges(
            produce((draft) => {
                const valueRangeToUpdate = draft.find((vr) => vr.id === id);
                if (!valueRangeToUpdate) return;
                if (typeof newValue === 'string') {
                    boundary === Boundary.min
                        ? (valueRangeToUpdate.min = newValue as any)
                        : (valueRangeToUpdate.max = newValue as any);
                } else if (newColor) {
                    valueRangeToUpdate.color = newColor;
                }
            })
        );
    };

    const colorSwatch = customSwatchColors || defaultSwatchColors;
    const getNextColor = () => {
        const randomColor =
            colorSwatch[Math.floor(Math.random() * colorSwatch.length)]
                ?.color || '#FF000';

        for (const { color } of colorSwatch) {
            if (!valueRanges.map((vr) => vr.color).includes(color)) {
                return color;
            }
        }
        return randomColor;
    };

    return (
        <ValueRangeBuilderContext.Provider
            value={{
                valueRanges,
                onRangeValueUpdate,
                setValueRanges,
                colorSwatch,
                setValueRangeValidationMap,
                valueRangeValidationMap
            }}
        >
            <BaseComponent
                {...baseComponentProps}
                containerClassName="cb-value-range-builder-container"
            >
                {valueRanges.map((valueRange) => (
                    <div className="cb-value-range-and-messaging-row-container">
                        <ValueRangeRow
                            valueRange={valueRange}
                            key={valueRange.id}
                        />
                        <ValueRangeValidationError valueRange={valueRange} />
                    </div>
                ))}
                <ActionButton
                    iconProps={{ iconName: 'Add' }}
                    onClick={() => {
                        const id = createGUID(false);

                        // Add value range
                        setValueRanges(
                            produce((draft) => {
                                draft.push({
                                    ...defaultValueRange,
                                    color: getNextColor(),
                                    id
                                });
                            })
                        );

                        // Add new range to validation map
                        setValueRangeValidationMap(
                            produce((draft) => {
                                draft[id] = {
                                    minValid: true,
                                    maxValid: true,
                                    rangeValid: true
                                };
                            })
                        );
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
    const { valueRangeValidationMap } = useContext(ValueRangeBuilderContext);

    const validationData = valueRangeValidationMap[valueRange.id];

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
    const {
        onRangeValueUpdate,
        setValueRanges,
        colorSwatch,
        setValueRangeValidationMap,
        valueRangeValidationMap
    } = useContext(ValueRangeBuilderContext);

    const labelId = useId('callout-label');
    const colorButtonId = useId('color-button');

    const [
        isRowColorCalloutVisible,
        { toggle: toggleIsRowColorCalloutVisible }
    ] = useBoolean(false);

    return (
        <div
            className={`cb-value-range-container ${
                !valueRangeValidationMap[valueRange.id].rangeValid
                    ? 'cb-range-invalid'
                    : ''
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
                            onRangeValueUpdate({
                                boundary: Boundary.max,
                                newColor: color,
                                id: valueRange.id
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
                onClick={() => {
                    // Remove value range
                    setValueRanges(
                        produce((draft) => {
                            const valueRangeToRemove = draft.findIndex(
                                (vr) => vr.id === valueRange.id
                            );
                            draft.splice(valueRangeToRemove, 1);
                        })
                    );

                    // Remove range from validation map
                    setValueRangeValidationMap(
                        produce((draft) => {
                            delete draft[valueRange.id];
                        })
                    );
                }}
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
        setValueRangeValidationMap,
        onRangeValueUpdate,
        valueRangeValidationMap
    } = useContext(ValueRangeBuilderContext);

    const isMin = boundary === Boundary.min;

    const checkIsNumericInputValid = (value: string) => {
        setValueRangeValidationMap(
            produce((draft) => {
                const vr: IValueRange = {
                    ...valueRange,
                    ...(isMin && { min: value as any }),
                    ...(!isMin && { max: value as any })
                };
                draft[valueRange.id] = getRangeValidation(vr);
                console.log(draft[valueRange.id]);
            })
        );
    };

    let isNumericInputValid = true;
    if (isMin) {
        isNumericInputValid = valueRangeValidationMap[valueRange.id].minValid;
    } else {
        isNumericInputValid = valueRangeValidationMap[valueRange.id].maxValid;
    }
    return (
        <>
            <div className="cb-range-boundary">
                <label className="cb-range-boundary-label" htmlFor={guid}>
                    {isMin ? 'Min' : 'Max'}
                </label>
                <div className="cb-range-boundary-input-container">
                    <input
                        id={guid}
                        value={value}
                        type="string"
                        onChange={(event) =>
                            onRangeValueUpdate({
                                id: valueRange.id,
                                newValue: event.target.value,
                                boundary
                            })
                        }
                        className={`cb-value-range-input ${
                            !isNumericInputValid
                                ? 'cb-value-range-input-invalid'
                                : ''
                        }`}
                        onBlur={() => checkIsNumericInputValid(value)}
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
                        onClick={() => {
                            const newValue =
                                boundary === Boundary.min
                                    ? '-Infinity'
                                    : 'Infinity';
                            onRangeValueUpdate({
                                id: valueRange.id,
                                newValue,
                                boundary
                            });
                            checkIsNumericInputValid(newValue);
                        }}
                    >
                        <InfinitySvg />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ValueRangeBuilder;
