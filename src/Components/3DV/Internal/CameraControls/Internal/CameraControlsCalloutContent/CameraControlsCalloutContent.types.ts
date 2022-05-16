import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface ICameraControlsCalloutContentProps {
    type: 'Orbit' | 'Move';
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ICameraControlsCalloutContentStyleProps,
        ICameraControlsCalloutContentStyles
    >;
}

export interface ICameraControlsCalloutContentStyleProps {
    theme: ITheme;
}
export interface ICameraControlsCalloutContentStyles {
    root: IStyle;
    buttonIcon: IStyle;
    mode: IStyle;
    modes: IStyle;
    modeIcon: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ICameraControlsCalloutContentSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICameraControlsCalloutContentSubComponentStyles {}
