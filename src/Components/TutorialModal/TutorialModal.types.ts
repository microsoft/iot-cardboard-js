import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

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

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITutorialModalSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITutorialModalSubComponentStyles {}
