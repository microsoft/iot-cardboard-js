import {
    IPivotStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADT3DScenePageModes } from '../../../Models/Constants';

export interface IFloatingScenePageModeToggleProps {
    handleScenePageModeChange: (newScenePageMode: ADT3DScenePageModes) => void;
    selectedMode: ADT3DScenePageModes;
    sceneId: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IFloatingScenePageModeToggleStyleProps,
        IFloatingScenePageModeToggleStyles
    >;
}

export interface IFloatingScenePageModeToggleStyleProps {
    theme: ITheme;
}
export interface IFloatingScenePageModeToggleStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFloatingScenePageModeToggleSubComponentStyles;
}

export interface IFloatingScenePageModeToggleSubComponentStyles {
    pivot: Partial<IPivotStyles>;
}
