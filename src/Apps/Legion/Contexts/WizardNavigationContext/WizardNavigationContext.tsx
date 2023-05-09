import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
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
            draft.currentStepProps = action.payload.initialProps;
            break;
        case WizardNavigationContextActionType.SET_PRIMARY_ACTION:
            draft.primaryAction = action.payload.buttonProps;
            break;
        case WizardNavigationContextActionType.SET_PRIMARY_ACTION_IS_DISABLED:
            if (draft.primaryAction) {
                draft.primaryAction.disabled = action.payload.isDisabled;
            }
            break;
        case WizardNavigationContextActionType.SET_SECONDARY_ACTIONS:
            draft.secondaryActions = action.payload.buttonProps;
            break;
        case WizardNavigationContextActionType.SET_SECONDARY_ACTION_BY_INDEX:
            if (
                draft.secondaryActions &&
                draft.secondaryActions[action.payload.index]
            ) {
                draft.secondaryActions[action.payload.index] =
                    action.payload.buttonProps;
            }
            break;
        case WizardNavigationContextActionType.SET_SECONDARY_ACTION_IS_DISABLED:
            if (
                draft.secondaryActions &&
                draft.secondaryActions[action.payload.index]
            ) {
                draft.secondaryActions[action.payload.index].disabled =
                    action.payload.isDisabled;
            }
            break;
    }
});

export function WizardNavigationContextProvider(
    props: React.PropsWithChildren<IWizardNavigationContextProviderProps>
) {
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
}

const emptyState: IWizardNavigationContextState = {
    steps: [],
    currentStep: -1
};

export const getInitialState = (
    initialState?: IWizardNavigationContextState
) => {
    const state: IWizardNavigationContextState = {
        steps: [],
        currentStep: -1,
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
};
