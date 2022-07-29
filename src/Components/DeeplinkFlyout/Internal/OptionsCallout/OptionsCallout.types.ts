import {
    ICheckboxStyles,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export interface IOptionsCalloutProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IOptionsCalloutStyleProps,
        IOptionsCalloutStyles
    >;
}

export interface IOptionsCalloutStyleProps {
    theme: ITheme;
}
export interface IOptionsCalloutStyles {
    root: IStyle;
    calloutCheckbox: IStyle;
    calloutTitle: IStyle;
    calloutConfirmationMessage: IStyle;
    calloutConfirmationMessageFadeOut: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOptionsCalloutSubComponentStyles;
}

export interface IOptionsCalloutSubComponentStyles {
    checkbox?: ICheckboxStyles;
    confirmationStack?: IStackStyles;
}
