/**
 * This context is for managing values that can control how a scene looks
 */

import produce from 'immer';
import React, { useReducer } from 'react';
import { useContext } from 'react';
import { createCustomMeshItems } from '../../../Components/3DV/SceneView.Utils';
import { CustomMeshItem } from '../../Classes/SceneView.types';
import ViewerConfigUtility from '../../Classes/ViewerConfigUtility';
import { deepCopy, getDebugLogger } from '../../Services/Utils';
import { ITwinToObjectMapping } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
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
            (action as any).payload // ignore that payload doesn't always come since this is just a log
        );
        switch (action.type) {
            case SceneViewContextActionType.SET_SCENE_OUTLINED_MESHES: {
                const customMeshItems = createCustomMeshItems(
                    action.payload.meshIds,
                    action.payload.color
                );
                draft.outlinedMeshItems = customMeshItems;
                break;
            }
            case SceneViewContextActionType.RESET_SELECTED_MESHES: {
                draft.outlinedMeshItems = [];
                break;
            }
            case SceneViewContextActionType.RESET_OUTLINED_MESHES: {
                draft.outlinedMeshItems = action.payload
                    ? action.payload.outlinedMeshItems
                    : [];
                break;
            }
            case SceneViewContextActionType.OUTLINE_BEHAVIOR_MESHES: {
                const behavior = action.payload.behavior;
                // get elements that are contained in the hovered behavior
                let meshIds: string[] = [];
                const selectedElements: ITwinToObjectMapping[] = [];
                behavior.datasources
                    .filter(
                        ViewerConfigUtility.isElementTwinToObjectMappingDataSource
                    )
                    .forEach((ds) => {
                        ds.elementIDs.forEach((elementId) => {
                            const element = action.payload.elements.find(
                                (el) => el.id === elementId
                            );
                            element && selectedElements.push(element);
                        });
                    });

                for (const element of selectedElements) {
                    meshIds = meshIds.concat(element.objectIDs);
                }

                const customMeshItems = createCustomMeshItems(
                    meshIds,
                    action.payload.color
                );
                draft.outlinedMeshItems = customMeshItems;
                break;
            }
            case SceneViewContextActionType.OUTLINE_ELEMENT_MESHES: {
                const meshIds = [];
                for (const element of action.payload.elements) {
                    // find elements that contain this mesh
                    if (element.objectIDs.includes(action.payload.mesh.id)) {
                        for (const id of element.objectIDs) {
                            // add meshes that make up element to highlight
                            meshIds.push(id);
                        }
                    }
                }

                const customMeshItems = createCustomMeshItems(
                    meshIds,
                    action.payload.color
                );
                draft.outlinedMeshItems = customMeshItems;
                break;
            }
            // TODO: Enable this when colored meshes are included in this pattern
            // case SceneViewContextActionType.SET_SCENE_COLORED_MESHES: {
            //     const customMeshItems = createCustomMeshItems(
            //         action.payload.meshIds,
            //         action.payload.color
            //     );
            //     break;
            // }
            // case SceneViewContextActionType.SET_SCENE_SELECTED_MESHES: {
            //     const customMeshItems = createCustomMeshItems(
            //         action.payload.meshIds,
            //         action.payload.color
            //     );
            //     draft.outlinedMeshItems = customMeshItems;
            //     draft.coloredMeshItems = customMeshItems;
            //     break;
            // }
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
