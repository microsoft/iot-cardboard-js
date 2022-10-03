import produce from 'immer';
import { AzureResourceTypes } from '../..';
import {
    AzureResourceDisplayFields,
    IADTInstance,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Models/Constants';
import {
    areResourceValuesEqual,
    getContainerNameFromUrl,
    getNameOfResource,
    getResourceUrl
} from '../../Models/Services/Utils';
import {
    EnvironmentPickerAction,
    EnvironmentPickerActionType,
    EnvironmentPickerState
} from './EnvironmentPicker.types';
import {
    findStorageAccountFromResources,
    getStorageAccountUrlFromContainerUrl
} from './EnvironmentPickerManager';

export const defaultEnvironmentPickerState: EnvironmentPickerState = {
    adtInstanceInfo: {
        adtInstances: [],
        adtInstanceToEdit: null
    },
    storageAccountInfo: {
        storageAccounts: [],
        storageAccountToEdit: null
    },
    containerInfo: {
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
            case EnvironmentPickerActionType.SET_ADT_INSTANCE_INFO:
                draft.adtInstanceInfo = action.payload.adtInstanceInfo;
                break;
            case EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_INFO:
                draft.storageAccountInfo = action.payload.storageAccountInfo;
                break;
            case EnvironmentPickerActionType.SET_CONTAINER_INFO:
                draft.containerInfo = action.payload.containerInfo;
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
                    const selectedEnvironment = draft.adtInstanceInfo.adtInstances?.find(
                        (e: string | IADTInstance) =>
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
                        draft.adtInstanceInfo.adtInstances.push(
                            selectedEnvironmentUrl
                        );
                    }
                    draft.adtInstanceInfo.adtInstanceToEdit = selectedEnvironment;
                } else {
                    draft.adtInstanceInfo.adtInstanceToEdit = null;
                }

                if (selectedContainerUrl) {
                    //reset values for storage accounts
                    const selectedStorageAccountUrl = getStorageAccountUrlFromContainerUrl(
                        selectedContainerUrl
                    );
                    const selectedStorageAccount = draft.storageAccountInfo.storageAccounts?.find(
                        (s: string | IAzureStorageAccount) =>
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
                        draft.storageAccountInfo.storageAccounts.push(
                            selectedStorageAccountUrl
                        );
                    }
                    draft.storageAccountInfo.storageAccountToEdit = selectedStorageAccount;

                    //reset values for containers
                    const selectedContainerName = getContainerNameFromUrl(
                        selectedContainerUrl
                    );
                    if (selectedContainerName) {
                        if (
                            areResourceValuesEqual(
                                getResourceUrl(
                                    draft.storageAccountInfo
                                        .storageAccountToEdit,
                                    AzureResourceTypes.StorageAccount
                                ),
                                selectedStorageAccountUrl,
                                AzureResourceDisplayFields.url
                            )
                        ) {
                            const selectedContainer = draft.containerInfo.containers?.find(
                                (c: string | IAzureStorageBlobContainer) =>
                                    getNameOfResource(
                                        c,
                                        AzureResourceTypes.StorageBlobContainer
                                    ) === selectedContainerName
                            );

                            if (!selectedContainer) {
                                // restore selected container if it is removed from dropdown
                                draft.containerInfo.containers.push(
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
                            draft.containerInfo.containerToEdit = selectedContainer
                                ? selectedContainer
                                : selectedContainerName;
                        } else {
                            draft.containerInfo.containers = [
                                selectedContainerName
                            ];
                            draft.containerInfo.containerToEdit = selectedContainerName;
                            resetContainersCallback(); // to trigger fetch on mount for container picker with storage account change
                        }
                    } else {
                        draft.containerInfo.containers = [];
                        draft.containerInfo.containerToEdit = null;
                        resetContainersCallback(); // to trigger fetch on mount for container picker with storage account change
                    }
                } else {
                    draft.storageAccountInfo.storageAccountToEdit = null;
                    draft.containerInfo.containers = [];
                    draft.containerInfo.containerToEdit = null;
                }
                break;
            }
            case EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_LOADED: {
                const fetchedStorageAccountResources = action.payload.resources;
                // to update the state variables with actual fetched data to use its id to fetch containers
                const fetchedResourceToEdit = findStorageAccountFromResources(
                    draft.storageAccountInfo.storageAccountToEdit,
                    fetchedStorageAccountResources
                );
                if (fetchedResourceToEdit) {
                    draft.storageAccountInfo.storageAccountToEdit = fetchedResourceToEdit;
                }

                draft.storageAccountInfo.storageAccounts.forEach(
                    (currentResource, idx) => {
                        const fetchedResource = findStorageAccountFromResources(
                            currentResource,
                            fetchedStorageAccountResources
                        );
                        if (fetchedResource) {
                            draft.storageAccountInfo.storageAccounts[
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
