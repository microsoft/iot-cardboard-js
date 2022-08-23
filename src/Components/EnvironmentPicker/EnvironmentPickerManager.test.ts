import { cleanup } from '@testing-library/react-hooks';
import { AzureResourceTypes } from '../../Models/Constants/Enums';
import {
    MOCK_ENVIRONMENT,
    MOCK_ENVIRONMENT_URL,
    MOCK_STORAGE_ACCOUNT,
    MOCK_STORAGE_ACCOUNT_URL,
    MOCK_STORAGE_CONTAINER,
    MOCK_STORAGE_CONTAINER_NAME,
    MOCK_STORAGE_CONTAINER_URL
} from './EnvironmentPicker.mock';
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

describe('EnvironmentPickerManager', () => {
    test('ADT instance/environment name is displayed properly', () => {
        const displayText1 = getEnvironmentDisplayText(MOCK_ENVIRONMENT);
        const displayText2 = getEnvironmentDisplayText(MOCK_ENVIRONMENT_URL);

        expect(displayText1).toBe('testADTInstance');
        expect(displayText2).toBe('testADTInstance');
    });

    test('Storage container name is displayed properly', () => {
        const displayText1 = getContainerDisplayText(
            MOCK_STORAGE_CONTAINER,
            MOCK_STORAGE_ACCOUNT
        );
        const displayText2 = getContainerDisplayText(
            MOCK_STORAGE_CONTAINER_NAME,
            MOCK_STORAGE_ACCOUNT_URL
        );

        expect(displayText1).toBe('teststorageaccount/teststoragecontainer');
        expect(displayText2).toBe('teststorageaccount/teststoragecontainer');
    });

    test('Getting resource url properly', () => {
        const resourceUrl1 = getResourceUrl(
            MOCK_ENVIRONMENT,
            AzureResourceTypes.DigitalTwinInstance
        );
        const resourceUrl2 = getResourceUrl(
            MOCK_ENVIRONMENT_URL,
            AzureResourceTypes.DigitalTwinInstance
        );
        const resourceUrl3 = getResourceUrl(
            MOCK_STORAGE_ACCOUNT,
            AzureResourceTypes.StorageAccount
        );
        const resourceUrl4 = getResourceUrl(
            MOCK_STORAGE_ACCOUNT_URL,
            AzureResourceTypes.StorageAccount
        );
        const resourceUrl5 = getResourceUrl(
            MOCK_STORAGE_CONTAINER,
            AzureResourceTypes.StorageBlobContainer,
            MOCK_STORAGE_ACCOUNT
        );
        const resourceUrl6 = getResourceUrl(
            MOCK_STORAGE_CONTAINER_NAME,
            AzureResourceTypes.StorageBlobContainer,
            MOCK_STORAGE_ACCOUNT
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
            MOCK_ENVIRONMENT,
            AzureResourceTypes.DigitalTwinInstance
        );
        const resourceUrl2 = getResourceUrl(
            MOCK_ENVIRONMENT_URL,
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
        expect(getContainerNameFromUrl(MOCK_STORAGE_CONTAINER_URL)).toBe(
            'teststoragecontainer'
        );
    });

    test('Getting container name from container successfully', () => {
        expect(getContainerName(MOCK_STORAGE_CONTAINER)).toBe(
            'teststoragecontainer'
        );
    });

    test('Getting storage account url from container url successfully', () => {
        expect(
            getStorageAccountUrlFromContainerUrl(MOCK_STORAGE_CONTAINER_URL)
        ).toBe('https://teststorageaccount.blob.core.windows.net');
    });

    test('Getting storage account url and container name tuple from container url successfully', () => {
        expect(
            getStorageAndContainerFromContainerUrl(MOCK_STORAGE_CONTAINER_URL)
        ).toMatchObject({
            storageAccountUrl:
                'https://teststorageaccount.blob.core.windows.net',
            containerName: 'teststoragecontainer'
        });
    });
});
