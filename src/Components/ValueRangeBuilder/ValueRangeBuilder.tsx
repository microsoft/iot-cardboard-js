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
    Boundary
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

const ValueRangeBuilder: React.FC<IValueRangeBuilderProps> = ({
    valueRanges = [],
    setValueRanges,
    customSwatchColors,
    baseComponentProps
}) => {
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

    return (
        <ValueRangeBuilderContext.Provider
            value={{
                valueRanges,
                onRangeValueUpdate,
                setValueRanges,
                colorSwatch
            }}
        >
            <BaseComponent
                {...baseComponentProps}
                containerClassName="cb-value-range-builder-container"
            >
                {valueRanges.map((valueRange) => (
                    <ValueRangeRow
                        valueRange={valueRange}
                        key={valueRange.id}
                    />
                ))}
                <ActionButton
                    iconProps={{ iconName: 'Add' }}
                    onClick={() =>
                        setValueRanges(
                            produce((draft) => {
                                draft.push({
                                    ...defaultValueRange,
                                    color:
                                        colorSwatch[
                                            Math.floor(
                                                Math.random() *
                                                    colorSwatch.length
                                            )
                                        ]?.color || '#FF000',
                                    id: createGUID(false)
                                });
                            })
                        )
                    }
                >
                    Add value range
                </ActionButton>
            </BaseComponent>
        </ValueRangeBuilderContext.Provider>
    );
};

const ValueRangeRow: React.FC<{
    valueRange: IValueRange;
}> = ({ valueRange }) => {
    const { onRangeValueUpdate, setValueRanges, colorSwatch } = useContext(
        ValueRangeBuilderContext
    );

    const labelId = useId('callout-label');
    const colorButtonId = useId('color-button');

    const [
        isRowColorCalloutVisible,
        { toggle: toggleIsRowColorCalloutVisible }
    ] = useBoolean(false);

    return (
        <div className="cb-value-range-container">
            <RangeBoundaryInput
                value={String(valueRange.min)}
                boundary={Boundary.min}
                updateValue={(newValue) =>
                    onRangeValueUpdate({
                        boundary: Boundary.min,
                        newValue,
                        id: valueRange.id
                    })
                }
            />
            <RangeBoundaryInput
                value={String(valueRange.max)}
                boundary={Boundary.max}
                updateValue={(newValue) =>
                    onRangeValueUpdate({
                        boundary: Boundary.max,
                        newValue,
                        id: valueRange.id
                    })
                }
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
                    setValueRanges(
                        produce((draft) => {
                            const valueRangeToRemove = draft.findIndex(
                                (vr) => vr.id === valueRange.id
                            );
                            draft.splice(valueRangeToRemove, 1);
                        })
                    );
                }}
            />
        </div>
    );
};

const RangeBoundaryInput: React.FC<{
    value: string;
    boundary: Boundary;
    updateValue: (newValue: string) => void;
}> = ({ value, updateValue, boundary }) => {
    const guid = useId();
    const isMin = boundary === Boundary.min;

    const [isNumericInputValid, setIsNumericInputValid] = useState(true);

    const checkIsNumericInputValid = (value: string) => {
        try {
            if (
                value === 'Infinity' ||
                value === '-Infinity' ||
                Number(value)
            ) {
                setIsNumericInputValid(true);
            } else {
                setIsNumericInputValid(false);
            }
        } catch {
            setIsNumericInputValid(false);
        }
    };

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
                        onChange={(event) => updateValue(event.target.value)}
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
                            setIsNumericInputValid(true);
                            updateValue(
                                boundary === Boundary.min
                                    ? '-Infinity'
                                    : 'Infinity'
                            );
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
