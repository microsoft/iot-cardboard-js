import {
    IPickerBaseProps,
    IPickerBaseStyleProps,
    IPickerBaseStyles
} from '../Internal/Picker.base.types';

export type IIconPickerProps = Omit<
    IPickerBaseProps,
    'onRenderButton' | 'onRenderItem'
>;
export type IIconPickerStyleProps = IPickerBaseStyleProps;
export type IIconPickerStyles = IPickerBaseStyles;
