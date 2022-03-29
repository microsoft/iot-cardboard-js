import { classNamesFunction, styled, useTheme } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IColorPickerProps,
    IColorPickerStyleProps,
    IColorPickerStyles
} from './ColorPicker.types';
import PickerBase from '../Internal/Picker.base';
import { defaultSwatchColors } from '../../../Theming/Palettes';
import { getColorPickerStyles } from './ColorPicker.styles';

const getClassNames = classNamesFunction<
    IColorPickerStyleProps,
    IColorPickerStyles
>();

const ColorPicker: React.FC<IColorPickerProps> = (props) => {
    const { label, items, selectedItem, onChangeItem, styles, ...rest } = props;
    const { t } = useTranslation();
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const onRenderButton = useCallback(
        (onClick, buttonId) => (
            <button
                aria-label={
                    label || t('valueRangeBuilder.colorButtonAriaLabel')
                }
                data-testid={'color-picker-button'}
                style={{ backgroundColor: selectedItem }}
                className={classNames.button}
                onClick={onClick}
                id={buttonId}
            />
        ),
        [selectedItem]
    );
    return (
        <>
            <PickerBase
                {...rest}
                items={items || defaultSwatchColors}
                onChangeItem={onChangeItem}
                onRenderButton={onRenderButton}
                selectedItem={selectedItem}
                styles={styles}
            />
        </>
    );
};

export default styled<
    IColorPickerProps,
    IColorPickerStyleProps,
    IColorPickerStyles
>(ColorPicker, getColorPickerStyles);
