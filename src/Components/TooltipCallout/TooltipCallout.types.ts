import {
    IButtonStyles,
    ICalloutContentStyles,
    ICalloutProps,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IIconNames } from '../../Models/Constants';

export interface ITooltipCalloutProps {
    buttonAriaLabel: string;
    calloutProps?: Omit<ICalloutProps, 'target' | 'onDismiss' | 'styles'>;
    dataTestId?: string;
    iconName?: IIconNames;
    calloutContent: JSX.Element | string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITooltipCalloutStyleProps,
        ITooltipCalloutStyles
    >;
}

export interface ITooltipCalloutStyleProps {
    theme: ITheme;
}
export interface ITooltipCalloutStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITooltipCalloutSubComponentStyles;
}

export interface ITooltipCalloutSubComponentStyles {
    button?: IButtonStyles;
    callout?: Partial<ICalloutContentStyles>;
}
