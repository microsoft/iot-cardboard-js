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

export type EnvironmentItems = {
    environments: Array<IAzureResource | string>; // list of name of environment resources or manually entered environment urls
    environmentToEdit: IAzureResource | string; // either resource itself or manually entered environment url
};

export type StorageAccountItems = {
    storageAccounts: Array<IAzureResource | string>; // list of name of storage account resources or manually entered storage account urls
    storageAccountToEdit: IAzureResource | string; // either resource itself or manually entered account url
};

export type ContainerItems = {
    containers: Array<IAzureResource | string>; // list of name of container resources or manually entered container names
    containerToEdit: IAzureResource | string; // either resource itself or manually entered container name
};

export interface EnvironmentPickerState {
    environmentItems: EnvironmentItems;
    storageAccountItems: StorageAccountItems;
    containerItems: ContainerItems;
    firstTimeVisible: boolean; // not to render resource picker components in the dialog content with data fetch requests if the dialog has not opened yet for the first time
}

export enum EnvironmentPickerActionType {
    SET_ENVIRONMENT_ITEMS,
    SET_STORAGE_ACCOUNT_ITEMS,
    SET_CONTAINER_ITEMS,
    SET_FIRST_TIME_VISIBLE,
    RESET_ITEMS_ON_DISMISS,
    HANDLE_ENVIRONMENT_CHANGE,
    HANDLE_STORAGE_ACCOUNT_CHANGE,
    HANDLE_STORAGE_ACCOUNT_LOADED,
    HANDLE_CONTAINER_CHANGE
}

export type EnvironmentPickerAction =
    | {
          type:
              | EnvironmentPickerActionType.SET_ENVIRONMENT_ITEMS
              | EnvironmentPickerActionType.HANDLE_ENVIRONMENT_CHANGE;
          payload: { environmentItems: EnvironmentItems };
      }
    | {
          type:
              | EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_ITEMS
              | EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_CHANGE;
          payload: { storageAccountItems: StorageAccountItems };
      }
    | {
          type:
              | EnvironmentPickerActionType.SET_CONTAINER_ITEMS
              | EnvironmentPickerActionType.HANDLE_CONTAINER_CHANGE;
          payload: { containerItems: ContainerItems };
      }
    | {
          type: EnvironmentPickerActionType.SET_FIRST_TIME_VISIBLE;
          payload: boolean;
      }
    | {
          type: EnvironmentPickerActionType.RESET_ITEMS_ON_DISMISS;
          payload: {
              selectedEnvironmentUrl: string;
              selectedContainerUrl: string;
              storageAccountToContainersMappings: Array<StorageAccountToContainersMapping>;
              resetContainersCallback: () => void;
          };
      }
    | {
          type: EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_LOADED;
          payload: { resources: IAzureResource[] };
      };
