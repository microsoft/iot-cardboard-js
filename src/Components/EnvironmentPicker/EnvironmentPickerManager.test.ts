import { cleanup } from '@testing-library/react-hooks';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes
} from '../../Models/Constants/Enums';
import {
    areResourceValuesEqual,
    getResourceUrl
} from '../../Models/Services/Utils';
import {
    MOCK_ADT_INSTANCE,
    MOCK_ADT_INSTANCE_URL,
    MOCK_STORAGE_ACCOUNT,
    MOCK_STORAGE_ACCOUNT_URL,
    MOCK_STORAGE_CONTAINER,
    MOCK_STORAGE_CONTAINER_NAME,
    MOCK_STORAGE_CONTAINER_URL
} from './EnvironmentPicker.mock';
import {
    getContainerDisplayText,
    getStorageAccountUrlFromContainerUrl,
    getStorageAndContainerFromContainerUrl
} from './EnvironmentPickerManager';

afterEach(cleanup);

describe('EnvironmentPickerManager', () => {
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

    test('Resource url equality check is successful', () => {
        const resourceUrl1 = getResourceUrl(
            MOCK_ADT_INSTANCE,
            AzureResourceTypes.DigitalTwinInstance
        );
        const resourceUrl2 = getResourceUrl(
            MOCK_ADT_INSTANCE_URL,
            AzureResourceTypes.DigitalTwinInstance
        );

        expect(
            areResourceValuesEqual(
                resourceUrl1,
                'https://testADTInstance.api.wcus.digitaltwins.azure.net',
                AzureResourceDisplayFields.url
            )
        ).toBeTruthy();
        expect(
            areResourceValuesEqual(
                resourceUrl2,
                'https://testADTInstance.api.wcus.digitaltwins.azure.net/',
                AzureResourceDisplayFields.url
            )
        ).toBeTruthy();
        expect(
            areResourceValuesEqual(
                resourceUrl2,
                'https://testADTInstance2.api.wcus.digitaltwins.azure.net/',
                AzureResourceDisplayFields.url
            )
        ).toBeFalsy();
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
