import { CustomMeshItem } from '../../Classes/SceneView.types';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
export interface ISceneViewContext {
    sceneViewState: ISceneViewContextState;
    sceneViewDispatch: React.Dispatch<SceneViewContextAction>;
}

export interface ISceneViewContextProviderProps {
    outlinedMeshItems?: CustomMeshItem[];
}

export interface ISceneViewContextState {
    outlinedMeshItems?: CustomMeshItem[];
    // coloredMeshItems?: CustomMeshItem[];
}

export enum SceneViewContextActionType {
    /** set array of outlined mesh items */
    SET_SCENE_SELECTED_MESHES = 'SET_SCENE_SELECTED_MESHES',
    SET_SCENE_OUTLINED_MESHES = 'SET_SCENE_OUTLINED_MESHES',
    // TODO: Enable this when colored meshes are included in this pattern
    // SET_SCENE_COLORED_MESHES = 'SET_SCENE_COLORED_MESHES'
    RESET_SELECTED_MESHES = 'RESET_SELECTED_MESHES',
    RESET_OUTLINED_MESHES = 'RESET_OUTLINED_MESHES',
    OUTLINE_BEHAVIOR_MESHES = 'OUTLINE_BEHAVIOR_MESHES',
    OUTLINE_ELEMENT_MESHES = 'OUTLINE_ELEMENTS_MESHES'
}

export type SceneViewContextAction =
    // Set Scene Meshes
    | {
          type:
              | SceneViewContextActionType.SET_SCENE_OUTLINED_MESHES
              | SceneViewContextActionType.SET_SCENE_SELECTED_MESHES;
          // TODO: Add this type when colored meshes are included in this pattern
          // | SceneViewContextActionType.SET_SCENE_COLORED_MESHES
          payload: {
              meshIds: string[];
              color?: string;
          };
      }
    | {
          type: SceneViewContextActionType.OUTLINE_ELEMENT_MESHES;
          payload: {
              elements: ITwinToObjectMapping[];
              meshId: string;
              color?: string;
          };
      }
    | {
          type: SceneViewContextActionType.OUTLINE_BEHAVIOR_MESHES;
          payload: {
              behavior: IBehavior;
              elements: ITwinToObjectMapping[];
              color?: string;
          };
      }
    | {
          type: SceneViewContextActionType.RESET_SELECTED_MESHES;
      }
    | {
          type: SceneViewContextActionType.RESET_OUTLINED_MESHES;
          payload?: {
              outlinedMeshItems: CustomMeshItem[];
          };
      };
