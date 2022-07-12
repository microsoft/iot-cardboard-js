/**
 * This context is for managing values that can control how a scene looks
 */

import produce from 'immer';
import React, { useCallback, useReducer } from 'react';
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
            // Global setting action, overwrites only the values included in the payload
            case SceneViewContextActionType.SET_SCENE_VIEW_ATTRIBUTES: {
                Object.keys(action.payload).forEach((key) => {
                    draft[key] = action.payload[key];
                });
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

    const setSceneViewAttributes = useCallback(
        (newState: ISceneViewContextState) => {
            sceneViewDispatch({
                type: SceneViewContextActionType.SET_SCENE_VIEW_ATTRIBUTES,
                payload: newState
            });
        },
        []
    );

    return (
        <SceneViewContext.Provider
            value={{
                sceneViewDispatch,
                sceneViewState,
                setSceneViewAttributes: setSceneViewAttributes
            }}
        >
            {children}
        </SceneViewContext.Provider>
    );
};
