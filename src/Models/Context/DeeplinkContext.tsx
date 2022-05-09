/**
 * This context is for transferring state from one session to another. These properties are managed by the various parts of the app and can be read onMount to restore the state
 */
import produce from 'immer';
import queryString from 'query-string';
import React, { useContext, useReducer } from 'react';
import { ADT3DScenePageModes } from '../Constants';
import { getDebugLogger } from '../Services/Utils';
import {
    IDeeplinkContext,
    DeeplinkContextState,
    DeeplinkContextAction,
    DeeplinkContextActionType,
    IDeeplinkContextProviderProps,
    IPublicDeeplink
} from './DeeplinkContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DeeplinkContext', debugLogging);

// &mode=Viewer&sceneId=f7053e7537048e03be4d1e6f8f93aa8a&selectedElementIds=45131a84754280b924477f1df54ca547&selectedLayerIds=8904b620aa83c649888dadc7c8fdf492,9624b620aa83c649888dadc7c8fdf541&storageUrl=https://mockstorage.blob.core.windows.net/mockContainerName&adtUrl=https://mockadt.api.wcus.digitaltwins.azure.net

export const DeeplinkContext = React.createContext<IDeeplinkContext>(null);
export const useDeeplinkContext = () => useContext(DeeplinkContext);

export const DeeplinkContextReducer: (
    draft: DeeplinkContextState,
    action: DeeplinkContextAction
) => DeeplinkContextState = produce(
    (draft: DeeplinkContextState, action: DeeplinkContextAction) => {
        logDebugConsole(
            `Updating Deeplink context ${action.type} with payload: `,
            action.payload
        );
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

    const { initialState = {} } = props;

    const params = window.location.search;
    const parsed = (queryString.parse(params, {
        decode: true,
        sort: false
    }) as unknown) as IPublicDeeplink;

    // set the initial state for the Deeplink reducer
    // use the URL values and then fallback to initial state that is provided
    const defaultState: DeeplinkContextState = {
        adtUrl: parsed.adtUrl || initialState.adtUrl || '',
        deeplink: '',
        mode: parsed.mode || initialState.mode || ADT3DScenePageModes.ViewScene,
        sceneId: parsed.sceneId || initialState.sceneId || '',
        selectedElementId:
            parseArrayParam(parsed.selectedElementIds)?.[0] ||
            initialState.selectedElementId ||
            '',
        selectedLayerIds:
            parseArrayParam(parsed.selectedLayerIds) ||
            initialState.selectedLayerIds ||
            [],
        storageUrl: parsed.storageUrl || initialState.storageUrl || ''
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
    if (!currentState) return '';

    // note: the order of properties here is the order of that the QSPs will be in the URL
    const deeplink: IPublicDeeplink = {
        sceneId: currentState.sceneId,
        selectedElementIds: serializeArrayParam([
            currentState.selectedElementId
        ]),
        selectedLayerIds: serializeArrayParam(currentState.selectedLayerIds),
        mode: currentState.mode,
        adtUrl: currentState.adtUrl,
        storageUrl: currentState.storageUrl
    };

    const newValue = queryString.stringify(deeplink, {
        encode: true,
        sort: false,
        skipEmptyString: true
    });
    logDebugConsole(`*** Deeplink: `, deeplink, newValue);
    return newValue;
};

const ARRAY_VALUE_SEPARATOR = ',';
/**
 * takes a parameter that should be an array and serializes it for the URL
 * NOTE: we write our own serialization here to avoid the complex parsing logic that comes native since we only need primitives right now
 */
const serializeArrayParam = (values: string[]): string => {
    if (!values?.length) return '';
    return values.join(ARRAY_VALUE_SEPARATOR);
};

/**
 * takes a parameter that should be an array and splits it back out from string to an array
 * NOTE: we write our own serialization here to avoid the complex parsing logic that comes native since we only need primitives right now
 */
const parseArrayParam = (value: string): string[] => {
    if (!value) return undefined;
    return value.split(ARRAY_VALUE_SEPARATOR);
};
