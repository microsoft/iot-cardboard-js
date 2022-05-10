import {
    ITheme,
    IStyle,
    ICalloutContentStyles,
    IStyleFunctionOrObject,
    IButtonStyles
} from '@fluentui/react';

export interface IDeeplinkFlyoutProps {
    mode: 'Simple' | 'Options';
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDeeplinkFlyoutStyleProps,
        IDeeplinkFlyoutStyles
    >;
}

export interface IDeeplinkFlyoutStyleProps {
    theme: ITheme;
    isCalloutOpen: boolean;
}
export interface IDeeplinkFlyoutStyles {
    root: IStyle;
    button: IStyle;
    callout: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDeeplinkFlyoutSubComponentStyles;
}

export interface IDeeplinkFlyoutSubComponentStyles {
    button?: IButtonStyles;
    callout?: Partial<ICalloutContentStyles>;
}
