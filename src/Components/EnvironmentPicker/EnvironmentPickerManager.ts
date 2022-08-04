import { AzureResourceTypes, IAzureResource } from '../../Models/Constants';
import {
    ContainersLocalStorageKey,
    EnvironmentsLocalStorageKey,
    SelectedContainerLocalStorageKey,
    SelectedEnvironmentLocalStorageKey,
    StorageAccountsLocalStorageKey
} from '../../Models/Constants/Constants';
import {
    ADTEnvironmentInLocalStorage,
    ADTSelectedEnvironmentInLocalStorage,
    StorageAccountsInLocalStorage,
    StorageAccountToContainersMapping
} from './EnvironmentPicker.types';

class EnvironmentPickerManager {
    static getEnvironmentDisplayText(env: string | IAzureResource) {
        try {
            if (env) {
                const urlObj = new URL(
                    EnvironmentPickerManager.getResourceUrl(
                        env,
                        AzureResourceTypes.DigitalTwinInstance
                    )
                );
                return urlObj.hostname.split('.')[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    static getContainerDisplayText(
        container: string | IAzureResource,
        storageAccount: string | IAzureResource
    ) {
        if (container && storageAccount) {
            const containerName = EnvironmentPickerManager.getContainerName(
                container
            );
            const urlObj = new URL(
                EnvironmentPickerManager.getResourceUrl(
                    storageAccount,
                    AzureResourceTypes.StorageAccount
                )
            );
            return `${urlObj.hostname.split('.')[0]}/${containerName}`;
        }
        return null;
    }

    static getResourceUrl(
        resource: IAzureResource | string,
        resourceType: AzureResourceTypes, // always pass this in case the resource is string type
        parentResource?: IAzureResource | string
    ) {
        if (resource) {
            if (typeof resource === 'string') {
                // it means the option is manually entered using freeform
                if (resourceType) {
                    switch (resourceType) {
                        case AzureResourceTypes.DigitalTwinInstance:
                        case AzureResourceTypes.StorageAccount:
                            return resource;
                        case AzureResourceTypes.StorageBlobContainer: {
                            const storageAccountEndpointUrl = EnvironmentPickerManager.getResourceUrl(
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
                        const storageAccountEndpointUrl = EnvironmentPickerManager.getResourceUrl(
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
    }

    static getResourceUrls(
        resources: Array<IAzureResource | string>,
        resourceType: AzureResourceTypes, // always pass this in case the resource is string type
        parentResource?: IAzureResource | string
    ) {
        return resources.map((resource) =>
            EnvironmentPickerManager.getResourceUrl(
                resource,
                resourceType,
                parentResource
            )
        );
    }

    static areResourceUrlsEqual(
        resourceUrlStr1: string,
        resourceUrlStr2: string
    ) {
        if (resourceUrlStr1?.endsWith('/')) {
            resourceUrlStr1 = resourceUrlStr1.slice(0, -1);
        }
        if (resourceUrlStr2?.endsWith('/')) {
            resourceUrlStr2 = resourceUrlStr2.slice(0, -1);
        }
        return resourceUrlStr1 === resourceUrlStr2;
    }

    static getContainerNameFromUrl(containerUrl: string) {
        try {
            const containerUrlObj = new URL(containerUrl);
            return containerUrlObj.pathname.split('/')[1];
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    static getContainerName(container: string | IAzureResource) {
        return typeof container === 'string' ? container : container?.name;
    }

    static findStorageAccountFromResources(
        storageAccount: string | IAzureResource,
        resources: Array<IAzureResource>
    ) {
        if (typeof storageAccount === 'string') {
            return resources.find((resource) =>
                EnvironmentPickerManager.areResourceUrlsEqual(
                    EnvironmentPickerManager.getResourceUrl(
                        resource,
                        AzureResourceTypes.StorageAccount
                    ),
                    storageAccount
                )
            );
        } else {
            return storageAccount;
        }
    }

    static getStorageAccountUrlFromContainerUrl(containerUrl: string) {
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
    }

    static getStorageAndContainerFromContainerUrl(containerUrl: string) {
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
    }

    static getStorageAccountId(
        storageAccount: string | IAzureResource,
        storageAccountToContainersMapping: Array<StorageAccountToContainersMapping>
    ) {
        return typeof storageAccount === 'string'
            ? storageAccountToContainersMapping?.find(
                  (mapping) => mapping.storageAccountUrl === storageAccount
              )?.storageAccountId
            : storageAccount?.id;
    }

    static getEnvironmentUrlsFromLocalStorage(
        localStorageKey: string = EnvironmentsLocalStorageKey
    ) {
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
    }

    static updateEnvironmentsInLocalStorage(
        environments: Array<string | IAzureResource>,
        localStorageKey: string = EnvironmentsLocalStorageKey
    ) {
        const environmentUrls = EnvironmentPickerManager.getResourceUrls(
            environments,
            AzureResourceTypes.DigitalTwinInstance
        );
        localStorage.setItem(
            localStorageKey,
            JSON.stringify(
                environmentUrls
                    ?.filter((e) => e) // filter out nulls or empty strings
                    .map((e: string) => ({
                        config: {
                            appAdtUrl: e
                        },
                        name: e
                    })) || []
            )
        );
    }

    static getSelectedEnvironmentUrlFromLocalStorage(
        localStorageKey: string = SelectedEnvironmentLocalStorageKey
    ) {
        try {
            return (JSON.parse(
                localStorage.getItem(localStorageKey)
            ) as ADTSelectedEnvironmentInLocalStorage)?.appAdtUrl;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    static updateSelectedEnvironmentInLocalStorage(
        selectedEnvironment: string | IAzureResource,
        localStorageKey: string = SelectedEnvironmentLocalStorageKey
    ) {
        localStorage.setItem(
            localStorageKey,
            JSON.stringify({
                appAdtUrl: EnvironmentPickerManager.getResourceUrl(
                    selectedEnvironment,
                    AzureResourceTypes.DigitalTwinInstance
                )
            })
        );
    }

    static getStorageAccountOptionsFromLocalStorage() {
        try {
            return JSON.parse(
                localStorage.getItem(StorageAccountsLocalStorageKey)
            );
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    static updateStorageAccountsInLocalStorage(
        storageAccounts: Array<IAzureResource | string>
    ) {
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
                            url: EnvironmentPickerManager.getResourceUrl(
                                storageAccount,
                                AzureResourceTypes.StorageAccount
                            )
                        } as StorageAccountsInLocalStorage)
                )
            )
        );
    }

    static getContainerUrlsFromLocalStorage(localStorageKey: string) {
        try {
            return JSON.parse(
                localStorage.getItem(
                    localStorageKey ?? ContainersLocalStorageKey
                )
            );
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    static updateContainerOptionsInLocalStorage(
        containers: Array<IAzureResource | string>,
        parentStorageAccount: IAzureResource | string,
        localStorageKey: string = ContainersLocalStorageKey
    ) {
        const containerUrls = EnvironmentPickerManager.getResourceUrls(
            containers,
            AzureResourceTypes.StorageBlobContainer,
            parentStorageAccount
        );
        localStorage.setItem(localStorageKey, JSON.stringify(containerUrls));
    }

    static getSelectedContainerUrlFromLocalStorage(
        localStorageKey: string = SelectedContainerLocalStorageKey
    ) {
        return localStorage.getItem(localStorageKey);
    }

    static updateSelectedContainerInLocalStorage(
        selectedContainer: string | IAzureResource,
        selectedStorageAccount: string | IAzureResource,
        localStorageKey: string = SelectedContainerLocalStorageKey
    ) {
        localStorage.setItem(
            localStorageKey,
            EnvironmentPickerManager.getResourceUrl(
                selectedContainer,
                AzureResourceTypes.StorageBlobContainer,
                selectedStorageAccount
            )
        );
    }
}

export default EnvironmentPickerManager;
