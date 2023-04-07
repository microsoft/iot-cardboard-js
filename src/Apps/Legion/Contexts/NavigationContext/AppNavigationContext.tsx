/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IAppNavigationContext,
    IAppNavigationContextProviderProps,
    IAppNavigationContextState,
    AppNavigationContextAction,
    AppNavigationContextActionType,
    AppPageName
} from './AppNavigationContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('NavigationContext', debugLogging);

const AppNavigationContext = React.createContext<IAppNavigationContext>(null);
export const useAppNavigationContext = () => useContext(AppNavigationContext);

export const AppNavigationContextReducer: (
    draft: IAppNavigationContextState,
    action: AppNavigationContextAction
) => IAppNavigationContextState = produce(
    (draft: IAppNavigationContextState, action: AppNavigationContextAction) => {
        logDebugConsole(
            'info',
            `Updating Graph context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case AppNavigationContextActionType.NAVIGATE_TO:
                draft.currentPage = action.payload;
                break;
        }
    }
);

export const AppNavigationContextProvider: React.FC<IAppNavigationContextProviderProps> = (
    props
) => {
    const { children, initialState } = props;

    // skip wrapping if the context already exists
    const existingContext = useAppNavigationContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const [state, dispatch] = useReducer(
        AppNavigationContextReducer,
        { ...emptyState, ...initialState },
        getInitialState
    );

    logDebugConsole('debug', 'Mount NavigationContextProvider. {state}', state);
    return (
        <AppNavigationContext.Provider
            value={{
                appNavigationDispatch: dispatch,
                appNavigationState: state
            }}
        >
            {children}
        </AppNavigationContext.Provider>
    );
};

const emptyState: IAppNavigationContextState = {
    currentPage: { pageName: AppPageName.StoreList } // defaults the starting page for the app
};

function getInitialState(
    initialState: IAppNavigationContextState
): IAppNavigationContextState {
    const state: IAppNavigationContextState = {
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
}
