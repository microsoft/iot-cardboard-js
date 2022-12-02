import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import {
    DTDLComplexSchema,
    DTDLProperty
} from '../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../Theming/Theme.types';

export interface IPropertyListItemChildHostProps {
    propertyItem: DTDLProperty & { schema: DTDLComplexSchema };
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyListItemChildHostStyleProps,
        IPropertyListItemChildHostStyles
    >;
}

export interface IPropertyListItemChildHostStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyListItemChildHostStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListItemChildHostSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPropertyListItemChildHostSubComponentStyles {}
