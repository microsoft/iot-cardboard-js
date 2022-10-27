import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export enum BoundaryType {
    min = 'min',
    max = 'max'
}

export interface IBoundaryInputProps {
    boundary: BoundaryType;
    setNewValues: (value: string) => void;
    setValueToInfinity: (value: string) => void;
    value: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IBoundaryInputStyleProps,
        IBoundaryInputStyles
    >;
}

export interface IBoundaryInputStyleProps {
    theme: ITheme;
}
export interface IBoundaryInputStyles {
    root: IStyle;
    container: IStyle;
    label: IStyle;
    inputContainer: IStyle;
    input: IStyle;
    negativeInfinityButton: IStyle;
    infinityButton: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IBoundaryInputSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBoundaryInputSubComponentStyles {}
