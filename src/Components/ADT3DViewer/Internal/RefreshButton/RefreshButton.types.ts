import {
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IHeaderControlButtonStyles } from '../../../HeaderControlButton/HeaderControlButton.types';
import { IHeaderControlGroupStyles } from '../../../HeaderControlGroup/HeaderControlGroup.types';

export interface IRefreshButtonProps {
    isRefreshing: boolean;
    lastRefreshTimeInMs: number;
    refreshFrequency: number;
    onClick: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IRefreshButtonStyleProps,
        IRefreshButtonStyles
    >;
}

export interface IRefreshButtonStyleProps {
    isRefreshing: boolean;
    theme: ITheme;
}
export interface IRefreshButtonStyles {
    root: IStyle;
    button: IStyle;
    callout: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IRefreshButtonSubComponentStyles;
}

export interface IRefreshButtonSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
    headerControlGroup?: IHeaderControlGroupStyles;
    headerControlButton?: IHeaderControlButtonStyles;
}
