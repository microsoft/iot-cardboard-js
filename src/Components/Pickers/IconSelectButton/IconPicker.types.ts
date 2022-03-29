import { IButtonStyles } from '@fluentui/react';
import {
    IPickerBaseProps,
    IPickerBaseStyleProps,
    IPickerBaseStyles,
    IPickerBaseSubComponentStyles
} from '../Internal/Picker.base.types';

export type IIconPickerProps = Omit<
    IPickerBaseProps,
    'onRenderButton' | 'onRenderItem'
>;
export type IIconPickerStyleProps = IPickerBaseStyleProps & {
    isItemSelected: boolean;
};
export type IIconPickerStyles = Partial<IPickerBaseStyles> & {
    subComponentStyles?: IPickerBaseSubComponentStyles &
        IIconPickerSubComponentStyles;
};

export interface IIconPickerSubComponentStyles {
    /** Styles for the callout that hosts the ContextualMenu options. */
    button?: IButtonStyles;
}
