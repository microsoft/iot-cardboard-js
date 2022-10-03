import { AzureResourceTypes } from '../../Models/Constants/Enums';
import {
    IADTInstance,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Models/Constants/Interfaces';
import { EnvironmentPickerState } from './EnvironmentPicker.types';

export const MOCK_ADT_INSTANCE: IADTInstance = {
    id:
        '/subscriptions/testSubscriptionId/resourceGroups/testResourceGroup/providers/Microsoft.DigitalTwins/digitalTwinsInstances/testADTInstance',
    name: 'testADTInstance',
    properties: {
        hostName: 'testADTInstance.api.wcus.digitaltwins.azure.net'
    },
    type: AzureResourceTypes.DigitalTwinInstance,
    subscriptionName: 'testSubscription'
};
export const MOCK_ADT_INSTANCE2: IADTInstance = {
    id:
        '/subscriptions/testSubscriptionId/resourceGroups/testResourceGroup/providers/Microsoft.DigitalTwins/digitalTwinsInstances/testADTInstance2',
    name: 'testADTInstance2',
    properties: {
        hostName: 'testADTInstance2.api.wcus.digitaltwins.azure.net'
    },
    type: AzureResourceTypes.DigitalTwinInstance,
    subscriptionName: 'testSubscription'
};
export const MOCK_ADT_INSTANCE_URL =
    'https://testADTInstance.api.wcus.digitaltwins.azure.net';

export const MOCK_STORAGE_ACCOUNT: IAzureStorageAccount = {
    id:
        '/subscriptions/testSubscriptionId/resourceGroups/testResourceGroup/providers/Microsoft.Storage/storageAccounts/teststorageaccount',
    name: 'teststorageaccount',
    properties: {
        primaryEndpoints: {
            blob: 'https://teststorageaccount.blob.core.windows.net/'
        }
    },
    type: AzureResourceTypes.StorageAccount
};
export const MOCK_STORAGE_ACCOUNT2: IAzureStorageAccount = {
    id:
        '/subscriptions/testSubscriptionId/resourceGroups/testResourceGroup/providers/Microsoft.Storage/storageAccounts/teststorageaccount2',
    name: 'teststorageaccount2',
    properties: {
        primaryEndpoints: {
            blob: 'https://teststorageaccount2.blob.core.windows.net/'
        }
    },
    type: AzureResourceTypes.StorageAccount
};
export const MOCK_STORAGE_ACCOUNT_URL =
    'https://teststorageaccount.blob.core.windows.net/';
export const MOCK_STORAGE_ACCOUNT_URL2 =
    'https://teststorageaccount2.blob.core.windows.net/';

export const MOCK_STORAGE_CONTAINER: IAzureStorageBlobContainer = {
    id:
        '/subscriptions/testSubscriptionId/resourceGroups/testResourceGroup/providers/Microsoft.Storage/storageAccounts/teststorageaccount/blobServices/default/containers/teststoragecontainer',
    name: 'teststoragecontainer',
    properties: {},
    type: AzureResourceTypes.StorageBlobContainer,
    subscriptionName: 'testSubscription'
};
export const MOCK_STORAGE_CONTAINER2: IAzureStorageBlobContainer = {
    id:
        '/subscriptions/testSubscriptionId/resourceGroups/testResourceGroup/providers/Microsoft.Storage/storageAccounts/teststorageaccount2/blobServices/default/containers/teststoragecontainer2',
    name: 'teststoragecontainer2',
    properties: {},
    type: AzureResourceTypes.StorageBlobContainer,
    subscriptionName: 'testSubscription'
};
export const MOCK_STORAGE_CONTAINER_NAME = 'teststoragecontainer';
export const MOCK_STORAGE_CONTAINER_NAME2 = 'teststoragecontainer2';
export const MOCK_STORAGE_CONTAINER_URL =
    'https://teststorageaccount.blob.core.windows.net/teststoragecontainer';
export const MOCK_STORAGE_CONTAINER_URL2 =
    'https://teststorageaccount2.blob.core.windows.net/teststoragecontainer2';

export const MOCK_ENVIRONMENT_STATE: EnvironmentPickerState = {
    adtInstanceInfo: {
        adtInstances: [MOCK_ADT_INSTANCE],
        adtInstanceToEdit: MOCK_ADT_INSTANCE
    },
    storageAccountInfo: {
        storageAccounts: [MOCK_STORAGE_ACCOUNT],
        storageAccountToEdit: MOCK_STORAGE_ACCOUNT
    },
    containerInfo: {
        containers: [MOCK_STORAGE_CONTAINER],
        containerToEdit: MOCK_STORAGE_CONTAINER
    },
    firstTimeVisible: false
};
