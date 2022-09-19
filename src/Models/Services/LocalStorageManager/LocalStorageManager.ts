import { AzureResourceTypes } from '../../Constants/Enums';
import {
    IADTInstance,
    IAzureResource,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Constants/Interfaces';
import { getNameOfResource, getResourceUrl } from '../Utils';
import {
    EnvironmentConfigurationInLocalStorage,
    EnvironmentConfigurationItem,
    EnvironmentConfigurationLocalStorageKey
} from './LocalStorageManager.types';

/** This is used for converting a adt, storage account or storage container resource
 * to a environment configuration item to store in localstorage
 * @param id id of the resource
 * @param name name of the resource
 * @param url url of the resource
 */
export const getEnvironmentConfigurationItemFromResource = (
    resource: IAzureResource | string,
    resourceType: AzureResourceTypes,
    parentResource?: IAzureResource | string // to construct the url for a container we need its parent storage account's url
): EnvironmentConfigurationItem | null => {
    if (!resource) return null;
    return {
        id: typeof resource === 'string' ? null : resource.id,
        name: getNameOfResource(resource, resourceType),
        url: getResourceUrl(resource, resourceType, parentResource)
    };
};

/** This is used for getting the main environment configuration local storage item which stores
 * adt, storage account and storage container related information in it
 * @returns te environment configuration local storage item or null if not exists
 */
export const getEnvironmentConfigurationFromLocalStorage = (): EnvironmentConfigurationInLocalStorage | null => {
    try {
        const environmentConfigurationInLocalStorage = localStorage.getItem(
            EnvironmentConfigurationLocalStorageKey
        );
        return environmentConfigurationInLocalStorage
            ? (JSON.parse(
                  environmentConfigurationInLocalStorage
              ) as EnvironmentConfigurationInLocalStorage)
            : null;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

/** To get the list of ADT instances from local storage to be used as options in EnvironmentPicker
 * @return list of ADT instances as environment configuration item from local storage
 */
export const getAdtInstancesFromLocalStorage = (): Array<EnvironmentConfigurationItem> | null => {
    try {
        const environmentConfigurationInLocalStorage: EnvironmentConfigurationInLocalStorage = JSON.parse(
            localStorage.getItem(EnvironmentConfigurationLocalStorageKey)
        );
        return environmentConfigurationInLocalStorage?.adt?.adtInstances;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

/** To get the list of ADT instances from local storage to be used as options in EnvironmentPicker
 * @return list of ADT instances as environment configuration item from local storage
 */
export const getStorageAccountsFromLocalStorage = (): Array<EnvironmentConfigurationItem> => {
    try {
        const environmentConfigurationInLocalStorage: EnvironmentConfigurationInLocalStorage = JSON.parse(
            localStorage.getItem(EnvironmentConfigurationLocalStorageKey)
        );
        return environmentConfigurationInLocalStorage.storageAccount
            .storageAccounts;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

/** To update the list of storage containers in local storage to be used as options in EnvironmentPicker
 * @param storageAccounts list of storage accounts to be updated in the local storage
 */
export const getStorageContainersFromLocalStorage = (): Array<EnvironmentConfigurationItem> | null => {
    try {
        const environmentConfigurationInLocalStorage: EnvironmentConfigurationInLocalStorage = JSON.parse(
            localStorage.getItem(EnvironmentConfigurationLocalStorageKey)
        );
        return environmentConfigurationInLocalStorage.container?.containers;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

/** To get the selected ADT instance information from earlier session from local storage
 * @returns selected ADT instance as an environment configuration item from local storage, null if not exists
 */
export const getSelectedAdtInstanceFromLocalStorage = (): EnvironmentConfigurationItem | null => {
    try {
        const environmentConfigurationInLocalStorage = getEnvironmentConfigurationFromLocalStorage();
        return environmentConfigurationInLocalStorage?.adt?.selectedAdtInstance;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

/** To get the selected storage account information from earlier session from local storage
 * @returns selected storage account as an environment configuration item from local storage, null if not exists
 */
export const getSelectedStorageAccountFromLocalStorage = (): EnvironmentConfigurationItem | null => {
    const environmentConfigurationInLocalStorage = getEnvironmentConfigurationFromLocalStorage();
    return environmentConfigurationInLocalStorage?.storageAccount
        ?.selectedStorageAccount;
};

/** To get the selected storage container information from earlier session from local storage
 * @returns selected storage container as an environment configuration item from local storage, null if not exists
 */
export const getSelectedStorageContainerFromLocalStorage = (): EnvironmentConfigurationItem | null => {
    const environmentConfigurationInLocalStorage = getEnvironmentConfigurationFromLocalStorage();
    return environmentConfigurationInLocalStorage?.container?.selectedContainer;
};

/** Updates the environment configuration local storage item in the local storage
 * @param configuration configuration object to be set in the local storage
 */
const setEnvironmentConfigurationInLocalStorage = (
    configuration: EnvironmentConfigurationInLocalStorage
): void => {
    localStorage.setItem(
        EnvironmentConfigurationLocalStorageKey,
        JSON.stringify(configuration)
    );
};

/** Updates the selected ADT instance information in local storage
 * @param selectedAdtInstance currently selected ADT instance resource to be stored in local storage
 */
export const setSelectedAdtInstanceInLocalStorage = (
    selectedAdtInstance: string | IADTInstance
) => {
    const environmentConfiguration =
        getEnvironmentConfigurationFromLocalStorage() || {};
    if (selectedAdtInstance) {
        const selectedAdtInstanceEnvironmentConfigurationItem = getEnvironmentConfigurationItemFromResource(
            selectedAdtInstance,
            AzureResourceTypes.DigitalTwinInstance
        );
        environmentConfiguration.adt = {
            ...environmentConfiguration.adt,
            selectedAdtInstance: selectedAdtInstanceEnvironmentConfigurationItem
        };
    } else if (environmentConfiguration?.adt?.selectedAdtInstance) {
        delete environmentConfiguration.adt.selectedAdtInstance;
    }
    setEnvironmentConfigurationInLocalStorage(environmentConfiguration);
};

/** To update the selected storage account in local storage to be used as option in EnvironmentPicker
 * @param selectedAccount the storage account to be stored in the local storage
 */
export const setSelectedStorageAccountInLocalStorage = (
    selectedAccount: string | IAzureStorageAccount
) => {
    const environmentConfiguration =
        getEnvironmentConfigurationFromLocalStorage() || {};
    if (selectedAccount) {
        const selectedStorageAccountEnvironmentConfigurationItem = getEnvironmentConfigurationItemFromResource(
            selectedAccount,
            AzureResourceTypes.StorageAccount
        );
        environmentConfiguration.storageAccount = {
            ...environmentConfiguration.storageAccount,
            selectedStorageAccount: selectedStorageAccountEnvironmentConfigurationItem
        };
    } else if (
        environmentConfiguration?.storageAccount?.selectedStorageAccount
    ) {
        delete environmentConfiguration.storageAccount.selectedStorageAccount;
    }
    setEnvironmentConfigurationInLocalStorage(environmentConfiguration);
};

/** To update the selected storage container in local storage to be used for the app's initial state and EnvironmentPicker
 * @param selectedContainer the storage container to be stored in the local storage
 * @param parentStorageAccount the storage account where the container is in, this is needed to get the url of the container since a container does not store url information as an Azure resource
 */
export const setSelectedStorageContainerInLocalStorage = (
    selectedContainer: string | IAzureStorageBlobContainer,
    parentStorageAccount: string | IAzureStorageAccount
) => {
    const environmentConfiguration =
        getEnvironmentConfigurationFromLocalStorage() || {};
    if (selectedContainer) {
        const selectedContainerEnvironmentConfigurationItem = getEnvironmentConfigurationItemFromResource(
            selectedContainer,
            AzureResourceTypes.StorageBlobContainer,
            parentStorageAccount
        );
        environmentConfiguration.container = {
            ...environmentConfiguration.container,
            selectedContainer: selectedContainerEnvironmentConfigurationItem
        };
    } else if (environmentConfiguration?.container?.selectedContainer) {
        delete environmentConfiguration.container.selectedContainer;
    }
    setEnvironmentConfigurationInLocalStorage(environmentConfiguration);
};

/** Updates the list of ADT instances in local storage to be used as options in EnvironmentPicker
 * @param adtInstances list of ADT instance resources to be stored in local storage
 */
export const setAdtInstancesInLocalStorage = (
    adtInstances: Array<string | IADTInstance> = []
) => {
    const adtInstancesConfigurationItems = adtInstances
        .filter((e) => e) // filter out null instances
        .map((a) =>
            getEnvironmentConfigurationItemFromResource(
                a,
                AzureResourceTypes.DigitalTwinInstance
            )
        );
    let environmentConfigurationInLocalStorage: EnvironmentConfigurationInLocalStorage;
    try {
        environmentConfigurationInLocalStorage = JSON.parse(
            localStorage.getItem(EnvironmentConfigurationLocalStorageKey)
        );
        environmentConfigurationInLocalStorage.adt = {
            // assign like this in case adt field is not present in the environment configuration
            ...environmentConfigurationInLocalStorage.adt,
            adtInstances: adtInstancesConfigurationItems
        };
    } catch (error) {
        console.error(error.message);
        environmentConfigurationInLocalStorage = {
            adt: {
                adtInstances: adtInstancesConfigurationItems
            }
        };
    }
    localStorage.setItem(
        EnvironmentConfigurationLocalStorageKey,
        JSON.stringify(environmentConfigurationInLocalStorage)
    );
};

/** To update the list of storage accounts in local storage to be used as options in EnvironmentPicker
 * @param storageAccounts list of storage accounts to be updated in the local storage
 */
export const setStorageAccountsInLocalStorage = (
    storageAccounts: Array<IAzureResource | string> = []
) => {
    const storageAccountsConfigurationItems = storageAccounts
        .filter((e) => e) // filter out null instances
        .map((a) =>
            getEnvironmentConfigurationItemFromResource(
                a,
                AzureResourceTypes.StorageAccount
            )
        );
    let environmentConfigurationInLocalStorage: EnvironmentConfigurationInLocalStorage;
    try {
        environmentConfigurationInLocalStorage = JSON.parse(
            localStorage.getItem(EnvironmentConfigurationLocalStorageKey)
        );
        environmentConfigurationInLocalStorage.storageAccount = {
            // assign like this in case adt field is not present in the environment configuration
            ...environmentConfigurationInLocalStorage.storageAccount,
            storageAccounts: storageAccountsConfigurationItems
        };
    } catch (error) {
        console.error(error.message);
        environmentConfigurationInLocalStorage = {
            storageAccount: {
                storageAccounts: storageAccountsConfigurationItems
            }
        };
    }
    localStorage.setItem(
        EnvironmentConfigurationLocalStorageKey,
        JSON.stringify(environmentConfigurationInLocalStorage)
    );
};

/** To update the list of storage containers in local storage to be used as options in EnvironmentPicker
 * @param containers list of storage containers to be updated in the local storage
 * @param parentStorageAccount the storage account where the container is in, this is needed to get the url of the container since a container does not store url information as an Azure resource
 */
export const setStorageContainersInLocalStorage = (
    containers: Array<IAzureResource | string> = [],
    parentStorageAccount: IAzureResource | string
) => {
    const containersConfigurationItems = containers
        .filter((e) => e) // filter out null instances
        .map((a) =>
            getEnvironmentConfigurationItemFromResource(
                a,
                AzureResourceTypes.StorageBlobContainer,
                parentStorageAccount
            )
        );
    let environmentConfigurationInLocalStorage: EnvironmentConfigurationInLocalStorage;
    try {
        environmentConfigurationInLocalStorage = JSON.parse(
            localStorage.getItem(EnvironmentConfigurationLocalStorageKey)
        );
        environmentConfigurationInLocalStorage.container = {
            // assign like this in case adt field is not present in the environment configuration
            ...environmentConfigurationInLocalStorage.container,
            containers: containersConfigurationItems
        };
    } catch (error) {
        console.error(error.message);
        environmentConfigurationInLocalStorage = {
            container: {
                containers: containersConfigurationItems
            }
        };
    }
    localStorage.setItem(
        EnvironmentConfigurationLocalStorageKey,
        JSON.stringify(environmentConfigurationInLocalStorage)
    );
};
