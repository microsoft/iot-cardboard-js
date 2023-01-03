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
            initialState.adtInstanceInfo = {
                adtInstances: [],
                adtInstanceToEdit: ''
            }; // no items

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.SET_ADT_INSTANCE_INFO,
                payload: {
                    adtInstanceInfo: {
                        adtInstances: [MOCK_ADT_INSTANCE],
                        adtInstanceToEdit: MOCK_ADT_INSTANCE
                    }
                }
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.adtInstanceInfo.adtInstances.length).toEqual(1);
            expect(result.adtInstanceInfo.adtInstanceToEdit).toMatchObject(
                MOCK_ADT_INSTANCE
            );
        });

        test('[SET_STORAGE_ACCOUNT_INFO] - setting the storage account related items in the state', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.storageAccountInfo = {
                storageAccounts: [],
                storageAccountToEdit: ''
            }; // no items

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_INFO,
                payload: {
                    storageAccountInfo: {
                        storageAccounts: [MOCK_STORAGE_ACCOUNT],
                        storageAccountToEdit: MOCK_STORAGE_ACCOUNT
                    }
                }
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.storageAccountInfo.storageAccounts.length).toEqual(1);
            expect(
                result.storageAccountInfo.storageAccountToEdit
            ).toMatchObject(MOCK_STORAGE_ACCOUNT);
        });

        test('[SET_CONTAINER_INFO] - setting the storage container related items in the state', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.containerInfo = {
                containers: [],
                containerToEdit: ''
            }; // no items

            const action: EnvironmentPickerAction = {
                type: EnvironmentPickerActionType.SET_CONTAINER_INFO,
                payload: {
                    containerInfo: {
                        containers: [MOCK_STORAGE_CONTAINER],
                        containerToEdit: MOCK_STORAGE_CONTAINER
                    }
                }
            };

            // ACT
            const result = EnvironmentPickerReducer(initialState, action);

            // ASSERT
            expect(result.containerInfo.containers.length).toEqual(1);
            expect(result.containerInfo.containerToEdit).toMatchObject(
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
            initialState.adtInstanceInfo = {
                adtInstances: [MOCK_ADT_INSTANCE, MOCK_ADT_INSTANCE2],
                adtInstanceToEdit: MOCK_ADT_INSTANCE2
            };
            initialState.storageAccountInfo = {
                storageAccounts: [MOCK_STORAGE_ACCOUNT, MOCK_STORAGE_ACCOUNT2],
                storageAccountToEdit: MOCK_STORAGE_ACCOUNT2
            };
            initialState.containerInfo = {
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
            expect(result.adtInstanceInfo.adtInstanceToEdit).toMatchObject(
                MOCK_ADT_INSTANCE
            );
            expect(
                result.storageAccountInfo.storageAccountToEdit
            ).toMatchObject(MOCK_STORAGE_ACCOUNT);
            expect(result.containerInfo.containerToEdit).toEqual(
                MOCK_STORAGE_CONTAINER.name
            );
        });

        test('[HANDLE_STORAGE_ACCOUNT_LOADED] - updating the storage account items in the state with the fetched data in case they are just url strings', () => {
            // ARRANGE
            const initialState = MOCK_ENVIRONMENT_STATE;
            initialState.storageAccountInfo = {
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
            expect(result.storageAccountInfo.storageAccounts[0]).toMatchObject(
                MOCK_STORAGE_ACCOUNT
            );
            expect(result.storageAccountInfo.storageAccounts[1]).toMatchObject(
                MOCK_STORAGE_ACCOUNT2
            );
            expect(
                result.storageAccountInfo.storageAccountToEdit
            ).toMatchObject(MOCK_STORAGE_ACCOUNT);
        });
    });
});
