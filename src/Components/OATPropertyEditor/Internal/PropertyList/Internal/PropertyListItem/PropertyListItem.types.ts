import {
    IButtonStyles,
    IIconStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles
} from '@fluentui/react';
import { DTDLSchema } from '../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';

export type IOnUpdateNameCallbackArgs = {
    /** the name to store on the item */
    name: string;
};
export type IOnUpdateNameCallback = (args: IOnUpdateNameCallbackArgs) => void;

export interface IPropertyListItemProps {
    /** is the first item in the list */
    isFirstItem: boolean;
    /** is the last item in list */
    isLastItem: boolean;
    /** Index of parent in the list. Key used for test automation for the row */
    indexKey: string;
    /** the item itself */
    item: { name: string; schema: DTDLSchema };
    /** Level in the nesting tree. index of 1 is not nested */
    level?: number;
    /** disables the input field */
    disableInput?: boolean;
    /** callback to store an updated version of the schema */
    onUpdateSchema: (schema: DTDLSchema) => void;
    onReorderItem: (direction: 'Up' | 'Down') => void;
    onUpdateName: IOnUpdateNameCallback;
    // onRenderNameField?: () => React.ReactNode;
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
}