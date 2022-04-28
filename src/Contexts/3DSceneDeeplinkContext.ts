import produce from 'immer';
import React, { useContext } from 'react';
import { ADT3DScenePageModes } from '../Models/Constants/Enums';

/**
 * This context is for transferring state from one session to another. These properties are managed by the various parts of the app and can be read onMount to restore the state
 */

/**
 * The state of the context
 */
export interface DeeplinkContextState {
    adtUrl: string;
    mode: ADT3DScenePageModes;
    sceneId: string;
    selectedElementId: string;
    selectedLayerIds: string[];
    storageUrl: string;
}

/**
 * The actions to update the state
 */
export enum DeeplinkContextActionType {
    SET_ADT_URL = 'SET_ADT_URL',
    SET_ELEMENT_ID = 'SET_ELEMENT_ID',
    SET_LAYER_IDS = 'SET_LAYER_IDS',
    SET_MODE = 'SET_MODE',
    SET_SCENE_ID = 'SET_SCENE_ID',
    SET_STORAGE_URL = 'SET_STORAGE_URL'
}

/** The actions to update the state */
export type DeeplinkContextAction =
    | {
          type: DeeplinkContextActionType.SET_ADT_URL;
          payload: { url: string };
      }
    | {
          type: DeeplinkContextActionType.SET_ELEMENT_ID;
          payload: { id: string };
      }
    | {
          type: DeeplinkContextActionType.SET_LAYER_IDS;
          payload: { ids: string[] };
      }
    | {
          type: DeeplinkContextActionType.SET_MODE;
          payload: { mode: ADT3DScenePageModes };
      }
    | {
          type: DeeplinkContextActionType.SET_SCENE_ID;
          payload: { sceneId: string };
      }
    | {
          type: DeeplinkContextActionType.SET_STORAGE_URL;
          payload: { url: string };
      };

export const DeeplinkContextReducer: (
    draft: DeeplinkContextState,
    action: DeeplinkContextAction
) => DeeplinkContextState = produce(
    (draft: DeeplinkContextState, action: DeeplinkContextAction) => {
        switch (action.type) {
            case DeeplinkContextActionType.SET_ADT_URL: {
                draft.adtUrl = action.payload.url;
                break;
            }
            case DeeplinkContextActionType.SET_ELEMENT_ID: {
                draft.selectedElementId = action.payload.id;
                break;
            }
            case DeeplinkContextActionType.SET_LAYER_IDS: {
                draft.selectedLayerIds = action.payload.ids;
                break;
            }
            case DeeplinkContextActionType.SET_MODE: {
                draft.mode = action.payload.mode;
                break;
            }
            case DeeplinkContextActionType.SET_SCENE_ID: {
                draft.sceneId = action.payload.sceneId;
                break;
            }
            case DeeplinkContextActionType.SET_STORAGE_URL: {
                draft.storageUrl = action.payload.url;
                break;
            }
        }
    }
);

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IADTDeeplinkContext {
    deeplinkState: DeeplinkContextState;
    deeplinkDispatch: React.Dispatch<DeeplinkContextAction>;
}

export const DeeplinkContext = React.createContext<IADTDeeplinkContext>(null);
export const useDeeplinkContext = () => useContext(DeeplinkContext);
