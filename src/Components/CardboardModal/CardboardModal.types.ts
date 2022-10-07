import {
    IButtonProps,
    IButtonStyles,
    IIconStyles,
    ILinkProps,
    IModalProps,
    IModalStyles,
    IStackProps,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { CardboardIconNames } from '../../Models/Constants';

export interface ICardboardModalProps {
    /** overrides for stack props for the main content body */
    contentStackProps?: IStackProps;
    /** props for the danger action in the footer. If not provided, button is hidden */
    footerDangerButtonProps?: IButtonProps;
    footerLinkProps?: {
        text: string;
        url: string;
        linkProps?: ILinkProps;
    };
    /** click handle for the primary footer button */
    footerPrimaryButtonProps: IButtonProps;
    /** is the modal open */
    isOpen: boolean;
    /** additional props to pass to the modal for customization */
    modalProps?: Omit<
        Partial<IModalProps>,
        'isOpen' | 'titleAriaId' | 'onDismiss' | 'styles'
    >;
    /** on dismiss of the dialog (either close or cancel) */
    onDismiss: () => void;
    /** sub title text */
    subTitle?: string | (() => React.ReactNode);
    /** title text */
    title: string | (() => React.ReactNode);
    /**
     * icon next to the title
     */
    titleIconName?: CardboardIconNames;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ICardboardModalStyleProps,
        ICardboardModalStyles
    >;
}

export interface ICardboardModalStyleProps {
    theme: ITheme;
    splitFooter: boolean;
}
export interface ICardboardModalStyles {
    content: IStyle;
    footer: IStyle;
    headerContainer: IStyle;
    subtitle: IStyle;
    title: IStyle;
    titleContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ICardboardModalSubComponentStyles;
}

export interface ICardboardModalSubComponentStyles {
    cancelButton?: Partial<IButtonStyles>;
    destructiveButton?: Partial<IButtonStyles>;
    footerStack?: IStackStyles;
    icon?: IIconStyles;
    modal?: Partial<IModalStyles>;
    primaryButton?: Partial<IButtonStyles>;
}
