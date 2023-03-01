import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    INavigationContext,
    INavigationContextProviderProps,
    INavigationContextState,
    NavigationContextAction,
    NavigationContextActionType,
    PageNames
} from './NavigationContext.types';

export const NavigationContext = React.createContext<INavigationContext>(null);
export const useNavigationContext = () => useContext(NavigationContext);

const debugLogging = false;
const logDebugConsole = getDebugLogger(
    'Ingress - NavigationContext',
    debugLogging
);

export const NavigationContextReducer: (
    draft: INavigationContextState,
    action: NavigationContextAction
) => any = produce((draft, action) => {
    logDebugConsole(
        'info',
        `Updating Navigation context ${action.type} with payload: `,
        action.payload
    );
    switch (action.type) {
        case NavigationContextActionType.NAVIGATE_TO:
            draft.currentPage = action.payload.pageName;
            break;
    }
});

export const NavigationContextProvider: React.FC<INavigationContextProviderProps> = (
    props
) => {
    const { children, initialState } = props;

    const [navigationContextState, navigationContextDispatch] = useReducer(
        NavigationContextReducer,
        { ...emptyState, ...initialState },
        getInitialState
    );

    return (
        <NavigationContext.Provider
            value={{ navigationContextState, navigationContextDispatch }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

const emptyState: INavigationContextState = {
    currentPage: PageNames.Home
};

export const getInitialState = (initialState?: INavigationContextState) => {
    // TODO: Include more properties here when they are needed.
    const state: INavigationContextState = {
        currentPage: PageNames.Home,
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
};
