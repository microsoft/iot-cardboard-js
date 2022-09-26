import {
    IADTInstance,
    IADXConnection,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Constants/Interfaces';
import { EnvironmentConfigurationItem } from '../../Services/LocalStorageManager/LocalStorageManager.types';

export interface IEnvironmentContextProviderProps {
    initialState?: Partial<IEnvironmentContextState>;
}

/**
 * A context used for keeping the track of the environment configuration state like
 * selected adt instance, storage account, container and adx connection information.
 */
export interface IEnvironmentContext {
    environmentState: IEnvironmentContextState;
    environmentDispatch: React.Dispatch<EnvironmentContextAction>;
}

/**
 * The state of the context
 */
export interface IEnvironmentContextState {
    adtInstance: EnvironmentConfigurationItem | null;
    storageAccount: EnvironmentConfigurationItem | null;
    storageContainer: EnvironmentConfigurationItem | null;
    adxConnectionInformation: IADXConnection;
}

/**
 * The actions to update the state
 */
export enum EnvironmentContextActionType {
    SET_ADT_INSTANCE = 'SET_ADT_INSTANCE',
    SET_STORAGE_ACCOUNT = 'SET_STORAGE_ACCOUNT',
    SET_STORAGE_CONTAINER = 'SET_STORAGE_CONTAINER',
    SET_ADX_CONNECTION_INFORMATION = 'SET_ADX_CONNECTION_INFORMATION'
}

/** The actions to update the state */
export type EnvironmentContextAction =
    | {
          type: EnvironmentContextActionType.SET_ADT_INSTANCE;
          payload: { adtInstance: string | IADTInstance };
      }
    | {
          type: EnvironmentContextActionType.SET_STORAGE_ACCOUNT;
          payload: { account: string | IAzureStorageAccount };
      }
    | {
          type: EnvironmentContextActionType.SET_STORAGE_CONTAINER;
          payload: {
              container: string | IAzureStorageBlobContainer;
              storageAccount: string | IAzureStorageAccount;
          };
      }
    | {
          type: EnvironmentContextActionType.SET_ADX_CONNECTION_INFORMATION;
          payload: {
              connectionInformation: IADXConnection;
          };
      };
