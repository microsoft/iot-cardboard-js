import {
    ITheme,
    IStyle,
    ICalloutContentStyles,
    IStyleFunctionOrObject,
    ICheckboxStyles,
    IButtonStyles,
    IStackStyles
} from '@fluentui/react';

export interface IDeeplinkFlyoutProps {
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
    calloutCheckbox: IStyle;
    calloutTitle: IStyle;
    calloutConfirmationMessage: IStyle;
    calloutConfirmationMessageFadeOut: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDeeplinkFlyoutSubComponentStyles;
}

export interface IDeeplinkFlyoutSubComponentStyles {
    button?: IButtonStyles;
    callout?: Partial<ICalloutContentStyles>;
    checkbox?: ICheckboxStyles;
    confirmationStack?: IStackStyles;
}
