/**
 * This context is for managing the state and actions in the Wizard of the Legion app
 */
import produce from 'immer';
import React, { ReactNode, useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IWizardDataContext,
    IWizardDataContextProviderProps,
    IWizardDataContextState,
    WizardDataContextAction,
    WizardDataContextActionType
} from './WizardDataContext.types';

const debugLogging = false;
export const logDebugConsole = getDebugLogger(
    'WizardDataContext',
    debugLogging
);

export const WizardDataContext = React.createContext<IWizardDataContext>(null);
export const useWizardDataContext = () => useContext(WizardDataContext);

export const WizardDataContextReducer: (
    draft: IWizardDataContextState,
    action: WizardDataContextAction
) => IWizardDataContextState = produce(
    (draft: IWizardDataContextState, action: WizardDataContextAction) => {
        logDebugConsole(
            'info',
            `Updating WizardData context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case WizardDataContextActionType.SET_ENTITIES:
                draft.entities = action.payload.entities;
                break;
            case WizardDataContextActionType.SET_RELATIONSHIPS:
                draft.relationships = action.payload.relationships;
                break;
            case WizardDataContextActionType.SET_TYPES:
                draft.types = action.payload.types;
                break;
        }
    }
);

export const WizardDataContextProvider = React.memo(
    <T extends object>(
        props: IWizardDataContextProviderProps<T> & { children?: ReactNode }
    ) => {
        const { children, initialState } = props;

        const [state, dispatch] = useReducer(WizardDataContextReducer, {
            ...emptyState,
            ...initialState
        });

        logDebugConsole(
            'debug',
            'Mount WizardDataContextProvider. {state}',
            state
        );
        return (
            <WizardDataContext.Provider
                value={{
                    wizardDataDispatch: dispatch,
                    wizardDataState: state
                }}
            >
                {children}
            </WizardDataContext.Provider>
        );
    }
);

const emptyState: IWizardDataContextState = {
    entities: [],
    properties: [],
    relationships: [],
    types: []
};
