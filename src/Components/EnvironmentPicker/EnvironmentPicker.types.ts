import { ADT3DSceneAdapter, IAzureResource, MockAdapter } from '../..';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

type WithLocalStorage = {
    isLocalStorageEnabled: true;
    localStorageKey: string;
    selectedItemLocalStorageKey: string;
};

type WithoutLocalStorage = {
    isLocalStorageEnabled: false;
    localStorageKey?: never;
    selectedItemLocalStorageKey?: never;
};

type StorageContainer = {
    containerUrl?: string;
    onContainerUrlChange?: (
        containerUrl: string,
        containerUrls: Array<string>
    ) => void;
} & (WithLocalStorage | WithoutLocalStorage);

export type EnvironmentPickerProps = BaseComponentProps & {
    adapter: ADT3DSceneAdapter | MockAdapter;
    isDialogHidden?: boolean;
    onDismiss?: () => void;
    environmentUrl?: string;
    onEnvironmentUrlChange?: (
        environment: string,
        environments: Array<string>
    ) => void;
    storage?: StorageContainer;
} & (WithLocalStorage | WithoutLocalStorage);

export type ADTEnvironmentInLocalStorage = {
    name: string;
    config: {
        appAdtUrl: string;
    };
};

export type ADTSelectedEnvironmentInLocalStorage = {
    appAdtUrl: string;
};

export type StorageAccountsInLocalStorage = {
    id: string;
    url: string;
};

export type StorageAccountToContainersMapping = {
    storageAccountId: string;
    storageAccountUrl: string;
    containerNames: Array<string>;
};

// START of Actions
export const SET_ENVIRONMENT_ITEMS = 'SET_ENVIRONMENT_ITEMS';
export const SET_STORAGE_ACCOUNT_ITEMS = 'SET_STORAGE_ACCOUNT_ITEMS';
export const SET_CONTAINER_ITEMS = 'SET_CONTAINER_ITEMS';
export const SET_FIRST_TIME_VISIBLE = 'SET_FIRST_TIME_VISIBLE';
export const SET_SELECTED_ITEMS_ON_SAVE = 'SET_SELECTED_ITEMS_ON_SAVE';
export const RESET_ITEMS_ON_DISMISS = 'RESET_ITEMS_ON_DISMISS';
export const HANDLE_ENVIRONMENT_CHANGE = 'HANDLE_ENVIRONMENT_CHANGE';
export const HANDLE_STORAGE_ACCOUNT_CHANGE = 'HANDLE_STORAGE_ACCOUNT_CHANGE';
export const HANDLE_STORAGE_ACCOUNT_LOADED = 'HANDLE_STORAGE_ACCOUNT_LOADED';
export const HANDLE_CONTAINER_CHANGE = 'HANDLE_CONTAINER_CHANGE';
// END of Actions

export interface EnvironmentPickerState {
    environmentItems: {
        environments: Array<IAzureResource | string>; // list of name of environment resources or manually entered environment urls
        selectedEnvironment: IAzureResource | string; // either resource itself or manually entered environment url
        environmentToEdit: IAzureResource | string; // either resource itself or manually entered environment url
    };
    storageAccountItems: {
        storageAccounts: Array<IAzureResource | string>; // list of name of storage account resources or manually entered storage account urls
        selectedStorageAccount: IAzureResource | string; // either resource itself or manually entered account url
        storageAccountToEdit: IAzureResource | string; // either resource itself or manually entered account url
    };
    containerItems: {
        containers: Array<IAzureResource | string>; // list of name of container resources or manually entered container names
        selectedContainer: IAzureResource | string; // either resource itself or manually entered container name
        containerToEdit: IAzureResource | string; // either resource itself or manually entered container name
    };
    firstTimeVisible: boolean; // not to render resource picker components in the dialog content with data fetch requests if the dialog has not opened yet for the first time
}
