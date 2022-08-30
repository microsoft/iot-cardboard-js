import {
    AzureResourceDisplayFields,
    AzureResourceTypes,
    IAzureResource
} from '../../Models/Constants';
import {
    ContainersLocalStorageKey,
    EnvironmentsLocalStorageKey,
    StorageAccountsLocalStorageKey
} from '../../Models/Constants/Constants';
import { areResourceValuesEqual } from '../../Models/Services/Utils';
import {
    ADTEnvironmentInLocalStorage,
    StorageAccountsInLocalStorage,
    StorageAccountToContainersMapping
} from './EnvironmentPicker.types';

export const getEnvironmentDisplayText = (env: string | IAzureResource) => {
    try {
        if (env) {
            if (typeof env === 'string') {
                if (new URL(env)) {
                    return env.split('.')[0].split('://')[1]; // to respect casing in the name of the instance
                } else {
                    return null;
                }
            } else {
                return env.name;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getContainerDisplayText = (
    container: string | IAzureResource,
    storageAccount: string | IAzureResource
) => {
    try {
        if (container && storageAccount) {
            const containerName = getContainerName(container);
            const urlObj = new URL(
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

export const getResourceUrl = (
    resource: IAzureResource | string, // can either be the url string or azure resource
    resourceType: AzureResourceTypes, // always pass this in case the resource is string type
    parentResource?: IAzureResource | string
): string | null => {
    if (resource) {
        if (typeof resource === 'string') {
            // it means the option is manually entered using freeform
            if (resourceType) {
                switch (resourceType) {
                    case AzureResourceTypes.DigitalTwinInstance:
                    case AzureResourceTypes.StorageAccount:
                        return resource;
                    case AzureResourceTypes.StorageBlobContainer: {
                        const storageAccountEndpointUrl = getResourceUrl(
                            parentResource,
                            AzureResourceTypes.StorageAccount
                        );
                        if (storageAccountEndpointUrl) {
                            return `${
                                storageAccountEndpointUrl.endsWith('/')
                                    ? storageAccountEndpointUrl
                                    : storageAccountEndpointUrl + '/'
                            }${resource}`;
                        } else {
                            return null;
                        }
                    }
                    default:
                        return null;
                }
            } else {
                return resource;
            }
        } else {
            const resourceType = resource.type;
            switch (resourceType) {
                case AzureResourceTypes.DigitalTwinInstance:
                    return resource.properties?.hostName
                        ? 'https://' + resource.properties.hostName
                        : null;
                case AzureResourceTypes.StorageAccount:
                    return resource.properties?.primaryEndpoints?.blob;
                case AzureResourceTypes.StorageBlobContainer: {
                    const storageAccountEndpointUrl = getResourceUrl(
                        parentResource,
                        AzureResourceTypes.StorageAccount
                    );
                    if (storageAccountEndpointUrl) {
                        return `${
                            storageAccountEndpointUrl.endsWith('/')
                                ? storageAccountEndpointUrl
                                : storageAccountEndpointUrl + '/'
                        }${resource.name}`;
                    } else {
                        return null;
                    }
                }
                default:
                    return null;
            }
        }
    }
    return null;
};

export const getResourceUrls = (
    resources: Array<IAzureResource | string> = [],
    resourceType: AzureResourceTypes, // always pass this in case the resource is string type
    parentResource?: IAzureResource | string
) => {
    return resources.map((resource) =>
        getResourceUrl(resource, resourceType, parentResource)
    );
};

export const getContainerNameFromUrl = (containerUrl: string) => {
    try {
        const containerUrlObj = new URL(containerUrl);
        return containerUrlObj.pathname.split('/')[1];
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getContainerName = (container: string | IAzureResource) => {
    // container can either be the name string of the container directly or the azure resource object
    return typeof container === 'string' ? container : container?.name;
};

export const findStorageAccountFromResources = (
    storageAccount: string | IAzureResource,
    resources: Array<IAzureResource>
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

export const getStorageAccountUrlFromContainerUrl = (containerUrl: string) => {
    try {
        if (containerUrl) {
            const urlObj = new URL(containerUrl);
            return urlObj.origin;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getStorageAndContainerFromContainerUrl = (
    containerUrl: string
) => {
    try {
        if (containerUrl) {
            const urlObj = new URL(containerUrl);
            return {
                storageAccountUrl: urlObj.origin,
                containerName: urlObj.pathname.split('/')[1]
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getStorageAccountId = (
    storageAccount: string | IAzureResource,
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

export const getEnvironmentUrlsFromLocalStorage = (
    localStorageKey: string = EnvironmentsLocalStorageKey
) => {
    let environmentsInLocalStorage: Array<ADTEnvironmentInLocalStorage>;
    try {
        environmentsInLocalStorage = JSON.parse(
            localStorage.getItem(localStorageKey)
        );
    } catch (error) {
        console.error(error.message);
        environmentsInLocalStorage = null;
    }

    const environmentUrls: Array<string> = environmentsInLocalStorage
        ? environmentsInLocalStorage
              .filter((e) => e.config?.appAdtUrl)
              .map((e: ADTEnvironmentInLocalStorage) => e.config.appAdtUrl)
        : [];
    return environmentUrls;
};

export const updateEnvironmentsInLocalStorage = (
    environments: Array<string | IAzureResource> = [],
    localStorageKey: string = EnvironmentsLocalStorageKey
) => {
    const environmentUrls = getResourceUrls(
        environments,
        AzureResourceTypes.DigitalTwinInstance
    );
    localStorage.setItem(
        localStorageKey,
        JSON.stringify(
            environmentUrls
                .filter((e) => e) // filter out nulls or empty strings
                .map((e: string) => ({
                    config: {
                        appAdtUrl: e
                    },
                    name: e
                })) || []
        )
    );
};

export const getStorageAccountOptionsFromLocalStorage = (): Array<StorageAccountsInLocalStorage> => {
    try {
        return JSON.parse(localStorage.getItem(StorageAccountsLocalStorageKey));
    } catch (error) {
        console.error(error.message);
        return [];
    }
};

export const updateStorageAccountsInLocalStorage = (
    storageAccounts: Array<IAzureResource | string> = []
) => {
    localStorage.setItem(
        StorageAccountsLocalStorageKey,
        JSON.stringify(
            storageAccounts.map(
                (storageAccount: IAzureResource | string) =>
                    ({
                        id:
                            typeof storageAccount === 'string'
                                ? null
                                : storageAccount.id,
                        url: getResourceUrl(
                            storageAccount,
                            AzureResourceTypes.StorageAccount
                        )
                    } as StorageAccountsInLocalStorage)
            )
        )
    );
};

export const getContainerUrlsFromLocalStorage = (
    localStorageKey: string
): Array<string> | null => {
    try {
        return JSON.parse(
            localStorage.getItem(localStorageKey ?? ContainersLocalStorageKey)
        );
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const updateContainerOptionsInLocalStorage = (
    containers: Array<IAzureResource | string> = [],
    parentStorageAccount: IAzureResource | string,
    localStorageKey: string = ContainersLocalStorageKey
) => {
    const containerUrls = getResourceUrls(
        containers,
        AzureResourceTypes.StorageBlobContainer,
        parentStorageAccount
    );
    localStorage.setItem(localStorageKey, JSON.stringify(containerUrls));
};
