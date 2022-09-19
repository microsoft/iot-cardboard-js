export const EnvironmentConfigurationLocalStorageKey =
    'cb-environment-configuration';

/** EnvironmentConfigurationItem is used for storing the adt, storage account or storage container resource
 * as a configuration item to keep track of selected items and options in the app and localstorage
 * @param id id of the resource
 * @param name name of the resource
 * @param url url of the resource
 */
export type EnvironmentConfigurationItem = {
    id: string;
    name: string;
    url: string;
};

/** ADTConfiguration is used for storing the adt instance related information in the app and in localstorage
 * as a part of environment configuration
 * @param adtInstances of adt instance configuration items which is updated with EnvironmentPicker interaction
 * @param selectedAdtInstance configuration item of the selected adt instance in the app
 */
export type ADTConfiguration = {
    adtInstances?: Array<EnvironmentConfigurationItem>;
    selectedAdtInstance?: EnvironmentConfigurationItem;
};

/** StorageAccountConfiguration is used for storing the storage account related information in the app and
 * in localstorage as a part of environment configuration
 * @param storageAccounts of storage account configuration items which is updated with EnvironmentPicker interaction
 * @param selectedStorageAccount configuration item of the selected storage account in the app
 */
export type StorageAccountConfiguration = {
    storageAccounts?: Array<EnvironmentConfigurationItem>;
    selectedStorageAccount?: EnvironmentConfigurationItem;
};

/** StorageAccountConfiguration is used for storing the storage container related information in the app and
 * in localstorage as a part of environment configuration
 * @param containers of storage container configuration items which is updated with EnvironmentPicker interaction
 * @param selectedContainer configuration item of the selected storage container in the app
 */
export type StorageContainerConfiguration = {
    containers?: Array<EnvironmentConfigurationItem>;
    selectedContainer?: EnvironmentConfigurationItem;
};

/** EnvironmentConfigurationInLocalStorage is used for storing the environment related information in local storage
 * @param adt ADT related configurations (selected ADT instance or list of ADT instances previously fetched in the app)
 * @param storageAccount Storage account related configurations (selected storage account or list of storage accounts previously fetched in the app)
 * @param container Storage container related configurations (selected storage container or list of storage containers previously fetched in the app)
 */
export type EnvironmentConfigurationInLocalStorage = {
    adt?: ADTConfiguration;
    storageAccount?: StorageAccountConfiguration;
    container?: StorageContainerConfiguration;
};
