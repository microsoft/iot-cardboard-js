import {
    IButtonStyles,
    IDropdownStyles,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles,
    ITheme
} from '@fluentui/react';
import { IModelledPropertyBuilderAdapter } from '../../../../Models/Constants/Interfaces';
import {
    PropertyExpression,
    PropertyValueType
} from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

/** Query builder types */
export interface IQueryBuilderProps {
    adapter: IModelledPropertyBuilderAdapter;
    allowedPropertyValueTypes: PropertyValueType[];
    executeQuery: (query: string) => void;
    updateColumns: (propertyNames: Set<string>) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IQueryBuilderStyleProps,
        IQueryBuilderStyles
    >;
}

export interface IQueryBuilderStyleProps {
    theme: ITheme;
}
export interface IQueryBuilderStyles {
    root: IStyle;
    firstColumnHeader: IStyle;
    columnHeader: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IQueryBuilderSubComponentStyles;
}

export interface IQueryBuilderSubComponentStyles {
    row?: Partial<IQueryBuilderRowStyles>;
    addButton?: Partial<IButtonStyles>;
    searchButton?: Partial<IButtonStyles>;
}

/** Query builder types */
export interface IQueryBuilderRowProps {
    adapter: IModelledPropertyBuilderAdapter;
    allowedPropertyValueTypes: PropertyValueType[];
    key: string;
    isRemoveDisabled: boolean;
    onChangeProperty: (propertyExpression: PropertyExpression) => void;
    onChangeValue: () => void;
    position: number;
    removeRow: (index: number, rowId: string) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IQueryBuilderRowStyleProps,
        IQueryBuilderRowStyles
    >;
}

export interface IQueryBuilderRowStyleProps {
    theme: ITheme;
}
export interface IQueryBuilderRowStyles {
    root: IStyle;
    lastColumn: IStyle;
    propertyContainer: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IQueryBuilderRowSubComponentStyles;
}

export interface IQueryBuilderRowSubComponentStyles {
    iconButton?: Partial<IButtonStyles>;
    operatorDropdown?: Partial<IDropdownStyles>;
    andDropdown?: Partial<IDropdownStyles>;
    stack?: Partial<IStackStyles>;
    textfield?: Partial<ITextFieldStyles>;
}
