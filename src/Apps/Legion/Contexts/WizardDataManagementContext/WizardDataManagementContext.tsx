import React, { useContext, useReducer } from 'react';
import {
    WizardDataManagementContextAction,
    WizardDataManagementContextActionType,
    IWizardDataManagementContext,
    IWizardDataManagementContextProviderProps,
    IWizardDataManagementContextState
} from './WizardDataManagementContext.types';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import produce from 'immer';

const WizardDataManagementContext = React.createContext<IWizardDataManagementContext>(
    null
);

export const useWizardDataManagementContext = () =>
    useContext(WizardDataManagementContext);

const debugLogging = false;
const logDebugConsole = getDebugLogger(
    'WizardDataManagementContext',
    debugLogging
);

export const WizardDataManagementContextReducer: (
    draft: IWizardDataManagementContextState,
    action: WizardDataManagementContextAction
) => any = produce((draft, action) => {
    logDebugConsole(
        'info',
        `Updating Data management context ${action.type} with payload: `,
        action.payload
    );
    switch (action.type) {
        // TODO: Discuss if these will be split into more granular actions
        // Datasource step
        case WizardDataManagementContextActionType.SET_SOURCE_INFORMATION:
            draft.sources = action.payload.data;
            break;
        // Modify step actions
        case WizardDataManagementContextActionType.SET_INITIAL_ASSETS:
            draft.initialAssets = action.payload.data;
            // Copy data into modified assets to initialize in case it contains no data
            if (!draft.modifiedAssets) {
                draft.modifiedAssets = action.payload.data;
            }
            break;
        case WizardDataManagementContextActionType.SET_MODIFIED_ASSETS:
            draft.modifiedAssets = action.payload.data;
            break;
    }
});

export function WizardDataManagementContextProvider(
    props: React.PropsWithChildren<IWizardDataManagementContextProviderProps>
) {
    const { children, initialState } = props;

    const [
        wizardDataManagementContextState,
        wizardDataManagementContextDispatch
    ] = useReducer(
        WizardDataManagementContextReducer,
        { ...emptyState, ...initialState },
        getInitialState
    );

    return (
        <WizardDataManagementContext.Provider
            value={{
                wizardDataManagementContextState: wizardDataManagementContextState,
                wizardDataManagementContextDispatch: wizardDataManagementContextDispatch
            }}
        >
            {children}
        </WizardDataManagementContext.Provider>
    );
}

const emptyState: IWizardDataManagementContextState = {
    initialAssets: null,
    modifiedAssets: null,
    sources: []
};

const getInitialState = (initialState?: IWizardDataManagementContextState) => {
    const state: IWizardDataManagementContextState = {
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
};
