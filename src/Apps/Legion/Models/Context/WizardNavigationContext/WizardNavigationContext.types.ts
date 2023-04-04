import React from 'react';
import { IStepperWizardStep } from '../../../../../Components/StepperWizard/StepperWizard.types';

// Context types
export interface IWizardNavigationContext {
    wizardNavigationContextState: IWizardNavigationContextState;
    wizardNavigationContextDispatch: React.Dispatch<WizardNavigationContextAction>;
}

export interface IWizardNavigationContextState {
    steps: Array<IStepperWizardStep>;
    currentStep: number;
    validity: {
        isValid: boolean;
    };
}

export enum WizardNavigationContextActionType {
    SET_STEPS = 'SET_STEPS',
    NAVIGATE_TO = 'NAVIGATE_TO',
    SET_STEP_VALIDITY = 'SET_STEP_VALIDITY'
}

export type WizardNavigationContextAction =
    | {
          type: WizardNavigationContextActionType.NAVIGATE_TO;
          payload: {
              stepNumber: number;
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_STEPS;
          payload: {
              steps: Array<IStepperWizardStep>;
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_STEP_VALIDITY;
          payload: {
              isValid: boolean;
          };
      };

// Provider types
export interface IWizardNavigationContextProviderProps {
    initialState?: Partial<IWizardNavigationContextState>;
}
