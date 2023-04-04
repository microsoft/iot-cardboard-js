import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../../Models/Services/Utils';
import {
    IWizardNavigationContext,
    IWizardNavigationContextProviderProps,
    IWizardNavigationContextState,
    WizardNavigationContextAction,
    WizardNavigationContextActionType
} from './WizardNavigationContext.types';

export const WizardNavigationContext = React.createContext<IWizardNavigationContext>(
    null
);
export const useWizardNavigationContext = () =>
    useContext(WizardNavigationContext);

const debugLogging = false;
const logDebugConsole = getDebugLogger('NavigationContext', debugLogging);

export const NavigationContextReducer: (
    draft: IWizardNavigationContextState,
    action: WizardNavigationContextAction
) => any = produce((draft, action) => {
    logDebugConsole(
        'info',
        `Updating Navigation context ${action.type} with payload: `,
        action.payload
    );
    switch (action.type) {
        case WizardNavigationContextActionType.SET_STEPS:
            draft.steps = action.payload.steps;
            break;
        case WizardNavigationContextActionType.NAVIGATE_TO:
            draft.currentStep = action.payload.stepNumber;
            break;
        case WizardNavigationContextActionType.SET_STEP_VALIDITY: {
            draft.validity.isValid = action.payload.isValid;
        }
    }
});

export const WizardNavigationContextProvider: React.FC<IWizardNavigationContextProviderProps> = (
    props
) => {
    const { children, initialState } = props;

    const [
        wizardNavigationContextState,
        wizardNavigationContextDispatch
    ] = useReducer(
        NavigationContextReducer,
        { ...emptyState, ...initialState },
        getInitialState
    );

    return (
        <WizardNavigationContext.Provider
            value={{
                wizardNavigationContextState: wizardNavigationContextState,
                wizardNavigationContextDispatch: wizardNavigationContextDispatch
            }}
        >
            {children}
        </WizardNavigationContext.Provider>
    );
};

const emptyState: IWizardNavigationContextState = {
    steps: [],
    currentStep: -1,
    validity: {
        isValid: true
    }
};

export const getInitialState = (
    initialState?: IWizardNavigationContextState
) => {
    const state: IWizardNavigationContextState = {
        ...emptyState,
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
};
