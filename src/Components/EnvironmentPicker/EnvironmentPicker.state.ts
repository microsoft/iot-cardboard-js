import produce from 'immer';
import { AzureResourceTypes } from '../..';
import { IAzureResource } from '../../Models/Constants/Interfaces';
import {
    EnvironmentPickerAction,
    EnvironmentPickerActionType,
    EnvironmentPickerState
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
    action: EnvironmentPickerAction
) => EnvironmentPickerState = produce(
    (draft: EnvironmentPickerState, action: EnvironmentPickerAction) => {
        switch (action.type) {
            case EnvironmentPickerActionType.SET_ENVIRONMENT_ITEMS:
                draft.environmentItems = action.payload.environmentItems;
                break;
            case EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_ITEMS:
                draft.storageAccountItems = action.payload.storageAccountItems;
                break;
            case EnvironmentPickerActionType.SET_CONTAINER_ITEMS:
                draft.containerItems = action.payload.containerItems;
                break;
            case EnvironmentPickerActionType.SET_FIRST_TIME_VISIBLE:
                draft.firstTimeVisible = action.payload;
                break;
            case EnvironmentPickerActionType.RESET_ITEMS_ON_DISMISS: {
                const {
                    selectedEnvironmentUrl,
                    selectedContainerUrl,
                    storageAccountToContainersMappings,
                    resetContainersCallback
                } = action.payload;
                // restore selected items if it is removed from dropdown and reset the ...toEdit variables back to the selected items
                // reset values for environments
                if (selectedEnvironmentUrl) {
                    const selectedEnvironment = draft.environmentItems.environments?.find(
                        (e: string | IAzureResource) =>
                            areResourceUrlsEqual(
                                getResourceUrl(
                                    e,
                                    AzureResourceTypes.DigitalTwinInstance
                                ),
                                getResourceUrl(
                                    selectedEnvironmentUrl,
                                    AzureResourceTypes.DigitalTwinInstance
                                )
                            )
                    );
                    if (!selectedEnvironment) {
                        draft.environmentItems.environments.push(
                            selectedEnvironmentUrl
                        );
                    }
                    draft.environmentItems.environmentToEdit = selectedEnvironment;
                } else {
                    draft.environmentItems.environmentToEdit = null;
                }

                if (selectedContainerUrl) {
                    //reset values for storage accounts
                    const selectedStorageAccountUrl = getStorageAccountUrlFromContainerUrl(
                        selectedContainerUrl
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
                        selectedContainerUrl
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

                            storageAccountToContainersMappings
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
                        resetContainersCallback(); // to trigger fetch on mount for container picker with storage account change
                    }
                } else {
                    draft.storageAccountItems.storageAccountToEdit = null;
                    draft.containerItems.containers = [];
                    draft.containerItems.containerToEdit = null;
                }
                break;
            }
            case EnvironmentPickerActionType.HANDLE_ENVIRONMENT_CHANGE: {
                const {
                    environmentToEdit,
                    environments
                } = action.payload.environmentItems;
                draft.environmentItems.environmentToEdit = environmentToEdit;
                draft.environmentItems.environments = environments;
                break;
            }
            case EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_CHANGE: {
                const {
                    storageAccountToEdit,
                    storageAccounts
                } = action.payload.storageAccountItems;
                draft.storageAccountItems.storageAccountToEdit = storageAccountToEdit;
                draft.storageAccountItems.storageAccounts = storageAccounts;
                break;
            }
            case EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_LOADED: {
                const fetchedStorageAccountResources = action.payload.resources;
                // to update the state variables with actual fetched data
                const fetchedResourceToEdit = findStorageAccountFromResources(
                    draft.storageAccountItems.storageAccountToEdit,
                    fetchedStorageAccountResources
                );
                if (fetchedResourceToEdit) {
                    draft.storageAccountItems.storageAccountToEdit = fetchedResourceToEdit;
                }

                draft.storageAccountItems.storageAccounts.forEach(
                    (currentResource, idx) => {
                        const fetchedResource = findStorageAccountFromResources(
                            currentResource,
                            fetchedStorageAccountResources
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
            case EnvironmentPickerActionType.HANDLE_CONTAINER_CHANGE: {
                const {
                    containerToEdit,
                    containers
                } = action.payload.containerItems;
                draft.containerItems.containerToEdit = containerToEdit;
                draft.containerItems.containers = containers;
                break;
            }
            default:
                break;
        }
    },
    defaultEnvironmentPickerState
);
