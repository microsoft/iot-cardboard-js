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
}

export enum WizardNavigationContextActionType {
    SET_STEPS = 'SET_STEPS',
    NAVIGATE_TO = 'NAVIGATE_TO'
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
      };

// Provider types
export interface IWizardNavigationContextProviderProps {
    initialState?: Partial<IWizardNavigationContextState>;
}
