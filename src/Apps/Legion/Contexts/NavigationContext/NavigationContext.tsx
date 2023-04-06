/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { ReactNode, useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    INavigationContext,
    INavigationContextProviderProps,
    INavigationContextState,
    NavigationContextAction,
    NavigationContextActionType
} from './NavigationContext.types';

const debugLogging = false;
export const logDebugConsole = getDebugLogger(
    'NavigationContext',
    debugLogging
);

export const NavigationContext = React.createContext<INavigationContext>(null);
export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationContextReducer: (
    draft: INavigationContextState,
    action: NavigationContextAction
) => INavigationContextState = produce(
    (draft: INavigationContextState, action: NavigationContextAction) => {
        logDebugConsole(
            'info',
            `Updating Graph context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case NavigationContextActionType.NAVIGATE_TO:
                draft.currentPage = action.payload.pageName;
                break;
        }
    }
);

export const NavigationContextProvider: React.FC<INavigationContextProviderProps> = (
    props
) => {
    const { children, initialState } = props;

    // skip wrapping if the context already exists
    const existingContext = useNavigationContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const [state, dispatch] = useReducer(
        NavigationContextReducer,
        { ...emptyState, ...initialState },
        getInitialState
    );

    logDebugConsole('debug', 'Mount NavigationContextProvider. {state}', state);
    return (
        <NavigationContext.Provider
            value={{
                navigationDispatch: dispatch,
                navigationState: state
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

const emptyState: INavigationContextState = {
    currentPage: 'Home'
};

function getInitialState(
    initialState: INavigationContextState
): INavigationContextState {
    const state: INavigationContextState = {
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
}
