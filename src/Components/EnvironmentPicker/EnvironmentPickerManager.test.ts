import { cleanup } from '@testing-library/react-hooks';
import { AzureResourceTypes } from '../../Models/Constants/Enums';
import { IAzureResource } from '../../Models/Constants/Interfaces';
import {
    areResourceUrlsEqual,
    getContainerDisplayText,
    getContainerName,
    getContainerNameFromUrl,
    getEnvironmentDisplayText,
    getResourceUrl,
    getStorageAccountUrlFromContainerUrl,
    getStorageAndContainerFromContainerUrl
} from './EnvironmentPickerManager';

afterEach(cleanup);

// START of test data
const testEnvironment: IAzureResource = {
    id:
        '/subscriptions/testSubscriptionId/resourceGroups/testResourceGroup/providers/Microsoft.DigitalTwins/digitalTwinsInstances/testADTInstance',
    name: 'testADTInstance',
    properties: {
        hostName: 'testADTInstance.api.wcus.digitaltwins.azure.net'
    },
    type: AzureResourceTypes.DigitalTwinInstance,
    subscriptionName: 'testSubscription'
};
const testEnvironmentUrl =
    'https://testADTInstance.api.wcus.digitaltwins.azure.net';

const testStorageAccount: IAzureResource = {
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
const testStorageAccountUrl =
    'https://teststorageaccount.blob.core.windows.net/';

const testContainer: IAzureResource = {
    id:
        '/subscriptions/testSubscriptionId/resourceGroups/testResourceGroup/providers/Microsoft.Storage/storageAccounts/testStorageAccountName/blobServices/default/containers/teststoragecontainer',
    name: 'teststoragecontainer',
    properties: {},
    type: AzureResourceTypes.StorageBlobContainer,
    subscriptionName: 'testSubscription'
};
const testContainerName = 'teststoragecontainer';
const testContainerUrl =
    'https://teststorageaccount.blob.core.windows.net/teststoragecontainer';
// END of test data

describe('EnvironmentPickerManager', () => {
    test('ADT instance/environment name is displayed properly', () => {
        const displayText1 = getEnvironmentDisplayText(testEnvironment);
        const displayText2 = getEnvironmentDisplayText(testEnvironmentUrl);

        expect(displayText1).toBe('testADTInstance');
        expect(displayText2).toBe('testADTInstance');
    });

    test('Storage container name is displayed properly', () => {
        const displayText1 = getContainerDisplayText(
            testContainer,
            testStorageAccount
        );
        const displayText2 = getContainerDisplayText(
            testContainerName,
            testStorageAccountUrl
        );

        expect(displayText1).toBe('teststorageaccount/teststoragecontainer');
        expect(displayText2).toBe('teststorageaccount/teststoragecontainer');
    });

    test('Getting resource url properly', () => {
        const resourceUrl1 = getResourceUrl(
            testEnvironment,
            AzureResourceTypes.DigitalTwinInstance
        );
        const resourceUrl2 = getResourceUrl(
            testEnvironmentUrl,
            AzureResourceTypes.DigitalTwinInstance
        );
        const resourceUrl3 = getResourceUrl(
            testStorageAccount,
            AzureResourceTypes.StorageAccount
        );
        const resourceUrl4 = getResourceUrl(
            testStorageAccountUrl,
            AzureResourceTypes.StorageAccount
        );
        const resourceUrl5 = getResourceUrl(
            testContainer,
            AzureResourceTypes.StorageBlobContainer,
            testStorageAccount
        );
        const resourceUrl6 = getResourceUrl(
            testContainerName,
            AzureResourceTypes.StorageBlobContainer,
            testStorageAccount
        );

        expect(resourceUrl1).toBe(
            'https://testADTInstance.api.wcus.digitaltwins.azure.net'
        );
        expect(resourceUrl2).toBe(
            'https://testADTInstance.api.wcus.digitaltwins.azure.net'
        );
        expect(resourceUrl3).toBe(
            'https://teststorageaccount.blob.core.windows.net/'
        );
        expect(resourceUrl4).toBe(
            'https://teststorageaccount.blob.core.windows.net/'
        );
        expect(resourceUrl5).toBe(
            'https://teststorageaccount.blob.core.windows.net/teststoragecontainer'
        );
        expect(resourceUrl6).toBe(
            'https://teststorageaccount.blob.core.windows.net/teststoragecontainer'
        );
    });

    test('Resource url equality check is successful', () => {
        const resourceUrl1 = getResourceUrl(
            testEnvironment,
            AzureResourceTypes.DigitalTwinInstance
        );
        const resourceUrl2 = getResourceUrl(
            testEnvironmentUrl,
            AzureResourceTypes.DigitalTwinInstance
        );

        expect(
            areResourceUrlsEqual(
                resourceUrl1,
                'https://testADTInstance.api.wcus.digitaltwins.azure.net'
            )
        ).toBeTruthy();
        expect(
            areResourceUrlsEqual(
                resourceUrl2,
                'https://testADTInstance.api.wcus.digitaltwins.azure.net/'
            )
        ).toBeTruthy();
        expect(
            areResourceUrlsEqual(
                resourceUrl2,
                'https://testADTInstance2.api.wcus.digitaltwins.azure.net/'
            )
        ).toBeFalsy();
    });

    test('Getting container name from container url successfully', () => {
        expect(getContainerNameFromUrl(testContainerUrl)).toBe(
            'teststoragecontainer'
        );
    });

    test('Getting container name from container successfully', () => {
        expect(getContainerName(testContainer)).toBe('teststoragecontainer');
    });

    test('Getting storage account url from container url successfully', () => {
        expect(getStorageAccountUrlFromContainerUrl(testContainerUrl)).toBe(
            'https://teststorageaccount.blob.core.windows.net'
        );
    });

    test('Getting storage account url and container name tuple from container url successfully', () => {
        expect(
            getStorageAndContainerFromContainerUrl(testContainerUrl)
        ).toMatchObject({
            storageAccountUrl:
                'https://teststorageaccount.blob.core.windows.net',
            containerName: 'teststoragecontainer'
        });
    });
});
