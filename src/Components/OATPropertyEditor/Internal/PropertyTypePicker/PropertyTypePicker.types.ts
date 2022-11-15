import {
    IStyle,
    IStyleFunctionOrObject,
    IContextualMenuStyles
} from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IPropertyTypePickerProps {
    /**
     * Callback trigged when an item is selected from the list.
     */
    onSelect: (item: { type: string }) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyTypePickerStyleProps,
        IPropertyTypePickerStyles
    >;
}

export interface IPropertyTypePickerStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyTypePickerStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyTypePickerSubComponentStyles;
}

export interface IPropertyTypePickerSubComponentStyles {
    menu?: Partial<IContextualMenuStyles>;
}
