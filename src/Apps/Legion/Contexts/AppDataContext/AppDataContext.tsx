/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IAppDataContext,
    IAppDataContextProviderProps,
    IAppDataContextState,
    AppDataContextAction,
    AppDataContextActionType
} from './AppDataContext.types';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('AppDataContext', debugLogging);

export const AppDataContext = React.createContext<IAppDataContext>(null);
export const useAppDataContext = () => useContext(AppDataContext);

export const AppDataContextReducer: (
    draft: IAppDataContextState,
    action: AppDataContextAction
) => IAppDataContextState = produce(
    (draft: IAppDataContextState, action: AppDataContextAction) => {
        logDebugConsole(
            'info',
            `Updating Graph context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case AppDataContextActionType.SET_TARGET_DATABASE:
                draft.targetDatabase = action.payload.targetDatabase;
                break;
        }
    }
);

export const AppDataContextProvider: React.FC<IAppDataContextProviderProps> = (
    props
) => {
    const { children, initialState } = props;

    // skip wrapping if the context already exists
    const existingContext = useAppDataContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const [state, dispatch] = useReducer(
        AppDataContextReducer,
        { ...emptyState, ...initialState },
        getInitialState
    );

    logDebugConsole('debug', 'Mount AppDataContextProvider. {state}', state);
    return (
        <AppDataContext.Provider
            value={{
                appDataDispatch: dispatch,
                appDataState: state
            }}
        >
            {children}
        </AppDataContext.Provider>
    );
};

const emptyState: IAppDataContextState = {
    targetDatabase: null
};

function getInitialState(
    initialState: IAppDataContextState
): IAppDataContextState {
    const state: IAppDataContextState = {
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
}
