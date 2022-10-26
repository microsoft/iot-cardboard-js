import {
    IButtonStyles,
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export interface IOATLeftFloatingControlsProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IOATLeftFloatingControlsStyleProps,
        IOATLeftFloatingControlsStyles
    >;
}

export interface IOATLeftFloatingControlsStyleProps {
    theme: ITheme;
}
export interface IOATLeftFloatingControlsStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATLeftFloatingControlsSubComponentStyles;
}

export interface IOATLeftFloatingControlsSubComponentStyles {
    modelsListButton?: IButtonStyles;
    modelsListCallout?: Partial<ICalloutContentStyles>;
}
