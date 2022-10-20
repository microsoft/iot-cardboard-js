import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IGraphAutoLayoutProps {
    onForceLayout: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IGraphAutoLayoutStyleProps,
        IGraphAutoLayoutStyles
    >;
}

export interface IGraphAutoLayoutStyleProps {
    theme: ITheme;
}
export interface IGraphAutoLayoutStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IGraphAutoLayoutSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGraphAutoLayoutSubComponentStyles {}
