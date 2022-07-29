import {
    IButtonStyles,
    IFocusTrapZone,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export interface IFocusCalloutButtonProps {
    iconName: string;
    buttonText: string;
    calloutTitle: string;
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onBackIconClick?: () => void;
    onFocusDismiss?: () => void;
    componentRef?: React.MutableRefObject<IFocusTrapZone>;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IFocusCalloutButtonStyleProps,
        IFocusCalloutButtonStyles
    >;
}

export interface IFocusCalloutButtonStyleProps {
    theme: ITheme;
}
export interface IFocusCalloutButtonStyles {
    root: IStyle;
    button: IStyle;
    calloutContent: IStyle;
    header: IStyle;
    title: IStyle;
    titleIcon: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFocusCalloutButtonSubComponentStyles;
}

export interface IFocusCalloutButtonSubComponentStyles {
    button: IButtonStyles;
    stack: IStackStyles;
}
