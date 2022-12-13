import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import {
    DTDLComplexSchema,
    DTDLSchema
} from '../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../Theming/Theme.types';

export interface IPropertyListItemChildBaseProps {
    /** Level in the nesting tree. index of 1 is not nested */
    level: number;
    /** Index of parent in the list. Key used for test automation for the row */
    indexKey: string;
    /** callback to store an updated version of the schema */
    onUpdateSchema: (schema: DTDLSchema) => void;
}

export interface IPropertyListItemChildHostProps
    extends IPropertyListItemChildBaseProps {
    propertyItem: { name: string; schema: DTDLComplexSchema };
    /** callback to store an updated version of the schema */
    onUpdateSchema: (schema: DTDLSchema) => void;
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
