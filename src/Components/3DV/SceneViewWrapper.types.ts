import {
    ITheme,
    IStyle,
    IStyleFunctionOrObject,
    IStackStyles
} from '@fluentui/react';
import { WrapperMode } from './SceneView.types';

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
    mode: WrapperMode;
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
    rightHeaderControlsStack: IStackStyles;
    cameraControlsStack: IStackStyles;
}
