import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IBuilderLeftPanelProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IBuilderLeftPanelStyleProps,
        IBuilderLeftPanelStyles
    >;
}

export interface IBuilderLeftPanelStyleProps {
    theme: ITheme;
}

export interface IBuilderLeftPanelStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IBuilderLeftPanelSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBuilderLeftPanelSubComponentStyles {}
