import {
    ITheme,
    IStyle,
    IStyleFunctionOrObject,
    IStackStyles
} from '@fluentui/react';

export interface ISceneViewWrapperProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ISceneViewWrapperStyleProps,
        ISceneViewWrapperStyles
    >;
}

export interface ISceneViewWrapperStyleProps {
    theme: ITheme;
}
export interface ISceneViewWrapperStyles {
    root: IStyle;
    leftHeaderControlsContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISceneViewWrapperSubComponentStyles;
}

export interface ISceneViewWrapperSubComponentStyles {
    leftHeaderControlsStack: IStackStyles;
    centerHeaderControlsStack: IStackStyles;
}
