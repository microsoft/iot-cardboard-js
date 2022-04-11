import {
    IPickerBaseProps,
    IPickerBaseStyleProps,
    IPickerBaseStyles,
    IPickerOption
} from '../Internal/Picker.base.types';

export interface IColorPickerProps
    extends Omit<
        IPickerBaseProps,
        'items' | 'onRenderButton' | 'onRenderItem'
    > {
    /** Items to render in the callout */
    items?: IPickerOption[];
}
export type IColorPickerStyleProps = IPickerBaseStyleProps;
export type IColorPickerStyles = Partial<IPickerBaseStyles>;
