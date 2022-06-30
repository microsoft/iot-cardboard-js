/**
 * This context is for managing values that can control how a scene looks
 */

import produce from 'immer';
import React, { useReducer } from 'react';
import { useContext } from 'react';
import { CustomMeshItem } from '../../Classes/SceneView.types';
import { deepCopy, getDebugLogger } from '../../Services/Utils';
import {
    ISceneViewContext,
    ISceneViewContextProviderProps,
    ISceneViewContextState,
    SceneViewContextAction,
    SceneViewContextActionType
} from './SceneViewContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('SceneViewContext', debugLogging);

export const SceneViewContext = React.createContext<ISceneViewContext>(null);
export const useSceneViewContext = () => useContext(SceneViewContext);

export const SceneViewContextReducer: (
    draft: ISceneViewContextState,
    action: SceneViewContextAction
) => ISceneViewContextState = produce(
    (draft: ISceneViewContextState, action: SceneViewContextAction) => {
        logDebugConsole(
            'info',
            `Updating Sceneview context ${action.type} with payload: `,
            action.payload
        );
        switch (action.type) {
            case SceneViewContextActionType.SET_OUTLINED_MESH_ITEMS: {
                draft.outlinedMeshItems =
                    action.payload.outlinedMeshItems || [];
                break;
            }
        }
    }
);

let initialOutlinedMeshItems: CustomMeshItem[];
export const SceneViewContextProvider: React.FC<ISceneViewContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useSceneViewContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { outlinedMeshItems } = props;
    initialOutlinedMeshItems = deepCopy(outlinedMeshItems);

    const defaultState: ISceneViewContextState = {
        outlinedMeshItems: initialOutlinedMeshItems
    };

    const [sceneViewState, sceneViewDispatch] = useReducer(
        SceneViewContextReducer,
        defaultState
    );
    return (
        <SceneViewContext.Provider
            value={{
                sceneViewDispatch,
                sceneViewState
            }}
        >
            {children}
        </SceneViewContext.Provider>
    );
};
