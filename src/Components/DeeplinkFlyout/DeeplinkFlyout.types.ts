import {
    ITheme,
    IStyle,
    ICalloutContentStyles,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { IHeaderControlButtonStyles } from '../HeaderControlButton/HeaderControlButton.types';
import { IHeaderControlGroupStyles } from '../HeaderControlGroup/HeaderControlGroup.types';

export interface IDeeplinkFlyoutProps {
    mode: 'Simple' | 'Options';
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDeeplinkFlyoutStyleProps,
        IDeeplinkFlyoutStyles
    >;
}

export interface IDeeplinkFlyoutStyleProps {
    theme: ITheme;
    isCalloutOpen: boolean;
}
export interface IDeeplinkFlyoutStyles {
    root: IStyle;
    button: IStyle;
    callout: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDeeplinkFlyoutSubComponentStyles;
}

export interface IDeeplinkFlyoutSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
    headerControlGroup?: IHeaderControlGroupStyles;
    headerControlButton?: IHeaderControlButtonStyles;
}
