import {
    AzureResourceDisplayFields,
    AzureResourceTypes,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Models/Constants';
import {
    areResourceValuesEqual,
    getNameOfResource,
    getResourceUrl,
    getUrlFromString
} from '../../Models/Services/Utils';
import { StorageAccountToContainersMapping } from './EnvironmentPicker.types';

export const getContainerDisplayText = (
    container: string | IAzureStorageBlobContainer,
    storageAccount: string | IAzureStorageAccount
) => {
    try {
        if (container && storageAccount) {
            const containerName = getNameOfResource(
                container,
                AzureResourceTypes.StorageBlobContainer
            );
            const urlObj = getUrlFromString(
                getResourceUrl(
                    storageAccount,
                    AzureResourceTypes.StorageAccount
                )
            );
            return `${urlObj.hostname.split('.')[0]}/${containerName}`;
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const findStorageAccountFromResources = (
    storageAccount: string | IAzureStorageAccount,
    resources: Array<IAzureStorageAccount>
) => {
    if (typeof storageAccount === 'string') {
        return resources.find((resource) =>
            areResourceValuesEqual(
                getResourceUrl(resource, AzureResourceTypes.StorageAccount),
                storageAccount,
                AzureResourceDisplayFields.url
            )
        );
    } else {
        return storageAccount;
    }
};

export const getStorageAndContainerFromContainerUrl = (
    containerUrl: string
) => {
    try {
        const urlObj = getUrlFromString(containerUrl);
        return {
            storageAccountUrl: urlObj.origin,
            containerName: urlObj.pathname.split('/')[1]
        };
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getStorageAccountUrlFromContainerUrl = (containerUrl: string) => {
    try {
        const urlObj = getUrlFromString(containerUrl);
        return urlObj.origin;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getStorageAccountId = (
    storageAccount: string | IAzureStorageAccount,
    storageAccountToContainersMapping: Array<StorageAccountToContainersMapping> = []
) => {
    return typeof storageAccount === 'string'
        ? storageAccountToContainersMapping.find((mapping) =>
              areResourceValuesEqual(
                  mapping.storageAccountUrl,
                  storageAccount,
                  AzureResourceDisplayFields.url
              )
          )?.storageAccountId
        : storageAccount?.id;
};
