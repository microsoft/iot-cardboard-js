import {
    IButtonStyles,
    INavStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export interface ITutorialModalProps {
    isOpen: boolean;

    onDismiss: () => void;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITutorialModalStyleProps,
        ITutorialModalStyles
    >;
}

export interface ITutorialModalStyleProps {
    theme: ITheme;
}
export interface ITutorialModalStyles {
    root: IStyle;
    header: IStyle;
    body: IStyle;
    contentPane: IStyle;
    footer: IStyle;
    navContainer: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITutorialModalSubComponentStyles;
}

export interface ITutorialModalSubComponentStyles {
    closeButton: IButtonStyles;
    nav: Partial<INavStyles>;
}
