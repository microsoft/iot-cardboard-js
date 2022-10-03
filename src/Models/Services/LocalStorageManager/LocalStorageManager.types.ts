export const EnvironmentConfigurationLocalStorageKey =
    'cb-environment-configuration';

export const EnvironmentOptionsLocalStorageKey = 'cb-environment-options';

/** EnvironmentItemInLocalStorage is used for storing the adt, storage account or storage container resource
 * as a configuration or option item to keep track of selected items and options in the app and localstorage
 * @param id id of the resource
 * @param name name of the resource
 * @param url url of the resource
 */
export type EnvironmentItemInLocalStorage = {
    id: string;
    name: string;
    url: string;
};

/** EnvironmentConfigurationInLocalStorage is used for storing the environment related information in local storage
 * @param selectedAdtInstance selected ADT instance in the app
 * @param selectedStorageAccount selected Storage account in the app
 * @param selectedStorageContainer Container selected Storage container in the app
 */
export type EnvironmentConfigurationInLocalStorage = {
    selectedAdtInstance?: EnvironmentItemInLocalStorage; // string type kept for migration from old version
    selectedStorageAccount?: EnvironmentItemInLocalStorage; // string type kept for migration from old version
    selectedStorageContainer?: EnvironmentItemInLocalStorage; // string type added for migration from old version
};

/** EnvironmentOptionsInLocalStorage is used for storing the options for EnvironmentPicker
 * @param adtInstances ADT instance options of fetched data or manually entered input which is updated with save action in EnvironmentPicker
 * @param storageAccounts Storage account options of fetched data or manually entered input which is updated with save action in EnvironmentPicker
 * @param storageContainers Storage container options of fetched data or manually entered input which is updated with save action in EnvironmentPicker
 */
export type EnvironmentOptionsInLocalStorage = {
    adtInstances?: Array<EnvironmentItemInLocalStorage>; // string type kept for migration from old version
    storageAccounts?: Array<EnvironmentItemInLocalStorage>; // string type kept for migration from old version
    storageContainers?: Array<EnvironmentItemInLocalStorage>; // string type kept for migration from old version
};
