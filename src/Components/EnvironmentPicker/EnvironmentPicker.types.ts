import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    IADTInstance,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Models/Constants/Interfaces';

type WithLocalStorage = {
    isLocalStorageEnabled: true;
    localStorageKey?: string; // TODO: This prop will deprecate soon, we will do migration to a strict key when run if provided but stop updating from now on
    selectedItemLocalStorageKey?: string; // TODO: This prop will deprecate soon, we will do migration to a strict key when run if provided but stop updating from now on
};

type WithoutLocalStorage = {
    isLocalStorageEnabled: false;
    localStorageKey?: never;
    selectedItemLocalStorageKey?: never;
};

type StorageContainer = {
    containerUrl?: string;
    onContainerChange?: (
        storageAccount: IAzureStorageAccount | string,
        container: IAzureStorageBlobContainer | string,
        containers: Array<IAzureStorageBlobContainer | string>
    ) => void;
} & (WithLocalStorage | WithoutLocalStorage);

export type EnvironmentPickerProps = {
    adapter: ADT3DSceneAdapter | MockAdapter;
    onDismiss?: () => void;
    adtInstanceUrl?: string;
    onAdtInstanceChange?: (
        adtInstance: IADTInstance | string,
        adtInstances: Array<IADTInstance | string>
    ) => void;
    storage?: StorageContainer;
} & (WithLocalStorage | WithoutLocalStorage);

export type ADTInstanceOptionInLocalStorage = {
    /** @deprecated This has been used for aligning the local storage format with ADT Explorer app. This will be removed soon with the new local storage format */
    name: string;
    config: {
        appAdtUrl: string;
    };
};

export type ADTSelectedInstanceInLocalStorage = {
    /** @deprecated This has been used for aligning the local storage format with ADT Explorer app. This will be removed soon with the new local storage format */
    appAdtUrl: string;
};

export type StorageAccountsInLocalStorage = {
    /** @deprecated This will be removed soon with the new local storage format */
    id: string;
    url: string;
};

export type StorageAccountToContainersMapping = {
    storageAccountId: string;
    storageAccountUrl: string;
    containerNames: Array<string>;
};

export type AdtInstanceInfo = {
    adtInstances: Array<IADTInstance | string>; // list of url of adt instance resources or manually entered adt instance urls
    adtInstanceToEdit: IADTInstance | string; // either resource itself or manually entered adt instance url
};

export type StorageAccountInfo = {
    storageAccounts: Array<IAzureStorageAccount | string>; // list of url of storage account resources or manually entered storage account urls
    storageAccountToEdit: IAzureStorageAccount | string; // either resource itself or manually entered account url
};

export type ContainerInfo = {
    containers: Array<IAzureStorageBlobContainer | string>; // list of name of container resources or manually entered container names
    containerToEdit: IAzureStorageBlobContainer | string; // either resource itself or manually entered container name
};

export interface EnvironmentPickerState {
    adtInstanceInfo: AdtInstanceInfo;
    storageAccountInfo: StorageAccountInfo;
    containerInfo: ContainerInfo;
    firstTimeVisible: boolean; // not to render resource picker components in the dialog content with data fetch requests if the dialog has not opened yet for the first time
}

export enum EnvironmentPickerActionType {
    SET_ADT_INSTANCE_INFO,
    SET_STORAGE_ACCOUNT_INFO,
    SET_CONTAINER_INFO,
    MARK_DIALOG_AS_SHOWN,
    RESET_ITEMS_ON_DISMISS,
    HANDLE_STORAGE_ACCOUNT_LOADED
}

export type EnvironmentPickerAction =
    | {
          type: EnvironmentPickerActionType.SET_ADT_INSTANCE_INFO;
          payload: { adtInstanceInfo: AdtInstanceInfo };
      }
    | {
          type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_INFO;
          payload: { storageAccountInfo: StorageAccountInfo };
      }
    | {
          type: EnvironmentPickerActionType.SET_CONTAINER_INFO;
          payload: { containerInfo: ContainerInfo };
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
          payload: { resources: IAzureStorageAccount[] };
      };
