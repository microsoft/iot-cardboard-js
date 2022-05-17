import {
    IStyleFunctionOrObject,
    ITheme,
    IStyle,
    IPivotStyles
} from '@fluentui/react';
import { ADT3DScenePageSteps } from '../../../Models/Constants';

export interface ISceneListModeToggleProps {
    onListModeChange: (SceneListMode: ADT3DScenePageSteps) => void;
    selectedMode: ADT3DScenePageSteps;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, ISceneListModeToggleStyles>;
}

export interface ISceneListModeToggleStyleProps {
    theme: ITheme;
}
export interface ISceneListModeToggleStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISceneListModeToggleSubComponentStyles;
}

export interface ISceneListModeToggleSubComponentStyles {
    pivot?: Partial<IPivotStyles>;
}
