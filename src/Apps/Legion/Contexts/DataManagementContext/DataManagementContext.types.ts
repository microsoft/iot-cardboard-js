import { IADXConnection, IAppData, PIDDocument } from '../../Models/Interfaces';

export interface IDataManagementContext {
    dataManagementContextState: IDataManagementContextState;
    dataManagementContextDispatch: React.Dispatch<DataManagementContextAction>;
}

export interface IDataManagementContextState {
    // Keep adding source types here
    sources: Array<IADXConnection | PIDDocument>;
    initialAssets: IAppData;
    modifiedAssets: IAppData;
}

export enum DataManagementContextActionType {
    // Source step actions
    // Make this more granular if we decide to merge Datasource reducer to this context
    SET_SOURCE_INFORMATION = 'SET_SOURCE_INFORMATION',
    // Modify step actions
    SET_INITIAL_ASSETS = 'SET_INITIAL_ASSETS',
    UPDATE_MODIFIED_ASSETS = 'UPDATE_MODIFIED_ASSETS'
}

export type DataManagementContextAction =
    | {
          type: DataManagementContextActionType.SET_SOURCE_INFORMATION;
          payload: {
              data: Array<IADXConnection | PIDDocument>;
          };
      }
    | {
          type: DataManagementContextActionType.SET_INITIAL_ASSETS;
          payload: {
              data: IAppData;
          };
      }
    | {
          type: DataManagementContextActionType.UPDATE_MODIFIED_ASSETS;
          payload: {
              data: IAppData;
          };
      };

// Provider types
export interface IDataManagementContextProviderProps {
    initialState?: Partial<IDataManagementContextState>;
}
