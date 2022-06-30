import { CustomMeshItem } from '../../Classes/SceneView.types';

export interface ISceneViewContext {
    sceneViewState: ISceneViewContextState;
    sceneViewDispatch: React.Dispatch<SceneViewContextAction>;
}

export interface ISceneViewContextProviderProps {
    outlinedMeshItems: CustomMeshItem[];
}

export interface ISceneViewContextState {
    outlinedMeshItems: CustomMeshItem[];
}

export enum SceneViewContextActionType {
    /** set array of outlined mesh items */
    SET_OUTLINED_MESH_ITEMS = 'SET_OUTLINED_MESH_ITEMS'
}

export type SceneViewContextAction = {
    type: SceneViewContextActionType.SET_OUTLINED_MESH_ITEMS;
    payload: { outlinedMeshItems: CustomMeshItem[] };
};
