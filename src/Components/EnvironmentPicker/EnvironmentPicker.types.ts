import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    IADTInstance,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Models/Constants/Interfaces';

type WithLocalStorage = {
    isLocalStorageEnabled: true;
};

type WithoutLocalStorage = {
    isLocalStorageEnabled: false;
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
        environment: IADTInstance | string,
        environments: Array<IADTInstance | string>
    ) => void;
    storage?: StorageContainer;
} & (WithLocalStorage | WithoutLocalStorage);

export type StorageAccountToContainersMapping = {
    storageAccountId: string;
    storageAccountUrl: string;
    containerNames: Array<string>;
};

export type AdtInstanceItems = {
    adtInstances: Array<IADTInstance | string>; // list of url of adt instance resources or manually entered adt instance urls
    adtInstanceToEdit: IADTInstance | string; // either resource itself or manually entered adt instance url
};

export type StorageAccountItems = {
    storageAccounts: Array<IAzureStorageAccount | string>; // list of url of storage account resources or manually entered storage account urls
    storageAccountToEdit: IAzureStorageAccount | string; // either resource itself or manually entered account url
};

export type ContainerItems = {
    containers: Array<IAzureStorageBlobContainer | string>; // list of name of container resources or manually entered container names
    containerToEdit: IAzureStorageBlobContainer | string; // either resource itself or manually entered container name
};

export interface EnvironmentPickerState {
    adtInstanceItems: AdtInstanceItems;
    storageAccountItems: StorageAccountItems;
    containerItems: ContainerItems;
    firstTimeVisible: boolean; // not to render resource picker components in the dialog content with data fetch requests if the dialog has not opened yet for the first time
}

export enum EnvironmentPickerActionType {
    SET_ADT_INSTANCE_ITEMS,
    SET_STORAGE_ACCOUNT_ITEMS,
    SET_CONTAINER_ITEMS,
    MARK_DIALOG_AS_SHOWN,
    RESET_ITEMS_ON_DISMISS,
    HANDLE_STORAGE_ACCOUNT_LOADED
}

export type EnvironmentPickerAction =
    | {
          type: EnvironmentPickerActionType.SET_ADT_INSTANCE_ITEMS;
          payload: { adtInstanceItems: AdtInstanceItems };
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
          payload: { resources: IAzureStorageAccount[] };
      };
