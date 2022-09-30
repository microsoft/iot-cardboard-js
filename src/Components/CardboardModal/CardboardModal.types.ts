import {
    IButtonProps,
    IButtonStyles,
    IIconStyles,
    IModalStyles,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { CardboardIconNames } from '../../Models/Constants';

export interface ICardboardModalProps {
    /** on click of the destructive action. If not provided, button is hidden */
    destructiveButtonProps?: IButtonProps;
    /** is the modal open */
    isOpen: boolean;
    /** on dismiss of the dialog (either close or cancel) */
    onDismiss: () => void;
    /** click handle for the primary footer button */
    primaryButtonProps: IButtonProps;
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
    isDestructiveFooterActionVisible: boolean;
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
