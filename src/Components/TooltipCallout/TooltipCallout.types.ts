import {
    IButtonStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme,
    ITooltipHostProps,
    ITooltipStyles
} from '@fluentui/react';
import { IIconNames } from '../../Models/Constants';

export interface ITooltipCalloutLink {
    text?: string;
    url: string;
}
export interface ITooltipCalloutContent {
    buttonAriaLabel: string;
    calloutContent: JSX.Element | string;

    iconName?: IIconNames;
    link?: ITooltipCalloutLink;
}

export interface ITooltipCalloutProps {
    content: ITooltipCalloutContent;
    calloutProps?: Omit<ITooltipHostProps, 'styles'>;
    dataTestId?: string;
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
    callout?: Partial<ITooltipStyles>;
}
