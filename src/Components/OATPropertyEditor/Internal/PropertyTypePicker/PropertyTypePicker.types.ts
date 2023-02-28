import {
    IStyle,
    IStyleFunctionOrObject,
    IContextualMenuStyles
} from '@fluentui/react';
import { DTDLSchemaTypes } from '../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IPropertyTypePickerProps {
    supportsV3Properties: boolean;
    /**
     * Callback trigged when an item is selected from the list.
     */
    onSelect: (item: { schema: DTDLSchemaTypes }) => void;
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
