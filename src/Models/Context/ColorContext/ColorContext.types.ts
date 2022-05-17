import { ViewerObjectStyle } from '../../Constants/Enums';

export interface ViewerMode {
    objectColor: string;
    sceneBackground: string;
    objectStyle: ViewerObjectStyle;
}

export interface IColorContextProviderProps {
    initialState?: Partial<IColorContextState>;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IColorContext {
    colorState: IColorContextState;
    colorDispatch: React.Dispatch<ColorContextAction>;
}

/**
 * The state of the context
 */
export interface IColorContextState {
    objectColor: string;
    objectStyle: ViewerObjectStyle;
    sceneBackground: string;
}

/**
 * The actions to update the state
 */
export enum ColorContextActionType {
    SET_OBJECT_COLOR = 'SET_OBJECT_COLOR',
    SET_SCENE_BACKGROUND = 'SET_SCENE_BACKGROUND',
    SET_OBJECT_STYLE = 'SET_OBECT_STYLE'
}

/** The actions to update the state */
export type ColorContextAction =
    | {
          type: ColorContextActionType.SET_OBJECT_COLOR;
          payload: { color: string };
      }
    | {
          type: ColorContextActionType.SET_SCENE_BACKGROUND;
          payload: { color: string };
      }
    | {
          type: ColorContextActionType.SET_OBJECT_STYLE;
          payload: { style: ViewerObjectStyle };
      };
