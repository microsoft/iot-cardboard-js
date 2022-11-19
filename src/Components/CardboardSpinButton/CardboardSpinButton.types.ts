import {
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles
} from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface ICardboardSpinButtonProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ICardboardSpinButtonStyleProps,
        ICardboardSpinButtonStyles
    >;
}

export interface ICardboardSpinButtonStyleProps {
    theme: IExtendedTheme;
}
export interface ICardboardSpinButtonStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ICardboardSpinButtonSubComponentStyles;
}

export interface ICardboardSpinButtonSubComponentStyles {
    root: ITextFieldStyles;
}
