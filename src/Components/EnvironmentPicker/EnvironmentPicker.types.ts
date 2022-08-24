import { ADT3DSceneAdapter, IAzureResource, MockAdapter } from '../..';

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

export type EnvironmentPickerProps = {
    adapter: ADT3DSceneAdapter | MockAdapter;
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
    MARK_DIALOG_AS_SHOWN,
    RESET_ITEMS_ON_DISMISS,
    HANDLE_STORAGE_ACCOUNT_LOADED
}

export type EnvironmentPickerAction =
    | {
          type: EnvironmentPickerActionType.SET_ENVIRONMENT_ITEMS;
          payload: { environmentItems: EnvironmentItems };
      }
    | {
          type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_ITEMS;
          payload: { storageAccountItems: StorageAccountItems };
      }
    | {
          type: EnvironmentPickerActionType.SET_CONTAINER_ITEMS;
          payload: { containerItems: ContainerItems };
      }
    | {
          type: EnvironmentPickerActionType.MARK_DIALOG_AS_SHOWN;
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
