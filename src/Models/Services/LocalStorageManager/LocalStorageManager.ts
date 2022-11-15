import {
    ADTInstanceOptionInLocalStorage,
    ADTSelectedInstanceInLocalStorage,
    StorageAccountsInLocalStorage
} from '../../../Components/EnvironmentPicker/EnvironmentPicker.types';
import { getStorageAccountUrlFromContainerUrl } from '../../../Components/EnvironmentPicker/EnvironmentPickerManager';
import {
    ContainersLocalStorageKey,
    EnvironmentsLocalStorageKey,
    LOCAL_STORAGE_KEYS,
    SelectedContainerLocalStorageKey,
    SelectedEnvironmentLocalStorageKey,
    StorageAccountsLocalStorageKey
} from '../../Constants/Constants';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes
} from '../../Constants/Enums';
import {
    IADTInstance,
    IAzureResource,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Constants/Interfaces';
import {
    areResourceValuesEqual,
    getContainerNameFromUrl,
    getNameOfResource,
    getResourceUrl,
    getUrlFromString
} from '../Utils';
import {
    EnvironmentConfigurationInLocalStorage,
    EnvironmentItemInLocalStorage,
    EnvironmentOptionsInLocalStorage
} from './LocalStorageManager.types';

/** This is used for converting a adt, storage account or storage container resource
 * to a environment configuration item to store in localstorage
 * @param id id of the resource
 * @param name name of the resource
 * @param url url of the resource
 */
export const getEnvironmentItemFromResource = (
    resource: IAzureResource | string,
    resourceType: AzureResourceTypes,
    parentResource?: IAzureResource | string // to construct the url for a container we need its parent storage account's url
): EnvironmentItemInLocalStorage | null => {
    if (!resource) return null;
    return {
        id: typeof resource === 'string' ? null : resource.id,
        name: getNameOfResource(resource, resourceType),
        url: getResourceUrl(resource, resourceType, parentResource)
    };
};

/** This is used for converting an environment configuration item to Azure resource
 * @param item environment item in local storage
 * @param type intended type for the Azure resource
 */
export const getResourceFromEnvironmentItem = (
    item: EnvironmentItemInLocalStorage,
    type: AzureResourceTypes
): IAzureResource => {
    if (!item) return null;
    const urlObj = getUrlFromString(item.url);
    return {
        id: item.id ?? null,
        name: getNameOfResource(item.url, type),
        ...(type === AzureResourceTypes.DigitalTwinInstance && {
            properties: {
                hostName: urlObj?.hostname
            },
            location: ''
        }),
        ...(type === AzureResourceTypes.StorageAccount && {
            properties: {
                primaryEndpoints: { blob: urlObj?.hostname }
            }
        }),
        type
    } as IAzureResource;
};

/** This is used for getting the main environment configuration local storage item which stores
 * selected adt, storage account and storage container related information in it
 * @returns te environment configuration local storage item or null if not exists
 */
export const getEnvironmentConfigurationFromLocalStorage = (): EnvironmentConfigurationInLocalStorage | null => {
    try {
        const environmentConfigurationInLocalStorage = localStorage.getItem(
            LOCAL_STORAGE_KEYS.Environment.Configuration
        );
        return environmentConfigurationInLocalStorage
            ? (JSON.parse(
                  environmentConfigurationInLocalStorage
              ) as EnvironmentConfigurationInLocalStorage)
            : null;
    } catch (error) {
        console.error(
            'Failed to get environment configuration from local storage',
            error.message
        );
        return null;
    }
};

/** This is used for getting the main environment options local storage item which stores
 * adt, storage account and storage container options for EnvironmentPicker component
 * @returns te environment options local storage item or null if not exists
 */
export const getEnvironmentOptionsFromLocalStorage = (): EnvironmentOptionsInLocalStorage | null => {
    try {
        const environmentOptionsInLocalStorage = localStorage.getItem(
            LOCAL_STORAGE_KEYS.Environment.Options
        );
        return environmentOptionsInLocalStorage
            ? (JSON.parse(
                  environmentOptionsInLocalStorage
              ) as EnvironmentOptionsInLocalStorage)
            : null;
    } catch (error) {
        console.error(
            'Failed to get environment options from local storage',
            error.message
        );
        return null;
    }
};

/** To get the list of ADT instances from local storage to be used as options in EnvironmentPicker
 * @return list of ADT instances as environment item from local storage
 */
export const getAdtInstanceOptionsFromLocalStorage = (
    localStorageKey?: string
): Array<EnvironmentItemInLocalStorage> | null => {
    try {
        const environmentOptionsInLocalStorage =
            getEnvironmentOptionsFromLocalStorage() || {};
        if (!environmentOptionsInLocalStorage?.adtInstances) {
            // START of migration of values using old local storage key
            const previouslyUsedKey =
                localStorageKey || EnvironmentsLocalStorageKey;

            const oldOptionsInLocalStorage = localStorage.getItem(
                previouslyUsedKey
            );
            if (oldOptionsInLocalStorage) {
                const optionUrls = oldOptionsInLocalStorage
                    ? (JSON.parse(
                          oldOptionsInLocalStorage
                      ) as Array<ADTInstanceOptionInLocalStorage>)
                          .filter((e) => e.config?.appAdtUrl)
                          .map((e) => e.config.appAdtUrl)
                    : null;
                setAdtInstanceOptionsInLocalStorage(optionUrls);
                localStorage.removeItem(EnvironmentsLocalStorageKey); // only remove the key that is used by the cardboard, not the passed localStorageKey since consumer app might be still using it like ADT explorer app
                return optionUrls.map((o) =>
                    getEnvironmentItemFromResource(
                        o,
                        AzureResourceTypes.DigitalTwinInstance
                    )
                );
            }
            // END of migration
        }
        return environmentOptionsInLocalStorage?.adtInstances;
    } catch (error) {
        console.error(
            'Failed to get ADT instance options from local storage',
            error.message
        );
        return null;
    }
};

/** To get the list of Storage accounts from local storage to be used as options in EnvironmentPicker
 * @return list of Storage accounts as environment item from local storage
 */
export const getStorageAccountOptionsFromLocalStorage = (): Array<EnvironmentItemInLocalStorage> | null => {
    try {
        const environmentOptionsInLocalStorage =
            getEnvironmentOptionsFromLocalStorage() || {};
        if (!environmentOptionsInLocalStorage?.storageAccounts) {
            // START of migration of values using old local storage key
            const previouslyUsedKey = StorageAccountsLocalStorageKey;

            const oldOptionsInLocalStorage = localStorage.getItem(
                previouslyUsedKey
            );
            if (oldOptionsInLocalStorage) {
                const options = oldOptionsInLocalStorage
                    ? (JSON.parse(
                          oldOptionsInLocalStorage
                      ) as Array<StorageAccountsInLocalStorage>).map(
                          (e) =>
                              ({
                                  id: e.id,
                                  name: getNameOfResource(
                                      e.url,
                                      AzureResourceTypes.StorageAccount
                                  ),
                                  properties: {
                                      primaryEndpoints: { blob: e.url }
                                  },
                                  type: AzureResourceTypes.StorageAccount
                              } as IAzureStorageAccount)
                      )
                    : null;

                setStorageAccountOptionsInLocalStorage(options);
                localStorage.removeItem(previouslyUsedKey);
                return options.map((o) =>
                    getEnvironmentItemFromResource(
                        o,
                        AzureResourceTypes.StorageAccount
                    )
                );
            }
            // END of migration
        }
        return environmentOptionsInLocalStorage?.storageAccounts;
    } catch (error) {
        console.error(
            'Failed to get Storage account options from local storage',
            error.message
        );
        return null;
    }
};

/** To update the list of Storage containers in local storage to be used as options in EnvironmentPicker
 * @return list of Storage containers as environment item from local storage
 */
export const getStorageContainerOptionsFromLocalStorage = (
    localStorageKey?: string
): Array<EnvironmentItemInLocalStorage> | null => {
    try {
        const environmentOptionsInLocalStorage =
            getEnvironmentOptionsFromLocalStorage() || {};
        if (!environmentOptionsInLocalStorage?.storageContainers) {
            // Try fetching values using old local storage key
            const previouslyUsedKey =
                localStorageKey || ContainersLocalStorageKey;

            const oldOptionsInLocalStorage = localStorage.getItem(
                previouslyUsedKey
            );
            const optionUrls = oldOptionsInLocalStorage
                ? (JSON.parse(oldOptionsInLocalStorage) as Array<string>)
                : null;
            if (optionUrls) {
                setStorageContainerOptionsInLocalStorage(
                    optionUrls.map((o) => getContainerNameFromUrl(o)),
                    getStorageAccountUrlFromContainerUrl(optionUrls[0]) // since all the options belongs to the same storage account, pick the first container to extract the account url
                );
            }
            localStorage.removeItem(ContainersLocalStorageKey); // only remove the key that is used by the cardboard, not the passed localStorageKey since consumers might be still using it in their own app
            return optionUrls?.map((o) =>
                getEnvironmentItemFromResource(
                    getContainerNameFromUrl(o),
                    AzureResourceTypes.StorageBlobContainer,
                    getStorageAccountUrlFromContainerUrl(o)
                )
            );
        } else {
            return environmentOptionsInLocalStorage?.storageContainers;
        }
    } catch (error) {
        console.error(
            'Failed to get Storage container options from local storage',
            error.message
        );
        return null;
    }
};

/** To get the selected ADT instance information from local storage
 * @returns selected ADT instance as an environment item from local storage, null if not exists
 */
export const getSelectedAdtInstanceFromLocalStorage = (
    localStorageKey?: string
): EnvironmentItemInLocalStorage | null => {
    try {
        const environmentConfigurationInLocalStorage = getEnvironmentConfigurationFromLocalStorage();
        if (!environmentConfigurationInLocalStorage?.selectedAdtInstance) {
            // START of migration of values using old local storage key
            const previouslyUsedKey =
                localStorageKey || SelectedEnvironmentLocalStorageKey;
            const oldInstanceInLocalStorage = localStorage.getItem(
                previouslyUsedKey
            );
            if (oldInstanceInLocalStorage) {
                const oldInstanceUrl = oldInstanceInLocalStorage
                    ? (JSON.parse(
                          oldInstanceInLocalStorage
                      ) as ADTSelectedInstanceInLocalStorage).appAdtUrl
                    : null;

                setSelectedAdtInstanceInLocalStorage(oldInstanceUrl);
                localStorage.removeItem(SelectedEnvironmentLocalStorageKey);

                return getEnvironmentItemFromResource(
                    oldInstanceUrl,
                    AzureResourceTypes.DigitalTwinInstance
                );
            }
            // END of migration
        }
        return environmentConfigurationInLocalStorage?.selectedAdtInstance;
    } catch (error) {
        console.error(
            'Failed to get selected ADT instance from local storage',
            error.message
        );
        return null;
    }
};

/** To get the selected Storage account information from local storage
 * @returns selected Storage account as an environment item from local storage, null if not exists
 */
export const getSelectedStorageAccountFromLocalStorage = (): EnvironmentItemInLocalStorage | null => {
    const environmentConfigurationInLocalStorage = getEnvironmentConfigurationFromLocalStorage();
    return environmentConfigurationInLocalStorage?.selectedStorageAccount;
};

/** To get the selected Storage container information from local storage
 * @returns selected Storage container as an environment item from local storage, null if not exists
 */
export const getSelectedStorageContainerFromLocalStorage = (): EnvironmentItemInLocalStorage | null => {
    try {
        const environmentConfigurationInLocalStorage = getEnvironmentConfigurationFromLocalStorage();
        if (!environmentConfigurationInLocalStorage?.selectedStorageContainer) {
            // START of migration of values using old local storage key
            const previouslyUsedKey = SelectedContainerLocalStorageKey;
            const oldContainerUrl = localStorage.getItem(previouslyUsedKey);
            if (oldContainerUrl) {
                const storageAccountUrl = getStorageAccountUrlFromContainerUrl(
                    oldContainerUrl
                );

                setSelectedStorageContainerInLocalStorage(
                    getContainerNameFromUrl(oldContainerUrl),
                    storageAccountUrl
                );
                setSelectedStorageAccountInLocalStorage(storageAccountUrl);
                localStorage.removeItem(previouslyUsedKey);

                return getEnvironmentItemFromResource(
                    getContainerNameFromUrl(oldContainerUrl),
                    AzureResourceTypes.StorageBlobContainer,
                    storageAccountUrl
                );
            }
        }
        // END of migration
        return environmentConfigurationInLocalStorage?.selectedStorageContainer;
    } catch (error) {
        console.error(
            'Failed to get selected Storage container from local storage',
            error.message
        );
        return null;
    }
};

/** Updates arbitrary key-value pair in the local storage
 * @param key key of the item in localstorage
 * @param value value of the item in localstorage
 */
export const setLocalStorageItem = (key: string, value: string): void => {
    if (key) {
        localStorage.setItem(key, value);
    } else {
        console.error('Setting local storage item failed: Key not passed!');
    }
};

/** Updates the environment configuration local storage item in the local storage
 * @param configuration configuration object to be set in the local storage
 */
const setEnvironmentConfigurationInLocalStorage = (
    configuration: EnvironmentConfigurationInLocalStorage
): void => {
    setLocalStorageItem(
        LOCAL_STORAGE_KEYS.Environment.Configuration,
        JSON.stringify(configuration)
    );
};

/** Updates the environment options local storage item in the local storage
 * @param options options object to be set in the local storage
 */
const setEnvironmentOptionsInLocalStorage = (
    options: EnvironmentOptionsInLocalStorage
): void => {
    setLocalStorageItem(
        LOCAL_STORAGE_KEYS.Environment.Options,
        JSON.stringify(options)
    );
};

/** Updates the selected ADT instance information in local storage
 * @param selectedAdtInstance currently selected ADT instance resource to be stored in local storage
 */
export const setSelectedAdtInstanceInLocalStorage = (
    selectedAdtInstance: string | IADTInstance
) => {
    const environmentConfiguration: EnvironmentConfigurationInLocalStorage =
        getEnvironmentConfigurationFromLocalStorage() || {};
    if (selectedAdtInstance) {
        const selectedAdtInstanceEnvironmentConfigurationItem = getEnvironmentItemFromResource(
            selectedAdtInstance,
            AzureResourceTypes.DigitalTwinInstance
        );
        if (
            typeof selectedAdtInstance === 'string' &&
            areResourceValuesEqual(
                environmentConfiguration.selectedAdtInstance?.url,
                selectedAdtInstanceEnvironmentConfigurationItem.url,
                AzureResourceDisplayFields.url
            )
        ) {
            environmentConfiguration.selectedAdtInstance = {
                ...selectedAdtInstanceEnvironmentConfigurationItem,
                id: environmentConfiguration.selectedAdtInstance.id // to preserve the previously tracked id not to override it with null value only when the urls are same
            };
        } else {
            environmentConfiguration.selectedAdtInstance = selectedAdtInstanceEnvironmentConfigurationItem;
        }
    } else if (environmentConfiguration?.selectedAdtInstance) {
        delete environmentConfiguration.selectedAdtInstance;
    }
    setEnvironmentConfigurationInLocalStorage(environmentConfiguration);
};

/** To update the selected Storage account in local storage
 * @param selectedStorageAccount the storage account to be stored in the local storage
 */
export const setSelectedStorageAccountInLocalStorage = (
    selectedStorageAccount: string | IAzureStorageAccount
) => {
    const environmentConfiguration =
        getEnvironmentConfigurationFromLocalStorage() || {};
    if (selectedStorageAccount) {
        const selectedStorageAccountEnvironmentConfigurationItem = getEnvironmentItemFromResource(
            selectedStorageAccount,
            AzureResourceTypes.StorageAccount
        );
        if (
            typeof selectedStorageAccount === 'string' &&
            areResourceValuesEqual(
                environmentConfiguration.selectedStorageAccount?.url,
                selectedStorageAccountEnvironmentConfigurationItem.url,
                AzureResourceDisplayFields.url
            )
        ) {
            environmentConfiguration.selectedStorageAccount = {
                ...selectedStorageAccountEnvironmentConfigurationItem,
                id: environmentConfiguration.selectedStorageAccount.id // to preserve the previously tracked id not to override it with null value only when the urls are same
            };
        } else {
            environmentConfiguration.selectedStorageAccount = selectedStorageAccountEnvironmentConfigurationItem;
        }
    } else if (environmentConfiguration?.selectedStorageAccount) {
        delete environmentConfiguration.selectedStorageAccount;
    }
    setEnvironmentConfigurationInLocalStorage(environmentConfiguration);
};

/** To update the selected Storage container in local storage
 * @param selectedStorageContainer the storage container to be stored in the local storage
 * @param parentStorageAccount the storage account where the container is in, this is needed to get the url of the container since a container does not store url information as an Azure resource
 */
export const setSelectedStorageContainerInLocalStorage = (
    selectedContainer: string | IAzureStorageBlobContainer,
    parentStorageAccount: string | IAzureStorageAccount
) => {
    const environmentConfiguration =
        getEnvironmentConfigurationFromLocalStorage() || {};
    if (selectedContainer) {
        const selectedContainerEnvironmentConfigurationItem = getEnvironmentItemFromResource(
            selectedContainer,
            AzureResourceTypes.StorageBlobContainer,
            parentStorageAccount
        );
        if (
            typeof selectedContainer === 'string' &&
            areResourceValuesEqual(
                environmentConfiguration.selectedStorageContainer?.url,
                selectedContainerEnvironmentConfigurationItem.url,
                AzureResourceDisplayFields.url
            )
        ) {
            environmentConfiguration.selectedStorageContainer = {
                ...selectedContainerEnvironmentConfigurationItem,
                id: environmentConfiguration.selectedStorageContainer.id // to preserve the previously tracked id not to override it with null value only when the urls are same
            };
        } else {
            environmentConfiguration.selectedStorageContainer = selectedContainerEnvironmentConfigurationItem;
        }
    } else if (environmentConfiguration?.selectedStorageContainer) {
        delete environmentConfiguration.selectedStorageContainer;
    }
    setEnvironmentConfigurationInLocalStorage(environmentConfiguration);
};

/** Updates the list of ADT instances in local storage to be used as options in EnvironmentPicker
 * @param adtInstances list of ADT instance resources to be stored in local storage
 */
export const setAdtInstanceOptionsInLocalStorage = (
    adtInstances: Array<string | IADTInstance> = []
) => {
    const adtInstancesItems = adtInstances
        .filter((e) => e) // filter out null instances
        .map((a) =>
            getEnvironmentItemFromResource(
                a,
                AzureResourceTypes.DigitalTwinInstance
            )
        );
    let newEnvironmentOptions: EnvironmentOptionsInLocalStorage;
    try {
        const environmentOptionsInLocalStorage =
            getEnvironmentOptionsFromLocalStorage() || {};
        const existingOptionsInLocalStorage =
            environmentOptionsInLocalStorage.adtInstances || [];

        adtInstancesItems.forEach((item) => {
            if (!item.id) {
                const existingId = existingOptionsInLocalStorage.find(
                    (option) =>
                        areResourceValuesEqual(
                            option.url,
                            item.url,
                            AzureResourceDisplayFields.url
                        )
                )?.id;
                if (existingId) {
                    item.id = existingId;
                }
            }
        });

        newEnvironmentOptions = {
            ...environmentOptionsInLocalStorage, // keep other existing options
            adtInstances: adtInstancesItems
        };
    } catch (error) {
        console.error(
            'Failed to set ADT instance options in local storage',
            error.message
        );
    }
    setEnvironmentOptionsInLocalStorage(newEnvironmentOptions);
};

/** To update the list of Storage accounts in local storage to be used as options in EnvironmentPicker
 * @param storageAccounts list of Storage accounts to be updated in the local storage
 */
export const setStorageAccountOptionsInLocalStorage = (
    storageAccounts: Array<IAzureStorageAccount | string> = []
) => {
    const storageAccountItems = storageAccounts
        .filter((e) => e) // filter out null instances
        .map((a) =>
            getEnvironmentItemFromResource(a, AzureResourceTypes.StorageAccount)
        );
    let newEnvironmentOptions: EnvironmentOptionsInLocalStorage;
    try {
        const environmentOptionsInLocalStorage =
            getEnvironmentOptionsFromLocalStorage() || {};

        const existingOptionsInLocalStorage =
            environmentOptionsInLocalStorage.storageAccounts || [];
        storageAccountItems.forEach((item) => {
            if (!item.id) {
                const existingId = existingOptionsInLocalStorage.find(
                    (option) =>
                        areResourceValuesEqual(
                            option.url,
                            item.url,
                            AzureResourceDisplayFields.url
                        )
                )?.id;
                if (existingId) {
                    item.id = existingId;
                }
            }
        });

        newEnvironmentOptions = {
            // assign like this in case adt field is not present in the environment configuration
            ...environmentOptionsInLocalStorage,
            storageAccounts: storageAccountItems
        };
    } catch (error) {
        console.error(
            'Failed to set Storage account options in local storage',
            error.message
        );
    }
    setEnvironmentOptionsInLocalStorage(newEnvironmentOptions);
};

/** To update the list of Storage containers in local storage to be used as options in EnvironmentPicker
 * @param storageContainers list of storage containers (name strings) to be updated in the local storage
 * @param parentStorageAccount the storage account where the containers are in, this is needed to get the url of the container since a container does not store url information as an Azure resource
 */
export const setStorageContainerOptionsInLocalStorage = (
    storageContainers: Array<IAzureStorageBlobContainer | string> = [],
    parentStorageAccount: IAzureStorageAccount | string
) => {
    const containerItems = storageContainers
        .filter((e) => e) // filter out null instances
        .map((a) =>
            getEnvironmentItemFromResource(
                a,
                AzureResourceTypes.StorageBlobContainer,
                parentStorageAccount
            )
        );
    let newEnvironmentOptions: EnvironmentOptionsInLocalStorage;
    try {
        const environmentOptionsInLocalStorage =
            getEnvironmentOptionsFromLocalStorage() || {};

        const existingOptionsInLocalStorage =
            environmentOptionsInLocalStorage.storageContainers || [];
        containerItems.forEach((item) => {
            if (!item.id) {
                const existingId = existingOptionsInLocalStorage.find(
                    (option) =>
                        areResourceValuesEqual(
                            option.url,
                            item.url,
                            AzureResourceDisplayFields.url
                        )
                )?.id;
                if (existingId) {
                    item.id = existingId;
                }
            }
        });

        newEnvironmentOptions = {
            // assign like this in case adt field is not present in the environment configuration
            ...environmentOptionsInLocalStorage,
            storageContainers: containerItems
        };
    } catch (error) {
        console.error(
            'Failed to set Storage container options in local storage',
            error.message
        );
    }
    setEnvironmentOptionsInLocalStorage(newEnvironmentOptions);
};
