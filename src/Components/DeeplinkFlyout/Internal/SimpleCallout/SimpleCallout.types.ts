import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface ISimpleCalloutProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ISimpleCalloutStyleProps,
        ISimpleCalloutStyles
    >;
}

export interface ISimpleCalloutStyleProps {
    theme: ITheme;
}
export interface ISimpleCalloutStyles {
    root: IStyle;
    message: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISimpleCalloutSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISimpleCalloutSubComponentStyles {}
