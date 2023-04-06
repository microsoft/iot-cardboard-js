export type NavigationPage = 'StoreListPage' | 'ActionPicker' | 'Wizard';
export interface INavigationContextProviderProps {
    initialState?: Partial<INavigationContextState>;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface INavigationContext {
    navigationState: INavigationContextState;
    navigationDispatch: React.Dispatch<NavigationContextAction>;
}

/**
 * The state of the context
 */
export interface INavigationContextState {
    currentPage: NavigationPage;
}

/**
 * The actions to update the state
 */
export enum NavigationContextActionType {
    NAVIGATE_TO = 'NAVIGATE_TO'
}

/** The actions to update the state */
export type NavigationContextAction = {
    type: NavigationContextActionType.NAVIGATE_TO;
    payload: {
        pageName: NavigationPage;
    };
};
