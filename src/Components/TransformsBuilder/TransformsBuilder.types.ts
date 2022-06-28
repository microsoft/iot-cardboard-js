import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface ITransformsBuilderProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITransformsBuilderStyleProps,
        ITransformsBuilderStyles
    >;
}

export interface ITransformsBuilderStyleProps {
    theme: ITheme;
}
export interface ITransformsBuilderStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITransformsBuilderSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITransformsBuilderSubComponentStyles {}
