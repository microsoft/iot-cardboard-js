import { IColorPickerStyleProps } from '@fluentui/react';
import { IColorPickerStyles } from './ColorPicker.types';

const classPrefix = 'color-select-button';
const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`
};
export const getColorPickerStyles = (
    _props: IColorPickerStyleProps
): IColorPickerStyles => {
    return {
        button: [
            classNames.button,
            {
                border: '1px solid var(--cb-color-input-border)',
                borderRadius: '50%',
                cursor: 'pointer',
                height: 28,
                width: 28
            }
        ]
    };
};
