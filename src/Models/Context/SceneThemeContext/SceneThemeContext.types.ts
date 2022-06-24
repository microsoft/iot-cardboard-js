import { IADTBackgroundColor, IADTObjectColor } from '../../Constants';
import { ViewerObjectStyle } from '../../Constants/Enums';

export interface ViewerMode {
    objectColor: string;
    sceneBackground: string;
    objectStyle: ViewerObjectStyle;
}

export interface ISceneThemeContextProviderProps {
    initialState?: Partial<ISceneThemeContextState>;
    /** whether to read the theme from storage */
    shouldPersistTheme?: boolean;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface ISceneThemeContext {
    sceneThemeState: ISceneThemeContextState;
    sceneThemeDispatch: React.Dispatch<SceneThemeContextAction>;
}

/**
 * The state of the context
 */
export interface ISceneThemeContextState {
    objectColor: IADTObjectColor;
    objectColorOptions: IADTObjectColor[];
    objectStyle: ViewerObjectStyle;
    objectStyleOptions: IObjectStyleOption[];
    sceneBackground: IADTBackgroundColor;
    sceneBackgroundOptions: IADTBackgroundColor[];
}

/**
 * The actions to update the state
 */
export enum SceneThemeContextActionType {
    SET_OBJECT_COLOR = 'SET_OBJECT_COLOR',
    SET_OBJECT_COLOR_OPTIONS = 'SET_OBJECT_COLOR_OPTIONS',
    SET_SCENE_BACKGROUND = 'SET_SCENE_BACKGROUND',
    SET_SCENE_BACKGROUND_OPTIONS = 'SET_SCENE_BACKGROUND_OPTIONS',
    SET_OBJECT_STYLE = 'SET_OBECT_STYLE',
    SET_OBJECT_STYLE_OPTIONS = 'SET_OBJECT_STYLE_OPTIONS'
}

/** The actions to update the state */
export type SceneThemeContextAction =
    | {
          type: SceneThemeContextActionType.SET_OBJECT_COLOR;
          payload: { color: string };
      }
    | {
          type: SceneThemeContextActionType.SET_OBJECT_COLOR_OPTIONS;
          payload: { options: IADTObjectColor[] };
      }
    | {
          type: SceneThemeContextActionType.SET_SCENE_BACKGROUND;
          payload: { color: string };
      }
    | {
          type: SceneThemeContextActionType.SET_SCENE_BACKGROUND_OPTIONS;
          payload: { options: IADTBackgroundColor[] };
      }
    | {
          type: SceneThemeContextActionType.SET_OBJECT_STYLE;
          payload: { style: ViewerObjectStyle };
      }
    | {
          type: SceneThemeContextActionType.SET_OBJECT_STYLE_OPTIONS;
          payload: { options: IObjectStyleOption[] };
      };

export interface IObjectStyleOption {
    key: ViewerObjectStyle;
    imageSrc: string;
    imageAlt: string;
    selectedImageSrc: string;
    imageSize: { width: 40; height: 40 };
    text: string;
}
