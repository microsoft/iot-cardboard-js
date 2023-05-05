import { IDataManagementAdapter } from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { IADXAdapterTargetContext } from '../../Models/Interfaces';

export interface ITargetDatabaseConnection {
    clusterUrl: string;
    databaseName: string;
}
export interface IAppDataContextProviderProps {
    adapter?: IDataManagementAdapter;
    initialState?: Partial<IAppDataContextState>;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IAppDataContext extends IADXAdapterTargetContext {
    appDataState: IAppDataContextState;
    appDataDispatch: React.Dispatch<AppDataContextAction>;
}

/**
 * The state of the context
 */
export interface IAppDataContextState {
    targetDatabase: ITargetDatabaseConnection | null;
}

/**
 * The actions to update the state
 */
export enum AppDataContextActionType {
    SET_TARGET_DATABASE = 'SET_TARGET_DATABASE'
}

/** The actions to update the state */
export type AppDataContextAction = {
    type: AppDataContextActionType.SET_TARGET_DATABASE;
    payload: {
        targetDatabase: ITargetDatabaseConnection;
    };
};
