import {
    IADXConnection,
    IAppData,
    IPIDDocument
} from '../../Models/Interfaces';

export interface IWizardDataManagementContext {
    wizardDataManagementContextState: IWizardDataManagementContextState;
    wizardDataManagementContextDispatch: React.Dispatch<WizardDataManagementContextAction>;
}

export interface IWizardDataManagementContextState {
    // Keep adding source types here
    sources: Array<IADXConnection | IPIDDocument>;
    initialAssets: IAppData;
    modifiedAssets: IAppData;
}

export enum WizardDataManagementContextActionType {
    // Source step actions
    // Make this more granular if we decide to merge Datasource reducer to this context
    SET_SOURCE_INFORMATION = 'SET_SOURCE_INFORMATION',
    // Modify step actions
    SET_INITIAL_ASSETS = 'SET_INITIAL_ASSETS',
    SET_MODIFIED_ASSETS = 'SET_MODIFIED_ASSETS'
}

export type WizardDataManagementContextAction =
    | {
          type: WizardDataManagementContextActionType.SET_SOURCE_INFORMATION;
          payload: {
              data: Array<IADXConnection | IPIDDocument>;
          };
      }
    | {
          type: WizardDataManagementContextActionType.SET_INITIAL_ASSETS;
          payload: {
              data: IAppData;
          };
      }
    | {
          type: WizardDataManagementContextActionType.SET_MODIFIED_ASSETS;
          payload: {
              data: IAppData;
          };
      };

// Provider types
export interface IWizardDataManagementContextProviderProps {
    initialState?: Partial<IWizardDataManagementContextState>;
}
