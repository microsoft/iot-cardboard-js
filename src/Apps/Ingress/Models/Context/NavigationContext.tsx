import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { PageNames } from '../Constants';
import {
    INavigationContext,
    INavigationContextProviderProps,
    INavigationContextState,
    NavigationContextAction,
    NavigationContextActionType
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

    const defaultState: INavigationContextState = {
        currentPage:
            initialState && initialState.currentPage
                ? initialState.currentPage
                : PageNames.Home
    };

    const [navigationContextState, navigationContextDispatch] = useReducer(
        NavigationContextReducer,
        defaultState
    );

    return (
        <NavigationContext.Provider
            value={{ navigationContextState, navigationContextDispatch }}
        >
            {children}
        </NavigationContext.Provider>
    );
};
