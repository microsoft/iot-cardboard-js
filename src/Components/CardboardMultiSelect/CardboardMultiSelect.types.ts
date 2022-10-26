import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IDTDLPropertyType } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface MultiselectOption {
    readonly label: string;
    readonly value: string;
}

export interface ICardboardMultiSelectProps {
    currentValues: unknown[];
    onChangeValues: (
        valueType: IDTDLPropertyType,
        values: string[],
        index?: number
    ) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ICardboardMultiSelectStyleProps,
        ICardboardMultiSelectStyles
    >;
}

export interface ICardboardMultiSelectStyleProps {
    theme: ITheme;
}
export interface ICardboardMultiSelectStyles {
    root: IStyle;
    input: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ICardboardMultiSelectSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICardboardMultiSelectSubComponentStyles {}
