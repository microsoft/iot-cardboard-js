import React, { useContext, useReducer } from 'react';
import {
    DataManagementContextAction,
    DataManagementContextActionType,
    IDataManagementContext,
    IDataManagementContextProviderProps,
    IDataManagementContextState
} from './DataManagementContext.types';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import produce from 'immer';

export const DataManagementContext = React.createContext<IDataManagementContext>(
    null
);

export const useDataManagementContext = () => useContext(DataManagementContext);

const debugLogging = false;
const logDebugConsole = getDebugLogger('DataManagement', debugLogging);

export const DataManagementContextReducer: (
    draft: IDataManagementContextState,
    action: DataManagementContextAction
) => any = produce((draft, action) => {
    logDebugConsole(
        'info',
        `Updating Data management context ${action.type} with payload: `,
        action.payload
    );
    switch (action.type) {
        // TODO: Discuss if these will be split into more granular actions
        // Datasource step
        case DataManagementContextActionType.SET_SOURCE_INFORMATION:
            draft.sources = action.payload.data;
            break;
        // Modify step actions
        case DataManagementContextActionType.SET_INITIAL_ASSETS:
            draft.initialAssets = action.payload.data;
            // Copy data into modified assets to initialize in case it contains no data
            if (!draft.modifiedAssets) {
                draft.modifiedAssets = action.payload.data;
            }
            break;
        case DataManagementContextActionType.UPDATE_MODIFIED_ASSETS:
            draft.modifiedAssets = action.payload.data;
            break;
    }
});

export function DataManagementContextProvider(
    props: React.PropsWithChildren<IDataManagementContextProviderProps>
) {
    const { children, initialState } = props;

    const [
        dataManagementContextState,
        dataManagementContextDispatch
    ] = useReducer(
        DataManagementContextReducer,
        { ...emptyState, ...initialState },
        getInitialState
    );

    return (
        <DataManagementContext.Provider
            value={{
                dataManagementContextState: dataManagementContextState,
                dataManagementContextDispatch: dataManagementContextDispatch
            }}
        >
            {children}
        </DataManagementContext.Provider>
    );
}

const emptyState: IDataManagementContextState = {
    initialAssets: null,
    modifiedAssets: null,
    sources: []
};

export const getInitialState = (initialState?: IDataManagementContextState) => {
    const state: IDataManagementContextState = {
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
};
