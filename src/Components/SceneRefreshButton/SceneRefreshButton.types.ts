import {
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IHeaderControlButtonStyles } from '../HeaderControlButton/HeaderControlButton.types';
import { IHeaderControlGroupStyles } from '../HeaderControlGroup/HeaderControlGroup.types';

export interface ISceneRefreshButtonProps {
    lastRefreshTimeInMs: number;
    refreshFrequency: number;
    onClick: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ISceneRefreshButtonStyleProps,
        ISceneRefreshButtonStyles
    >;
}

export interface ISceneRefreshButtonStyleProps {
    isRefreshing: boolean;
    theme: ITheme;
}
export interface ISceneRefreshButtonStyles {
    root: IStyle;
    button: IStyle;
    callout: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISceneRefreshButtonSubComponentStyles;
}

export interface ISceneRefreshButtonSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
    headerControlGroup?: IHeaderControlGroupStyles;
    headerControlButton?: IHeaderControlButtonStyles;
}
