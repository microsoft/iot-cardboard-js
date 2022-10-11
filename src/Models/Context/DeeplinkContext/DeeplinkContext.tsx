/**
 * This context is for transferring state from one session to another. These properties are managed by the various parts of the app and can be read onMount to restore the state
 */
import produce from 'immer';
import queryString from 'query-string';
import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import {
    ADT3DScenePageModes,
    AzureResourceDisplayFields,
    AzureResourceTypes,
    IADTInstance
} from '../../Constants';
import {
    areResourceValuesEqual,
    getContainerNameFromUrl,
    getDebugLogger,
    getNameOfResource,
    getResourceId,
    getResourceUrl
} from '../../Services/Utils';
import { useConsumerDeeplinkContext } from '../ConsumerDeeplinkContext/ConsumerDeeplinkContext';
import {
    IDeeplinkContext,
    IDeeplinkContextState,
    DeeplinkContextAction,
    DeeplinkContextActionType,
    IDeeplinkOptions
} from './DeeplinkContext.types';
import {
    DEEPLINK_SERIALIZATION_OPTIONS,
    IDeeplinkContextProviderProps,
    IPublicDeeplink
} from '..';
import {
    getAdtInstanceOptionsFromLocalStorage,
    getResourceFromEnvironmentItem,
    getSelectedAdtInstanceFromLocalStorage,
    getSelectedStorageContainerFromLocalStorage,
    setSelectedAdtInstanceInLocalStorage,
    setSelectedStorageAccountInLocalStorage,
    setSelectedStorageContainerInLocalStorage
} from '../../Services/LocalStorageManager/LocalStorageManager';
import TelemetryService from '../../Services/TelemetryService/TelemetryService';
import { getStorageAccountUrlFromContainerUrl } from '../../../Components/EnvironmentPicker/EnvironmentPickerManager';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DeeplinkContext', debugLogging);

// &mode=Viewer&sceneId=f7053e7537048e03be4d1e6f8f93aa8a&selectedElementIds=45131a84754280b924477f1df54ca547&selectedLayerIds=8904b620aa83c649888dadc7c8fdf492,9624b620aa83c649888dadc7c8fdf541&storageUrl=https://mockstorage.blob.core.windows.net/mockContainerName&adtUrl=https://mockadt.api.wcus.digitaltwins.azure.net

export const DeeplinkContext = React.createContext<IDeeplinkContext>(null);
export const useDeeplinkContext = () => useContext(DeeplinkContext);

