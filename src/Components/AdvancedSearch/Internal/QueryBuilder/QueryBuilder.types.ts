import {
    IButtonStyles,
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles,
    ITheme
} from '@fluentui/react';
import { Theme } from '../../../../Models/Constants';
import { IModelledPropertyBuilderAdapter } from '../../../../Models/Constants/Interfaces';
import { PropertyValueType } from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

/** Query builder types */
export interface IQueryBuilderProps {
    adapter: IModelledPropertyBuilderAdapter;
    allowedPropertyValueTypes: PropertyValueType[];
    theme: Theme;
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
    rowCount: number;
}
export interface IQueryBuilderStyles {
    root: IStyle;
    headerGrid: IStyle;
    headerText: IStyle;
    rowContainer: IStyle;
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

/** Query row types */
export interface IQueryBuilderRowProps {
    adapter: IModelledPropertyBuilderAdapter;
    allowedPropertyValueTypes: PropertyValueType[];
    rowId: string;
    isRemoveDisabled: boolean;
    onChangeProperty: (
        rowId: string,
        propertyName: string,
        propertyType: PropertyValueType
    ) => void;
    onChangeValue: (rowId: string, newValue: string) => void;
    onUpdateSnippet: (rowId: string, rowValue: QueryRowData) => void;
    position: number;
    removeRow: (index: number, rowId: string) => void;
    theme: Theme;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IQueryBuilderRowStyleProps,
        IQueryBuilderRowStyles
    >;
}

export type OperatorData = OperatorSimple | OperatorFunction;
interface OperatorSimple {
    operatorType: 'Simple';
    operatorSymbol: string;
}

interface OperatorFunction {
    operatorType: 'Function';
    operatorFunction: (property: string, value: string) => string;
}

export interface QueryRowData {
    property: string;
    operatorData: OperatorData;
    value: string;
    combinator: string;
}

export interface PropertyOption {
    value: string;
    label: string;
    data: {
        name: string;
        type: PropertyValueType;
    };
}

export interface IQueryBuilderRowStyleProps {
    theme: ITheme;
    isOnlyFirstRow: boolean;
}
export interface IQueryBuilderRowStyles {
    root: IStyle;
    firstColumn: IStyle;
    inputColumn: IStyle;
    buttonColumn: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IQueryBuilderRowSubComponentStyles;
}

export interface IQueryBuilderRowSubComponentStyles {
    propertyCallout?: Partial<ICalloutContentStyles>;
    valueField?: Partial<ITextFieldStyles>;
    deleteButton?: Partial<IButtonStyles>;
}
