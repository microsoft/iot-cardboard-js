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
    SET_SELECTED_ITEMS_ON_SAVE,
    SET_STORAGE_ACCOUNT_ITEMS
} from './EnvironmentPicker.types';
import {
    areResourceUrlsEqual,
    findStorageAccountFromResources,
    getContainerName,
    getResourceUrl,
    getStorageAccountId
} from './EnvironmentPickerManager';

export const defaultEnvironmentPickerState: EnvironmentPickerState = {
    environmentItems: {
        environments: [],
        selectedEnvironment: null,
        environmentToEdit: null
    },
    storageAccountItems: {
        storageAccounts: [],
        selectedStorageAccount: null,
        storageAccountToEdit: null
    },
    containerItems: {
        containers: [],
        selectedContainer: null,
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
            case SET_SELECTED_ITEMS_ON_SAVE:
                draft.environmentItems.selectedEnvironment =
                    draft.environmentItems.environmentToEdit;
                draft.storageAccountItems.selectedStorageAccount =
                    draft.storageAccountItems.storageAccountToEdit;
                draft.containerItems.selectedContainer =
                    draft.containerItems.containerToEdit;
                break;
            case RESET_ITEMS_ON_DISMISS: // restore selected items if it is removed from dropdown and reset the ...toEdit variables back to the selected items
                // reset values for environments
                if (draft.environmentItems.selectedEnvironment) {
                    const selectedEnvironmentIndex = draft.environmentItems.environments?.findIndex(
                        (e: string | IAzureResource) =>
                            getResourceUrl(
                                e,
                                AzureResourceTypes.DigitalTwinInstance
                            ) ===
                            getResourceUrl(
                                draft.environmentItems.selectedEnvironment,
                                AzureResourceTypes.DigitalTwinInstance
                            )
                    );
                    if (selectedEnvironmentIndex === -1) {
                        draft.environmentItems.environments.push(
                            draft.environmentItems.selectedEnvironment
                        );
                    }
                }
                draft.environmentItems.environmentToEdit =
                    draft.environmentItems.selectedEnvironment;

                //reset values for storage accounts
                if (draft.storageAccountItems.selectedStorageAccount) {
                    // restore selected item if it is removed from dropdown
                    const selectedStorageAccountIndex = draft.storageAccountItems.storageAccounts?.findIndex(
                        (s: string | IAzureResource) =>
                            getResourceUrl(
                                s,
                                AzureResourceTypes.StorageAccount
                            ) ===
                            getResourceUrl(
                                draft.storageAccountItems
                                    .selectedStorageAccount,
                                AzureResourceTypes.StorageAccount
                            )
                    );
                    if (selectedStorageAccountIndex === -1) {
                        draft.storageAccountItems.storageAccounts.push(
                            draft.storageAccountItems.selectedStorageAccount
                        );
                    }
                }
                draft.storageAccountItems.storageAccountToEdit =
                    draft.storageAccountItems.selectedStorageAccount;

                //reset values for containers
                if (draft.containerItems.selectedContainer) {
                    if (
                        getStorageAccountId(
                            draft.storageAccountItems.storageAccountToEdit,
                            payload.storageAccountToContainersMapping
                        ) ===
                        getStorageAccountId(
                            draft.storageAccountItems.selectedStorageAccount,
                            payload.storageAccountToContainersMapping
                        )
                    ) {
                        // restore selected item if it is removed from dropdown
                        const selectedContainerIndex = draft.containerItems.containers?.findIndex(
                            (c: string | IAzureResource) =>
                                getContainerName(c) ===
                                getContainerName(
                                    draft.containerItems.selectedContainer
                                )
                        );

                        if (selectedContainerIndex === -1) {
                            draft.containerItems.containers.push(
                                draft.containerItems.selectedContainer
                            );

                            payload.storageAccountToContainersMapping
                                ?.find((mapping) =>
                                    areResourceUrlsEqual(
                                        mapping.storageAccountUrl,
                                        getResourceUrl(
                                            draft.storageAccountItems
                                                .selectedStorageAccount,
                                            AzureResourceTypes.StorageAccount
                                        )
                                    )
                                )
                                ?.containerNames.push(
                                    getContainerName(
                                        draft.containerItems.selectedContainer
                                    )
                                );
                        }
                    } else {
                        payload.resetContainersCallback(); // to trigger fetch on mount for container picker with storage account id change
                    }
                }
                draft.containerItems.containerToEdit =
                    draft.containerItems.selectedContainer;

                break;
            case HANDLE_ENVIRONMENT_CHANGE:
                draft.environmentItems.environmentToEdit = payload.environment;
                draft.environmentItems.environments = payload.environments;
                break;
            case HANDLE_STORAGE_ACCOUNT_CHANGE:
                draft.storageAccountItems.storageAccountToEdit =
                    payload.storageAccount;
                draft.storageAccountItems.storageAccounts =
                    payload.storageAccounts;
                break;
            case HANDLE_STORAGE_ACCOUNT_LOADED: {
                // to update the state variables with actual fetched data
                const fetchedResourceToEdit = findStorageAccountFromResources(
                    draft.storageAccountItems.storageAccountToEdit,
                    payload
                );
                if (fetchedResourceToEdit) {
                    draft.storageAccountItems.storageAccountToEdit = fetchedResourceToEdit;
                }

                const fetchedSelectedResource = findStorageAccountFromResources(
                    draft.storageAccountItems.selectedStorageAccount,
                    payload
                );
                if (fetchedSelectedResource) {
                    draft.storageAccountItems.selectedStorageAccount = fetchedSelectedResource;
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
            case HANDLE_CONTAINER_CHANGE:
                draft.containerItems.containerToEdit = payload.container;
                draft.containerItems.containers = payload.containers;
                break;
            default:
                break;
        }
    },
    defaultEnvironmentPickerState
);
