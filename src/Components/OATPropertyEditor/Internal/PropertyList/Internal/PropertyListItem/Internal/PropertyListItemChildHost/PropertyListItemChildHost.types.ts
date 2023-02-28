import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import {
    DTDLComplexSchema,
    DTDLSchema
} from '../../../../../../../../Models/Classes/DTDL';
import { DtdlContext } from '../../../../../../../../Models/Constants';
import { IExtendedTheme } from '../../../../../../../../Theming/Theme.types';
import { IOnUpdateNameCallback } from '../../PropertyListItem.types';

export interface IPropertyListItemChildBaseProps {
    /** Level in the nesting tree. index of 1 is not nested */
    level: number;
    /** Index of parent in the list. Key used for test automation for the row */
    indexKey: string;
    /** callback to create a copy of the selected item */
    onDuplicate: () => void;
    /** callback to store an updated version of the schema */
    onUpdateSchema: (schema: DTDLSchema) => void;
    /** callback to move an item up or down in the list */
    onReorderItem: (direction: 'Up' | 'Down') => void;
    /** callback to update the name of an item */
    onUpdateName: IOnUpdateNameCallback;
    /** callback to remove teh item from the parent */
    onRemove: () => void;
}

export interface IPropertyListItemChildHostProps
    extends Omit<
        IPropertyListItemChildBaseProps,
        'onReorderItem' | 'onUpdateName' | 'onRemove'
    > {
    /** the DTDL context of the model or source model (if relationship) */
    parentModelContext: DtdlContext;
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
