import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IValueRange } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ValueRangeBuilderContext } from '../ValueRangeBuilder';
import {
    Boundary,
    ValueRangeBuilderActionType
} from '../ValueRangeBuilder.types';
import { useId, useBoolean } from '@fluentui/react-hooks';
import ValueRangeInput from './ValueRangeInput';
import { Callout, IconButton, SwatchColorPicker } from '@fluentui/react';

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

    const { validationMap, colorSwatch, minRanges, valueRanges } = state;

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
            <ValueRangeInput
                value={String(valueRange.min)}
                boundary={Boundary.min}
                valueRange={valueRange}
            />
            <ValueRangeInput
                value={String(valueRange.max)}
                boundary={Boundary.max}
                valueRange={valueRange}
            />
            <button
                aria-label={t('valueRangeBuilder.colorButtonAriaLabel')}
                style={{ backgroundColor: valueRange.color }}
                className={"cb-value-range-color-button"}
                onClick={toggleIsRowColorCalloutVisible}
                id={colorButtonId}
            >
            </button>
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
                            })}
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
                disabled={valueRanges.length <= minRanges}
                onClick={() =>
                    dispatch({
                        type: ValueRangeBuilderActionType.DELETE_VALUE_RANGE,
                        payload: {
                            id: valueRange.id
                        }
                    })}
            />
        </div>
    );
};

export default ValueRangeRow;
