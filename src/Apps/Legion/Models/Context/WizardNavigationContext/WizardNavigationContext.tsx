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
            break;
        }
        case WizardNavigationContextActionType.SET_VERIFICATION_STEP_DATA:
            draft.stepData = {
                ...draft.stepData,
                verificationStepData: action.payload
            };
            break;
        case WizardNavigationContextActionType.SET_MODEL_PROPERTY_SELECTED:
            {
                const targetModelId = action.payload.modelId;
                const targetPropertyId = action.payload.propertyId;
                const isChecked = action.payload.checked;
                const targetModel = draft.stepData.verificationStepData.models.find(
                    (m) => m.id === targetModelId
                );
                if (isChecked) {
                    targetModel.selectedPropertyIds.push(targetPropertyId);
                } else {
                    targetModel.selectedPropertyIds.splice(
                        targetModel.selectedPropertyIds.findIndex(
                            (pId) => pId === targetPropertyId
                        ),
                        1
                    );
                }
            }
            break;
        case WizardNavigationContextActionType.SET_SELECTED_TWINS:
            {
                draft.stepData.verificationStepData.twins.forEach((t, idx) => {
                    if (action.payload.selectedTwinIndices.includes(idx)) {
                        t.isSelected = true;
                    } else {
                        t.isSelected = false;
                    }
                });
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
    adapter: null,
    steps: [],
    currentStep: -1,
    stepData: null,
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