export const DeeplinkContextReducer: (
    draft: IDeeplinkContextState,
    action: DeeplinkContextAction
) => IDeeplinkContextState = produce(
    (draft: IDeeplinkContextState, action: DeeplinkContextAction) => {
        logDebugConsole(
            'info',
            `Updating Deeplink context ${action.type} with payload: `,
            action.payload
        );
        switch (action.type) {
            case DeeplinkContextActionType.SET_ADT_INSTANCE: {
                draft.adtUrl =
                    getResourceUrl(
                        action.payload.adtInstance,
                        AzureResourceTypes.DigitalTwinInstance
                    ) || '';
                draft.adtResourceId = getResourceId(action.payload.adtInstance);
                if (typeof action.payload.adtInstance === 'string') {
                    // try to get the selected item from options in local storage if previously fetched
                    const itemInLocalStorage = getAdtInstanceOptionsFromLocalStorage()?.find(
                        (option) =>
                            areResourceValuesEqual(
                                draft.adtUrl,
                                option.url,
                                AzureResourceDisplayFields.url
                            )
                    );
                    if (itemInLocalStorage) {
                        draft.adtResourceId = itemInLocalStorage.id;
                        const resourceFromItem = getResourceFromEnvironmentItem(
                            itemInLocalStorage,
                            AzureResourceTypes.DigitalTwinInstance
                        ) as IADTInstance;
                        setSelectedAdtInstanceInLocalStorage(resourceFromItem);
                    }
                } else {
                    setSelectedAdtInstanceInLocalStorage(
                        action.payload.adtInstance
                    );
                }
                break;
            }
            case DeeplinkContextActionType.SET_ELEMENT_ID: {
                draft.selectedElementId = action.payload.id || '';
                break;
            }
            case DeeplinkContextActionType.SET_LAYER_IDS: {
                draft.selectedLayerIds = action.payload.ids || [];
                break;
            }
            case DeeplinkContextActionType.SET_MODE: {
                draft.mode = action.payload.mode;
                draft.selectedElementId = '';
                draft.selectedLayerIds = [];
                break;
            }
            case DeeplinkContextActionType.SET_SCENE_ID: {
                draft.sceneId = action.payload.sceneId || '';
                TelemetryService.setSceneId(draft.sceneId);
                break;
            }
            case DeeplinkContextActionType.SET_STORAGE_CONTAINER: {
                draft.storageUrl =
                    getResourceUrl(
                        action.payload.storageContainer,
                        AzureResourceTypes.StorageBlobContainer,
                        action.payload.storageAccount
                    ) || '';
                setSelectedStorageAccountInLocalStorage(
                    action.payload.storageAccount
                );
                setSelectedStorageContainerInLocalStorage(
                    action.payload.storageContainer,
                    action.payload.storageAccount
                );
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

    const selectedAdtInstanceInLocalStorage = getSelectedAdtInstanceFromLocalStorage();
    const selectedStorageContainerInLocalStorage = getSelectedStorageContainerFromLocalStorage();

    const defaultAdtUrl =
        parsed.adtUrl ||
        initialState.adtUrl ||
        selectedAdtInstanceInLocalStorage?.url ||
        '';
    const defaultAdtResourceId =
        parsed.adtResourceId ||
        initialState.adtResourceId ||
        (areResourceValuesEqual(
            // this is needed to align the adt url with resource id, otherwise there might be cases where adt url comes from initial state or parsed link whereas the id is from localstorage which together may not point to the same Azure resource
            defaultAdtUrl,
            selectedAdtInstanceInLocalStorage?.url,
            AzureResourceDisplayFields.url
        ) &&
            selectedAdtInstanceInLocalStorage?.id) ||
        getAdtInstanceOptionsFromLocalStorage()?.find((option) =>
            areResourceValuesEqual(
                defaultAdtUrl,
                option.url,
                AzureResourceDisplayFields.url
            )
        )?.id || // if there is no id in the selected adt instance in localstorage, try to get it from options
        '';

    // set the initial state for the Deeplink reducer
    // use the URL values and then fallback to initial state that is provided
    const defaultState: IDeeplinkContextState = {
        adtUrl: defaultAdtUrl,
        adtResourceId: defaultAdtResourceId,
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
        storageUrl:
            parsed.storageUrl ||
            initialState.storageUrl ||
            selectedStorageContainerInLocalStorage?.url ||
            ''
    };

    const [deeplinkState, deeplinkDispatch] = useReducer(
        DeeplinkContextReducer,
        defaultState
    );
    const consumerDeeplinkContext = useConsumerDeeplinkContext();
    const getDeeplinkCallback = useCallback(
        (options: IDeeplinkOptions) => {
            let link = buildDeeplink(deeplinkState, options);
            // if the consumer provides a callback, call them and use the returned value
            if (consumerDeeplinkContext?.onGenerateDeeplink) {
                logDebugConsole(
                    'debug',
                    'Consumer deeplink callback present, passing string to consumer. Initial link:',
                    link
                );
                if (link) {
                    link = consumerDeeplinkContext?.onGenerateDeeplink(
                        link,
                        options
                    );
                }
                logDebugConsole('debug', 'Consumer modified link:', link);
            }
            return link;
        },
        [deeplinkState, consumerDeeplinkContext?.onGenerateDeeplink]
    );

    // notify telemetry service of changes to the adt instance
    useEffect(() => {
        TelemetryService.setAdtInstance(deeplinkState.adtUrl);
    }, [deeplinkState.adtUrl]);
    // notify telemetry service of changes to the blob storage
    useEffect(() => {
        TelemetryService.setStorageContainerUrl(deeplinkState.storageUrl);
    }, [deeplinkState.storageUrl]);
    // notify telemetry service of changes to the scene id
    useEffect(() => {
        TelemetryService.setSceneId(deeplinkState.sceneId);
    }, [deeplinkState.sceneId]);

    useEffect(() => {
        // initially update the local storage with selected values (in case the value is coming from parsed or initial state)
        setSelectedAdtInstanceInLocalStorage(
            defaultState.adtResourceId
                ? ({
                      id: defaultState.adtResourceId
                          ? defaultState.adtResourceId
                          : null,
                      name: getNameOfResource(
                          defaultState.adtUrl,
                          AzureResourceTypes.DigitalTwinInstance
                      ),
                      properties: {
                          hostName: new URL(defaultState.adtUrl).hostname
                      },
                      type: AzureResourceTypes.DigitalTwinInstance
                  } as IADTInstance)
                : defaultState.adtUrl
        );
        setSelectedStorageAccountInLocalStorage(
            getStorageAccountUrlFromContainerUrl(defaultState.storageUrl)
        );
        setSelectedStorageContainerInLocalStorage(
            getContainerNameFromUrl(defaultState.storageUrl),
            getStorageAccountUrlFromContainerUrl(defaultState.storageUrl)
        );
    }, []);

    return (
        <DeeplinkContext.Provider
            value={{
                deeplinkDispatch,
                deeplinkState,
                getDeeplink: getDeeplinkCallback
            }}
        >
            {children}
        </DeeplinkContext.Provider>
    );
};

const buildDeeplink = (
    currentState: IDeeplinkContextState,
    options: IDeeplinkOptions
): string => {
    if (!currentState) return '';

    // note: the order of properties here is the order of that the QSPs will be in the URL
    const deeplink: IPublicDeeplink = {
        sceneId: currentState.sceneId,
        selectedElementIds: options?.includeSelectedElement
            ? serializeArrayParam([currentState.selectedElementId])
            : undefined,
        selectedLayerIds: options?.includeSelectedLayers
            ? serializeArrayParam(currentState.selectedLayerIds)
            : undefined,
        mode: currentState.mode,
        adtUrl: currentState.adtUrl,
        adtResourceId: currentState.adtResourceId,
        storageUrl: currentState.storageUrl
    };

    // if we only want the stringified object
    let url = '';
    if (options.excludeBaseUrl) {
        url = queryString.stringify(deeplink, DEEPLINK_SERIALIZATION_OPTIONS);
    } else {
        url = queryString.stringifyUrl(
            { url: location.href, query: { ...deeplink } },
            DEEPLINK_SERIALIZATION_OPTIONS
        );
    }
    logDebugConsole('debug', `Deeplink options: `, options);
    logDebugConsole('debug', `Deeplink properties: `, deeplink);
    logDebugConsole('info', `Full deeplink: `, url);
    return url;
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
