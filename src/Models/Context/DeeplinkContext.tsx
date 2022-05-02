/**
 * This context is for transferring state from one session to another. These properties are managed by the various parts of the app and can be read onMount to restore the state
 */
import produce from 'immer';
import queryString from 'query-string';
import React, { useContext, useReducer } from 'react';
import { ADT3DScenePageModes } from '../Constants';

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IADTDeeplinkContext {
    deeplinkState: DeeplinkContextState;
    deeplinkDispatch: React.Dispatch<DeeplinkContextAction>;
}

export const DeeplinkContext = React.createContext<IADTDeeplinkContext>(null);
export const useDeeplinkContext = () => useContext(DeeplinkContext);

/**
 * The state of the context
 */
export interface DeeplinkContextState {
    adtUrl: string;
    deeplink: string;
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
        // console.log(
        //     `*** Updating Deeplink context ${action.type} with payload: `,
        //     action.payload
        // );
        switch (action.type) {
            case DeeplinkContextActionType.SET_ADT_URL: {
                draft.adtUrl = action.payload.url || '';
                draft.deeplink = buildDeeplink(draft);
                break;
            }
            case DeeplinkContextActionType.SET_ELEMENT_ID: {
                draft.selectedElementId = action.payload.id || '';
                draft.deeplink = buildDeeplink(draft);
                break;
            }
            case DeeplinkContextActionType.SET_LAYER_IDS: {
                draft.selectedLayerIds = action.payload.ids || [];
                draft.deeplink = buildDeeplink(draft);
                break;
            }
            case DeeplinkContextActionType.SET_MODE: {
                draft.mode = action.payload.mode;
                draft.deeplink = buildDeeplink(draft);
                break;
            }
            case DeeplinkContextActionType.SET_SCENE_ID: {
                draft.sceneId = action.payload.sceneId || '';
                draft.deeplink = buildDeeplink(draft);
                break;
            }
            case DeeplinkContextActionType.SET_STORAGE_URL: {
                draft.storageUrl = action.payload.url || '';
                draft.deeplink = buildDeeplink(draft);
                break;
            }
        }
    }
);

export interface IPublicDeeplink {
    adtUrl: string;
    mode: ADT3DScenePageModes;
    sceneId: string;
    selectedElementId: string;
    selectedLayerIds: string[];
    storageUrl: string;
}
const buildDeeplink = (currentState: DeeplinkContextState): string => {
    const deeplink: IPublicDeeplink = {
        adtUrl: currentState.adtUrl,
        mode: currentState.mode,
        sceneId: currentState.sceneId,
        selectedElementId: currentState.selectedElementId,
        selectedLayerIds: currentState.selectedLayerIds,
        storageUrl: currentState.storageUrl
    };

    const newValue = queryString.stringify(deeplink);
    // console.log(`*** Deeplink: `, deeplink, newValue);
    return newValue;
};

interface IDeeplinkContextProviderProps {
    /**
     * Initial URL to the ADT instance the scene uses.
     * Optional except at the ADT3DScenePage level
     */
    initialAdtInstanceUrl?: string;
    /**
     * Initial URL to the storage instance the scene uses.
     * Optional except at the ADT3DScenePage level
     */
    initialStorageUrl?: string;
}
export const DeeplinkContextProvider: React.FC<IDeeplinkContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useDeeplinkContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { initialAdtInstanceUrl, initialStorageUrl } = props;

    const params = window.location.search;
    const parsed = queryString.parse(params);
    console.log('***Query strings', params, parsed);

    // set the initial state for the Deeplink reducer
    const [deeplinkState, deeplinkDispatch] = useReducer(
        DeeplinkContextReducer,
        {
            adtUrl:
                // 'https://' + 'mitchtest.api.wus2.digitaltwins.azure.net' ||
                initialAdtInstanceUrl || '',
            deeplink: '',
            mode: ADT3DScenePageModes.ViewScene,
            sceneId: 'f7053e7537048e03be4d1e6f8f93aa8a',
            // sceneId: '58e02362287440d9a5bf3f8d6d6bfcf9',
            selectedElementId: '8e3db965a88c8eac56af222786b53a08',
            selectedLayerIds: ['8904b620aa83c649888dadc7c8fdf492'],
            storageUrl:
                // 'https://cardboardresources.blob.core.windows.net/msnyder' ||
                initialStorageUrl || ''
        }
    );
    return (
        <DeeplinkContext.Provider
            value={{
                deeplinkDispatch,
                deeplinkState
            }}
        >
            {children}
        </DeeplinkContext.Provider>
    );
};
