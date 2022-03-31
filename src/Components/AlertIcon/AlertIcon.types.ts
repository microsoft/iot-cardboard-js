import { IStyle, IStyleFunctionOrObject, Theme } from '@fluentui/react';

export interface IAlertIconProps {
    color: string;
    icon: string;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, IAlertIconStyles>;
}

export interface IAlertIconStyles {
    root: IStyle;
}
export interface IAlertIconStyleProps {
    theme: Theme;
    color: string;
}
