import {
    IButtonStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles
} from '@fluentui/react';
import { DTDLProperty } from '../../../../../../Models/Classes/DTDL';
import {
    DtdlInterface,
    DtdlInterfaceContent
} from '../../../../../../Models/Constants';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';

export interface IPropertyListItemProps {
    /** index of this property in the collection of properties on the parent */
    propertyIndex: number;
    /** the property item itself */
    propertyItem: DTDLProperty;
    /** the parent of the property */
    parentEntity: DtdlInterface | DtdlInterfaceContent;
    /** Level in the nesting tree. index of 1 is not nested */
    level?: number;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyListItemStyleProps,
        IPropertyListItemStyles
    >;
}

export interface IPropertyListItemStyleProps {
    level: number;
    theme: IExtendedTheme;
}
export interface IPropertyListItemStyles {
    root: IStyle;
    addChildButton: IStyle;
    buttonSpacer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListItemSubComponentStyles;
}

export interface IPropertyListItemSubComponentStyles {
    nameTextField?: Partial<ITextFieldStyles>;
    expandButton?: Partial<IButtonStyles>;
}
