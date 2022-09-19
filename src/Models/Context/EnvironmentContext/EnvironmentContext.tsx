/**
 * This context is for keeping the track of the environment configuration state like selected adt instance, storage account, container and adx connection information.
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { AzureResourceTypes } from '../../Constants';
import {
    getEnvironmentConfigurationItemFromResource,
    getSelectedAdtInstanceFromLocalStorage,
    getSelectedStorageAccountFromLocalStorage,
    getSelectedStorageContainerFromLocalStorage,
    setSelectedAdtInstanceInLocalStorage,
    setSelectedStorageAccountInLocalStorage,
    setSelectedStorageContainerInLocalStorage
} from '../../Services/LocalStorageManager/LocalStorageManager';
import { getDebugLogger } from '../../Services/Utils';
import {
    EnvironmentContextAction,
    EnvironmentContextActionType,
    IEnvironmentContext,
    IEnvironmentContextProviderProps,
    IEnvironmentContextState
} from './EnvironmentContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('EnvironmentContext', debugLogging);

export const EnvironmentContext = React.createContext<IEnvironmentContext>(
    null
);
export const useEnvironmentContext = () => useContext(EnvironmentContext);

export const EnvironmentContextReducer: (
    draft: IEnvironmentContextState,
    action: EnvironmentContextAction
) => IEnvironmentContextState = produce(
    (draft: IEnvironmentContextState, action: EnvironmentContextAction) => {
        logDebugConsole(
            'info',
            `Updating Environmet context ${action.type} with payload: `,
            action.payload
        );
        switch (action.type) {
            case EnvironmentContextActionType.SET_ADT_INSTANCE: {
                draft.adtInstance = getEnvironmentConfigurationItemFromResource(
                    action.payload.adtInstance,
                    AzureResourceTypes.DigitalTwinInstance
                );
                setSelectedAdtInstanceInLocalStorage(
                    action.payload.adtInstance
                ); // set the selected values in local storage here again in case it is updated by changes in deep link parsed value
                break;
            }
            case EnvironmentContextActionType.SET_STORAGE_ACCOUNT: {
                draft.storageAccount = getEnvironmentConfigurationItemFromResource(
                    action.payload.account,
                    AzureResourceTypes.StorageAccount
                );
                setSelectedStorageAccountInLocalStorage(action.payload.account); // set the selected values in local storage here again in case it is updated by changes in deep link parsed value
                break;
            }
            case EnvironmentContextActionType.SET_STORAGE_CONTAINER: {
                draft.storageContainer = getEnvironmentConfigurationItemFromResource(
                    action.payload.container,
                    AzureResourceTypes.StorageBlobContainer,
                    action.payload.storageAccount
                );
                setSelectedStorageContainerInLocalStorage(
                    action.payload.container,
                    action.payload.storageAccount
                ); // set the selected values in local storage here again in case it is updated by changes in deep link parsed value
                break;
            }
        }
    }
);

export const EnvironmentContextProvider: React.FC<IEnvironmentContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useEnvironmentContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { initialState = {} } = props;

    // TODO: fix this, context is being recreated
    // // update localstorage only when there is initial state
    // if (initialState.adtInstance) {
    //     setSelectedAdtInstanceInLocalStorage(initialState.adtInstance.url);
    // }
    // if (initialState.storageAccount) {
    //     setSelectedStorageAccountInLocalStorage(
    //         initialState.storageAccount.url
    //     );
    //     if (initialState.storageContainer) {
    //         setSelectedStorageContainerInLocalStorage(
    //             initialState.storageContainer.name,
    //             initialState.storageAccount.url
    //         );
    //     }
    // }

    // set the initial state for the Environment context reducer
    const defaultState: IEnvironmentContextState = {
        adtInstance:
            initialState.adtInstance ||
            getSelectedAdtInstanceFromLocalStorage() ||
            null,
        storageContainer:
            initialState.storageContainer ||
            getSelectedStorageContainerFromLocalStorage() ||
            null,
        storageAccount:
            initialState.storageAccount ||
            getSelectedStorageAccountFromLocalStorage() ||
            null
    };

    const [environmentState, environmentDispatch] = useReducer(
        EnvironmentContextReducer,
        defaultState
    );

    return (
        <EnvironmentContext.Provider
            value={{
                environmentDispatch,
                environmentState
            }}
        >
            {children}
        </EnvironmentContext.Provider>
    );
};
