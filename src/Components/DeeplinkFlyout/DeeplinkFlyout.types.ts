import {
    ITheme,
    IStyle,
    ICalloutContentStyles,
    IStyleFunctionOrObject,
    ICheckboxStyles
} from '@fluentui/react';

export interface IDeeplinkFlyoutProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, IDeeplinkFlyoutStyles>;
}

export interface IDeeplinkFlyoutStyleProps {
    theme: ITheme;
}
export interface IDeeplinkFlyoutStyles {
    root: IStyle;
    calloutTitle: IStyle;
    confirmationMessage: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDeeplinkFlyoutSubComponentStyles;
}

export interface IDeeplinkFlyoutSubComponentStyles {
    /** Styles for the callout that hosts the ContextualMenu options. */
    callout?: Partial<ICalloutContentStyles>;
    checkbox?: ICheckboxStyles;
}
