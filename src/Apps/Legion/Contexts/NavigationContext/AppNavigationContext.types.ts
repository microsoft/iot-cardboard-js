import { WizardStepNumber } from '../WizardNavigationContext/WizardNavigationContext.types';

export enum AppPageName {
    StoreList = 'StoreList',
    FlowPicker = 'FlowPicker',
    Wizard = 'Wizard'
}
export interface IAppNavigationContextProviderProps {
    initialState?: Partial<IAppNavigationContextState>;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IAppNavigationContext {
    appNavigationState: IAppNavigationContextState;
    appNavigationDispatch: React.Dispatch<AppNavigationContextAction>;
}

type CurrentPageData =
    | {
          pageName: AppPageName.FlowPicker | AppPageName.StoreList;
      }
    | {
          pageName: AppPageName.Wizard;
          step: WizardStepNumber;
      };

/**
 * The state of the context
 */
export interface IAppNavigationContextState {
    currentPage: CurrentPageData;
}

/**
 * The actions to update the state
 */
export enum AppNavigationContextActionType {
    NAVIGATE_TO = 'NAVIGATE_TO'
}

type NavigateToArgs =
    | {
          pageName: AppPageName.FlowPicker | AppPageName.StoreList;
      }
    | {
          pageName: AppPageName.Wizard;
          step: WizardStepNumber;
      };

/** The actions to update the state */
export type AppNavigationContextAction = {
    type: AppNavigationContextActionType.NAVIGATE_TO;
    payload: NavigateToArgs;
};
