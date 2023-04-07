import React from 'react';
import { IStepperWizardStep } from '../../../../Components/StepperWizard/StepperWizard.types';
import { IDataManagementAdapter } from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';

/** mapping of step to index for external components to deep link to the right step */
export enum WizardStepNumber {
    AddSource = 0,
    Modify = 1,
    Save = 2
}

// Context types
export interface IWizardNavigationContext {
    wizardNavigationContextState: IWizardNavigationContextState;
    wizardNavigationContextDispatch: React.Dispatch<WizardNavigationContextAction>;
}

export interface IWizardNavigationContextState {
    adapter: IDataManagementAdapter;
    currentStep: number;
    steps: Array<IStepperWizardStep>;
}

export enum WizardNavigationContextActionType {
    // General setters
    SET_STEPS = 'SET_STEPS',
    NAVIGATE_TO = 'NAVIGATE_TO'
}

export type WizardNavigationContextAction =
    // General setters
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
