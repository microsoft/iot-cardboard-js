import produce from 'immer';
import { AzureResourceTypes } from '../..';
import { IAction, IAzureResource } from '../../Models/Constants/Interfaces';
import {
    EnvironmentPickerState,
    HANDLE_CONTAINER_CHANGE,
    HANDLE_ENVIRONMENT_CHANGE,
    HANDLE_STORAGE_ACCOUNT_CHANGE,
    HANDLE_STORAGE_ACCOUNT_LOADED,
    RESET_ITEMS_ON_DISMISS,
    SET_CONTAINER_ITEMS,
    SET_ENVIRONMENT_ITEMS,
    SET_FIRST_TIME_VISIBLE,
    SET_STORAGE_ACCOUNT_ITEMS
} from './EnvironmentPicker.types';
import {
    areResourceUrlsEqual,
    findStorageAccountFromResources,
    getContainerName,
    getContainerNameFromUrl,
    getResourceUrl,
    getStorageAccountUrlFromContainerUrl
} from './EnvironmentPickerManager';

export const defaultEnvironmentPickerState: EnvironmentPickerState = {
    environmentItems: {
        environments: [],
        environmentToEdit: null
    },
    storageAccountItems: {
        storageAccounts: [],
        storageAccountToEdit: null
    },
    containerItems: {
        containers: [],
        containerToEdit: null
    },
    firstTimeVisible: false
};

export const EnvironmentPickerReducer: (
    draft: EnvironmentPickerState,
    action: IAction
) => EnvironmentPickerState = produce(
    (draft: EnvironmentPickerState, action: IAction) => {
        const payload = action.payload;
        switch (action.type) {
            case SET_ENVIRONMENT_ITEMS:
                draft.environmentItems = payload;
                break;
            case SET_STORAGE_ACCOUNT_ITEMS:
                draft.storageAccountItems = payload;
                break;
            case SET_CONTAINER_ITEMS:
                draft.containerItems = payload;
                break;
            case SET_FIRST_TIME_VISIBLE:
                draft.firstTimeVisible = payload;
                break;
            case RESET_ITEMS_ON_DISMISS: {
                // restore selected items if it is removed from dropdown and reset the ...toEdit variables back to the selected items
                // reset values for environments
                if (payload.selectedEnvironmentUrl) {
                    const selectedEnvironment = draft.environmentItems.environments?.find(
                        (e: string | IAzureResource) =>
                            areResourceUrlsEqual(
                                getResourceUrl(
                                    e,
                                    AzureResourceTypes.DigitalTwinInstance
                                ),
                                getResourceUrl(
                                    payload.selectedEnvironmentUrl,
                                    AzureResourceTypes.DigitalTwinInstance
                                )
                            )
                    );
                    if (!selectedEnvironment) {
                        draft.environmentItems.environments.push(
                            payload.selectedEnvironmentUrl
                        );
                    }
                    draft.environmentItems.environmentToEdit = selectedEnvironment;
                } else {
                    draft.environmentItems.environmentToEdit = null;
                }

                if (payload.selectedContainerUrl) {
                    //reset values for storage accounts
                    const selectedStorageAccountUrl = getStorageAccountUrlFromContainerUrl(
                        payload.selectedContainerUrl
                    );
                    const selectedStorageAccount = draft.storageAccountItems.storageAccounts?.find(
                        (s: string | IAzureResource) =>
                            areResourceUrlsEqual(
                                getResourceUrl(
                                    s,
                                    AzureResourceTypes.StorageAccount
                                ),
                                selectedStorageAccountUrl
                            )
                    );
                    if (!selectedStorageAccount) {
                        // restore selected storage account if it is removed from dropdown
                        draft.storageAccountItems.storageAccounts.push(
                            selectedStorageAccountUrl
                        );
                    }
                    draft.storageAccountItems.storageAccountToEdit = selectedStorageAccount;

                    //reset values for containers
                    const selectedContainerName = getContainerNameFromUrl(
                        payload.selectedContainerUrl
                    );
                    if (
                        areResourceUrlsEqual(
                            getResourceUrl(
                                draft.storageAccountItems.storageAccountToEdit,
                                AzureResourceTypes.StorageAccount
                            ),
                            selectedStorageAccountUrl
                        )
                    ) {
                        const selectedContainer = draft.containerItems.containers?.find(
                            (c: string | IAzureResource) =>
                                getContainerName(c) === selectedContainerName
                        );

                        if (!selectedContainer) {
                            // restore selected container if it is removed from dropdown
                            draft.containerItems.containers.push(
                                selectedContainerName
                            );

                            payload.storageAccountToContainersMapping
                                ?.find((mapping) =>
                                    areResourceUrlsEqual(
                                        mapping.storageAccountUrl,
                                        selectedStorageAccountUrl
                                    )
                                )
                                ?.containerNames.push(selectedContainerName);
                        }
                        draft.containerItems.containerToEdit = selectedContainer
                            ? selectedContainer
                            : selectedContainerName;
                    } else {
                        draft.containerItems.containers = [
                            selectedContainerName
                        ];
                        draft.containerItems.containerToEdit = selectedContainerName;
                        payload.resetContainersCallback(); // to trigger fetch on mount for container picker with storage account change
                    }
                } else {
                    draft.storageAccountItems.storageAccountToEdit = null;
                    draft.containerItems.containers = [];
                    draft.containerItems.containerToEdit = null;
                }
                break;
            }
            case HANDLE_ENVIRONMENT_CHANGE: {
                draft.environmentItems.environmentToEdit = payload.environment;
                draft.environmentItems.environments = payload.environments;
                break;
            }
            case HANDLE_STORAGE_ACCOUNT_CHANGE: {
                draft.storageAccountItems.storageAccountToEdit =
                    payload.storageAccount;
                draft.storageAccountItems.storageAccounts =
                    payload.storageAccounts;
                break;
            }
            case HANDLE_STORAGE_ACCOUNT_LOADED: {
                // to update the state variables with actual fetched data
                const fetchedResourceToEdit = findStorageAccountFromResources(
                    draft.storageAccountItems.storageAccountToEdit,
                    payload
                );
                if (fetchedResourceToEdit) {
                    draft.storageAccountItems.storageAccountToEdit = fetchedResourceToEdit;
                }

                draft.storageAccountItems.storageAccounts.forEach(
                    (currentResource, idx) => {
                        const fetchedResource = findStorageAccountFromResources(
                            currentResource,
                            payload
                        );
                        if (fetchedResource) {
                            draft.storageAccountItems.storageAccounts[
                                idx
                            ] = fetchedResource;
                        }
                    }
                );
                break;
            }
            case HANDLE_CONTAINER_CHANGE: {
                draft.containerItems.containerToEdit = payload.container;
                draft.containerItems.containers = payload.containers;
                break;
            }
            default:
                break;
        }
    },
    defaultEnvironmentPickerState
);
