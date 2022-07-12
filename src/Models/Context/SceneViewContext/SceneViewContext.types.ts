import { CustomMeshItem } from '../../Classes/SceneView.types';

export interface ISceneViewContext {
    sceneViewState: ISceneViewContextState;
    sceneViewDispatch: React.Dispatch<SceneViewContextAction>;
    setSceneViewAttributes: (state: ISceneViewContextState) => void;
}

export interface ISceneViewContextProviderProps {
    outlinedMeshItems: CustomMeshItem[];
}

export interface ISceneViewContextState {
    outlinedMeshItems?: CustomMeshItem[];
}

export enum SceneViewContextActionType {
    /** set array of outlined mesh items */
    SET_OUTLINED_MESH_ITEMS = 'SET_OUTLINED_MESH_ITEMS',
    SET_SCENE_VIEW_ATTRIBUTES = 'SET_SCENE_VIEW_ATTRIBUTES'
}

export type SceneViewContextAction = {
    type: SceneViewContextActionType;
    payload: ISceneViewContextState;
};
