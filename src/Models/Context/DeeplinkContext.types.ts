import { ADT3DScenePageModes } from '../Constants';

export interface IDeeplinkContextProviderProps {
    initialState?: Partial<IDeeplinkContextState>;
}

/** options for generating the deeplink */
export interface IDeeplinkOptions {
    includeSelectedElement: boolean;
    includeSelectedLayers: boolean;
    excludeBaseUrl?: boolean;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IDeeplinkContext {
    deeplinkState: IDeeplinkContextState;
    deeplinkDispatch: React.Dispatch<DeeplinkContextAction>;
    getDeeplink: (options: IDeeplinkOptions) => string;
}

/**
 * The state of the context
 */
export interface IDeeplinkContextState {
    adtUrl: string;
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
