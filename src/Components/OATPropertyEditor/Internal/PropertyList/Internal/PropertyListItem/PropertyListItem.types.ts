import {
    IButtonStyles,
    IContextualMenuStyles,
    IIconStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles
} from '@fluentui/react';
import { DTDLSchema } from '../../../../../../Models/Classes/DTDL';
import { DtdlContext } from '../../../../../../Models/Constants';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';
import { IPropertyIconStyles } from './Internal/PropertyIcon/PropertyIcon.types';

export type IOnUpdateNameCallbackArgs = {
    /** the name to store on the item */
    name: string;
};
export type IOnUpdateNameCallback = (args: IOnUpdateNameCallbackArgs) => void;

interface IItem {
    name: string;
    schema: DTDLSchema;
}
export interface IPropertyListItemProps {
    /** the DTDL context of the model or source model (if relationship) */
    parentModelContext: DtdlContext;
    /** is the first item in the list */
    isFirstItem: boolean;
    /** is the last item in list */
    isLastItem: boolean;
    /** Index of parent in the list. Key used for test automation for the row */
    indexKey: string;
    /** the item itself */
    item: IItem;
    /** Level in the nesting tree. index of 1 is not nested */
    level?: number;
    /** callback to store an updated version of the schema */
    onCopy: () => void | undefined;
    onUpdateSchema: (schema: DTDLSchema) => void | undefined;
    onReorderItem: (direction: 'Up' | 'Down') => void | undefined;
    onUpdateName: IOnUpdateNameCallback;
    onRemove: () => void | undefined;
    /** disables the input field */
    optionDisableInput?: boolean;
    /** hides the overflow menu */
    optionHideMenu?: boolean;
    /** renders a custom icon for the list item instead of based on schema */
    optionRenderCustomMenuIcon?: (item: IItem) => React.ReactNode;
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
    hasChildren: boolean;
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
    inputIcon?: Partial<IIconStyles>;
    childTypeSubMenuIcon?: Partial<IPropertyIconStyles>;
    menuItems?: Partial<IContextualMenuStyles>;
}
