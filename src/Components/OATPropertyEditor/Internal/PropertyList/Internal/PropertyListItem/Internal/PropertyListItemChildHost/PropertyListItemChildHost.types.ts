import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLComplexSchema } from '../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../Theming/Theme.types';

export interface IPropertyListItemChildHostProps {
    propertyItem: { name: string; schema: DTDLComplexSchema };
    /** Level in the nesting tree. index of 1 is not nested */
    level: number;
    /** Index of parent in the list. Key used for test automation for the row */
    indexKey: string;
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
