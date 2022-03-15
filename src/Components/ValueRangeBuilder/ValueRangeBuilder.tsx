import produce from 'immer';
import React, { useState } from 'react';
import { useGuid } from '../../Models/Hooks';
import { IValueRange } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ReactComponent as InfinitySvg } from '../../Resources/Static/infinity.svg';
import './ValueRangeBuilder.scss';
import { ActionButton, IconButton } from '@fluentui/react';
import { createGUID } from '../../Models/Services/Utils';

export interface IValueRangeBuilderProps {
    valueRanges: IValueRange[];
    setValueRanges: React.Dispatch<React.SetStateAction<IValueRange[]>>;
}

enum Boundary {
    min = 'min',
    max = 'max'
}

const defaultValueRange: Omit<IValueRange, 'id'> = {
    color: '#FF0000',
    min: '-Infinity',
    max: 'Infinity'
};

const ValueRangeBuilder: React.FC<IValueRangeBuilderProps> = ({
    valueRanges = [],
    setValueRanges
}) => {
    const onRangeValueUpdate = (
        boundary: Boundary,
        newValue: string,
        id: string
    ) => {
        setValueRanges(
            produce((draft) => {
                const valueRangeToUpdate = draft.find((vr) => vr.id === id);
                if (valueRangeToUpdate) {
                    if (boundary === Boundary.min) {
                        valueRangeToUpdate.min = newValue as any;
                    } else if (boundary === Boundary.max) {
                        valueRangeToUpdate.max = newValue as any;
                    }
                }
            })
        );
    };

    return (
        <BaseComponent>
            {valueRanges.map((valueRange) => (
                <div className="cb-value-range-container" key={valueRange.id}>
                    <RangeBoundaryInput
                        value={String(valueRange.min)}
                        boundary={Boundary.min}
                        updateValue={(newValue) =>
                            onRangeValueUpdate(
                                Boundary.min,
                                newValue,
                                valueRange.id
                            )
                        }
                    />
                    <RangeBoundaryInput
                        value={String(valueRange.max)}
                        boundary={Boundary.max}
                        updateValue={(newValue) =>
                            onRangeValueUpdate(
                                Boundary.max,
                                newValue,
                                valueRange.id
                            )
                        }
                    />
                    <button
                        style={{ backgroundColor: 'red' }}
                        className="cb-value-range-color-button"
                    ></button>
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
            ))}
            <ActionButton
                iconProps={{ iconName: 'Add' }}
                onClick={() =>
                    setValueRanges(
                        produce((draft) => {
                            draft.push({
                                ...defaultValueRange,
                                id: createGUID(false)
                            });
                        })
                    )
                }
            >
                Add value range
            </ActionButton>
        </BaseComponent>
    );
};

const RangeBoundaryInput: React.FC<{
    value: string;
    boundary: Boundary;
    updateValue: (newValue: string) => void;
}> = ({ value, updateValue, boundary }) => {
    const guid = useGuid();
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
