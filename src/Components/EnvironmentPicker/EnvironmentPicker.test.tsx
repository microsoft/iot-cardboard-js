import { cleanup } from '@testing-library/react';
import { EnvironmentPickerReducer } from './EnvironmentPicker.state';
import {
    EnvironmentPickerAction,
    EnvironmentPickerActionType
} from './EnvironmentPicker.types';
import {
    MOCK_ENVIRONMENT_STATE,
    MOCK_STORAGE_ACCOUNT,
    MOCK_STORAGE_ACCOUNT_URL,
    MOCK_STORAGE_CONTAINER,
    MOCK_STORAGE_CONTAINER_NAME,
    MOCK_STORAGE_ACCOUNT2,
    MOCK_STORAGE_CONTAINER2,
    MOCK_STORAGE_CONTAINER_URL,
    MOCK_STORAGE_ACCOUNT_URL2,
    MOCK_STORAGE_CONTAINER_NAME2,
    MOCK_ADT_INSTANCE,
    MOCK_ADT_INSTANCE2,
    MOCK_ADT_INSTANCE_URL
} from './EnvironmentPicker.mock';

describe('EnvironmentPicker', () => {
    afterEach(cleanup);
    describe('Actions', () => {
        test('[SET_ENVIRONMENT_ITEMS] - setting the environment related items in the state', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.adtInstanceItems = {
                adtInstances: [],
                adtInstanceToEdit: ''
            }; // no items

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.SET_ADT_INSTANCE_ITEMS,
                payload: {
                    adtInstanceItems: {
                        adtInstances: [MOCK_ADT_INSTANCE],
                        adtInstanceToEdit: MOCK_ADT_INSTANCE
                    }
                }
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.adtInstanceItems.adtInstances.length).toEqual(1);
            expect(result.adtInstanceItems.adtInstanceToEdit).toMatchObject(
                MOCK_ADT_INSTANCE
            );
        });

        test('[SET_STORAGE_ACCOUNT_ITEMS] - setting the storage account related items in the state', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.storageAccountItems = {
                storageAccounts: [],
                storageAccountToEdit: ''
            }; // no items

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_ITEMS,
                payload: {
                    storageAccountItems: {
                        storageAccounts: [MOCK_STORAGE_ACCOUNT],
                        storageAccountToEdit: MOCK_STORAGE_ACCOUNT
                    }
                }
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.storageAccountItems.storageAccounts.length).toEqual(
                1
            );
            expect(
                result.storageAccountItems.storageAccountToEdit
            ).toMatchObject(MOCK_STORAGE_ACCOUNT);
        });

        test('[SET_CONTAINER_ITEMS] - setting the storage container related items in the state', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.containerItems = {
                containers: [],
                containerToEdit: ''
            }; // no items

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.SET_CONTAINER_ITEMS,
                payload: {
                    containerItems: {
                        containers: [MOCK_STORAGE_CONTAINER],
                        containerToEdit: MOCK_STORAGE_CONTAINER
                    }
                }
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.containerItems.containers.length).toEqual(1);
            expect(result.containerItems.containerToEdit).toMatchObject(
                MOCK_STORAGE_CONTAINER
            );
        });

        test('[MARK_DIALOG_AS_SHOWN] - setting the first time visibility of dialog in the state', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.firstTimeVisible = false;

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.MARK_DIALOG_AS_SHOWN
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.firstTimeVisible).toBeTruthy();
        });

        test('[RESET_ITEMS_ON_DISMISS] - resetting all the items of the state back to selected values after dismissing the modal', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.adtInstanceItems = {
                adtInstances: [MOCK_ADT_INSTANCE, MOCK_ADT_INSTANCE2],
                adtInstanceToEdit: MOCK_ADT_INSTANCE2
            };
            initialState.storageAccountItems = {
                storageAccounts: [MOCK_STORAGE_ACCOUNT, MOCK_STORAGE_ACCOUNT2],
                storageAccountToEdit: MOCK_STORAGE_ACCOUNT2
            };
            initialState.containerItems = {
                containers: [MOCK_STORAGE_CONTAINER, MOCK_STORAGE_CONTAINER2],
                containerToEdit: MOCK_STORAGE_CONTAINER2
            };

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.RESET_ITEMS_ON_DISMISS,
                payload: {
                    selectedEnvironmentUrl: MOCK_ADT_INSTANCE_URL,
                    selectedContainerUrl: MOCK_STORAGE_CONTAINER_URL,
                    storageAccountToContainersMappings: [
                        {
                            storageAccountId: MOCK_STORAGE_ACCOUNT.id,
                            storageAccountUrl: MOCK_STORAGE_ACCOUNT_URL,
                            containerNames: [MOCK_STORAGE_CONTAINER_NAME]
                        },
                        {
                            storageAccountId: MOCK_STORAGE_ACCOUNT2.id,
                            storageAccountUrl: MOCK_STORAGE_ACCOUNT_URL2,
                            containerNames: [MOCK_STORAGE_CONTAINER_NAME2]
                        }
                    ],
                    resetContainersCallback: () => {
                        console.log('calling reset containers callback...');
                    }
                }
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.adtInstanceItems.adtInstanceToEdit).toMatchObject(
                MOCK_ADT_INSTANCE
            );
            expect(
                result.storageAccountItems.storageAccountToEdit
            ).toMatchObject(MOCK_STORAGE_ACCOUNT);
            expect(result.containerItems.containerToEdit).toMatchObject(
                MOCK_STORAGE_CONTAINER
            );
        });

        test('[HANDLE_STORAGE_ACCOUNT_LOADED] - updating the storage account items in the state with the fetched data in case they are just url strings', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.storageAccountItems = {
                storageAccounts: [
                    MOCK_STORAGE_ACCOUNT_URL,
                    MOCK_STORAGE_ACCOUNT_URL2
                ],
                storageAccountToEdit: MOCK_STORAGE_ACCOUNT_URL
            };

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_LOADED,
                payload: {
                    resources: [MOCK_STORAGE_ACCOUNT, MOCK_STORAGE_ACCOUNT2]
                }
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.storageAccountItems.storageAccounts[0]).toMatchObject(
                MOCK_STORAGE_ACCOUNT
            );
            expect(result.storageAccountItems.storageAccounts[1]).toMatchObject(
                MOCK_STORAGE_ACCOUNT2
            );
            expect(
                result.storageAccountItems.storageAccountToEdit
            ).toMatchObject(MOCK_STORAGE_ACCOUNT);
        });
    });
});
