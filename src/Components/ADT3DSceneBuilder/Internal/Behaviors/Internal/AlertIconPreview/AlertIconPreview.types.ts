import { IStyle, IStyleFunctionOrObject, Theme } from '@fluentui/react';
import { IAlertIconStyles } from '../../../../../AlertIcon/AlertIcon.types';

export interface IAlertIconPreviewProps {
    color: string;
    icon: string;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, IAlertIconPreviewStyles>;
}

export interface IAlertIconPreviewStyles {
    root?: IStyle;
    subComponentStyles?: IAlertIconPreviewSubComponentStyles;
}
export interface IAlertIconPreviewSubComponentStyles {
    alertIcon: IAlertIconStyles;
}
export interface IAlertIconStylePreviewProps {
    theme: Theme;
}
