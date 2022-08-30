import produce from 'immer';
import { AzureResourceTypes } from '../..';
import { AzureResourceDisplayFields } from '../../Models/Constants';
import { IAzureResource } from '../../Models/Constants/Interfaces';
import { areResourceValuesEqual } from '../../Models/Services/Utils';
import {
    EnvironmentPickerAction,
    EnvironmentPickerActionType,
    EnvironmentPickerState
} from './EnvironmentPicker.types';
import {
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
            case EnvironmentPickerActionType.MARK_DIALOG_AS_SHOWN:
                draft.firstTimeVisible = true;
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
                            areResourceValuesEqual(
                                getResourceUrl(
                                    e,
                                    AzureResourceTypes.DigitalTwinInstance
                                ),
                                getResourceUrl(
                                    selectedEnvironmentUrl,
                                    AzureResourceTypes.DigitalTwinInstance
                                ),
                                AzureResourceDisplayFields.url
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
                            areResourceValuesEqual(
                                getResourceUrl(
                                    s,
                                    AzureResourceTypes.StorageAccount
                                ),
                                selectedStorageAccountUrl,
                                AzureResourceDisplayFields.url
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
                    if (selectedContainerName) {
                        if (
                            areResourceValuesEqual(
                                getResourceUrl(
                                    draft.storageAccountItems
                                        .storageAccountToEdit,
                                    AzureResourceTypes.StorageAccount
                                ),
                                selectedStorageAccountUrl,
                                AzureResourceDisplayFields.url
                            )
                        ) {
                            const selectedContainer = draft.containerItems.containers?.find(
                                (c: string | IAzureResource) =>
                                    getContainerName(c) ===
                                    selectedContainerName
                            );

                            if (!selectedContainer) {
                                // restore selected container if it is removed from dropdown
                                draft.containerItems.containers.push(
                                    selectedContainerName
                                );

                                storageAccountToContainersMappings
                                    ?.find((mapping) =>
                                        areResourceValuesEqual(
                                            mapping.storageAccountUrl,
                                            selectedStorageAccountUrl,
                                            AzureResourceDisplayFields.url
                                        )
                                    )
                                    ?.containerNames.push(
                                        selectedContainerName
                                    );
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
                        draft.containerItems.containers = [];
                        draft.containerItems.containerToEdit = null;
                        resetContainersCallback(); // to trigger fetch on mount for container picker with storage account change
                    }
                } else {
                    draft.storageAccountItems.storageAccountToEdit = null;
                    draft.containerItems.containers = [];
                    draft.containerItems.containerToEdit = null;
                }
                break;
            }
            case EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_LOADED: {
                const fetchedStorageAccountResources = action.payload.resources;
                // to update the state variables with actual fetched data to use its id to fetch containers
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
            default:
                break;
        }
    },
    defaultEnvironmentPickerState
);
