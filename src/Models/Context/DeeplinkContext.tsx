/**
 * This context is for transferring state from one session to another. These properties are managed by the various parts of the app and can be read onMount to restore the state
 */
import produce from 'immer';
import queryString from 'query-string';
import React, { useContext, useReducer } from 'react';
import { ADT3DScenePageModes } from '../Constants';

// &adtUrl=https%3A%2F%2FmockADTInstanceResourceName.api.wcus.digitaltwins.azure.net&mode=viewer&sceneId=f7053e7537048e03be4d1e6f8f93aa8a&selectedElementIds=8e3db965a88c8eac56af222786b53a08&selectedLayerIds=8904b620aa83c649888dadc7c8fdf492%2C9624b620aa83c649888dadc7c8fdf541&storageUrl=https%3A%2F%2FmockStorageAccountName.blob.core.windows.net%2FmockContainerName%208e3db965a88c8eac56af222786b53a08 8e3db965a88c8eac56af222786b53a08

export const DeeplinkContext = React.createContext<IADTDeeplinkContext>(null);
export const useDeeplinkContext = () => useContext(DeeplinkContext);

export const DeeplinkContextReducer: (
    draft: DeeplinkContextState,
    action: DeeplinkContextAction
) => DeeplinkContextState = produce(
    (draft: DeeplinkContextState, action: DeeplinkContextAction) => {
        // console.debug(
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
    const parsed = (queryString.parse(params, {
        decode: true,
        sort: false
    }) as unknown) as IPublicDeeplink;

    // set the initial state for the Deeplink reducer
    const defaultState: DeeplinkContextState = {
        adtUrl: parsed.adtUrl || initialAdtInstanceUrl || '',
        deeplink: '',
        mode: parsed.mode || ADT3DScenePageModes.ViewScene,
        sceneId: parsed.sceneId || '',
        selectedElementId: parseArrayParam(parsed.selectedElementIds)[0] || '',
        selectedLayerIds: parseArrayParam(parsed.selectedLayerIds) || [],
        storageUrl: parsed.storageUrl || initialStorageUrl || ''
    };
    defaultState.deeplink = buildDeeplink(defaultState);

    const [deeplinkState, deeplinkDispatch] = useReducer(
        DeeplinkContextReducer,
        defaultState
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

const buildDeeplink = (currentState: DeeplinkContextState): string => {
    const deeplink: IPublicDeeplink = {
        adtUrl: currentState.adtUrl,
        mode: currentState.mode,
        sceneId: currentState.sceneId,
        selectedElementIds: serializeArrayParam([
            currentState.selectedElementId
        ]),
        selectedLayerIds: serializeArrayParam(currentState.selectedLayerIds),
        storageUrl: currentState.storageUrl
    };

    const newValue = queryString.stringify(deeplink, {
        encode: true,
        sort: false,
        skipEmptyString: true
    });
    // console.debug(`*** Deeplink: `, deeplink, newValue);
    return newValue;
};

const ARRAY_VALUE_SEPARATOR = ',';
/** takes a parameter that should be an array and serializes it for the URL */
const serializeArrayParam = (values: string[]): string => {
    if (!values?.length) return '';
    return values.join(ARRAY_VALUE_SEPARATOR);
};

/** takes a parameter that should be an array and splits it back out from string to an array */
const parseArrayParam = (value: string): string[] => {
    if (!value) return [];
    return value.split(ARRAY_VALUE_SEPARATOR);
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

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IADTDeeplinkContext {
    deeplinkState: DeeplinkContextState;
    deeplinkDispatch: React.Dispatch<DeeplinkContextAction>;
}

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

/** The object serialized to create the deeplink URL */
export interface IPublicDeeplink {
    adtUrl: string;
    mode: ADT3DScenePageModes;
    sceneId: string;
    selectedElementIds: string;
    selectedLayerIds: string;
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
