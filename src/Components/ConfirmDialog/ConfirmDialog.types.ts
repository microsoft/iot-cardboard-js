import {
    IButtonProps,
    IDialogStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface IConfirmDialogProps {
    title?: string;
    message?: string;
    primaryButtonProps: Omit<IButtonProps, 'onClick'>;
    cancelButtonProps?: Omit<IButtonProps, 'onClick'>;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IConfirmDialogStyleProps,
        IConfirmDialogStyles
    >;
}

export interface IConfirmDialogStyleProps {
    theme: IExtendedTheme;
}
export interface IConfirmDialogStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IConfirmDialogSubComponentStyles;
}

export interface IConfirmDialogSubComponentStyles {
    dialog?: Partial<IDialogStyles>;
}
