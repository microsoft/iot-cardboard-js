import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IValueRange } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ValueRangeBuilderContext } from '../ValueRangeBuilder';
import {
    Boundary,
    ValueRangeBuilderActionType
} from '../ValueRangeBuilder.types';
import ValueRangeInput from './ValueRangeInput';
import { IconButton, IStackTokens, Stack } from '@fluentui/react';
import ColorSelectButton from '../../ColorSelectButton/ColorSelectButton';

const ValueRangeRow: React.FC<{
    valueRange: IValueRange;
}> = ({ valueRange }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(ValueRangeBuilderContext);

    const { validationMap, colorSwatch, minRanges, valueRanges } = state;

    const validationData = validationMap.validation[valueRange.id];
    const isRangeInvalid =
        validationData.minValid &&
        validationData.maxValid &&
        !validationData.rangeValid;

    return (
        <Stack
            className={`cb-value-range-container ${
                isRangeInvalid ? 'cb-range-invalid' : ''
            }`}
            horizontal
            tokens={sectionStackTokens}
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
            <ColorSelectButton
                buttonColor={valueRange.color}
                colorSwatch={colorSwatch}
                onChangeSwatchColor={(color) => {
                    dispatch({
                        type: ValueRangeBuilderActionType.UPDATE_VALUE_RANGE,
                        payload: {
                            boundary: Boundary.max,
                            newColor: color,
                            id: valueRange.id
                        }
                    });
                }}
            />
            <IconButton
                data-testid={'range-builder-row-delete'}
                iconProps={{ iconName: 'Delete' }}
                title={t('valueRangeBuilder.deleteValueRangeTitle')}
                styles={{
                    root: {
                        alignSelf: 'flex-end',
                        marginLeft: '4px !important'
                    },
                    rootDisabled: {
                        backgroundColor: 'var(--cb-color-bg-canvas)'
                    }
                }}
                disabled={valueRanges.length <= minRanges}
                onClick={() =>
                    dispatch({
                        type: ValueRangeBuilderActionType.DELETE_VALUE_RANGE,
                        payload: {
                            id: valueRange.id
                        }
                    })
                }
            />
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 8 };

export default ValueRangeRow;
