export type AppPage = 'StoreListPage' | 'ActionPicker' | 'Wizard';
export interface IAppNavigationContextProviderProps {
    initialState?: Partial<IAppNavigationContextState>;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IAppNavigationContext {
    navigationState: IAppNavigationContextState;
    navigationDispatch: React.Dispatch<AppNavigationContextAction>;
}

/**
 * The state of the context
 */
export interface IAppNavigationContextState {
    currentPage: AppPage;
}

/**
 * The actions to update the state
 */
export enum AppNavigationContextActionType {
    NAVIGATE_TO = 'NAVIGATE_TO'
}

/** The actions to update the state */
export type AppNavigationContextAction = {
    type: AppNavigationContextActionType.NAVIGATE_TO;
    payload: {
        pageName: AppPage;
    };
};
