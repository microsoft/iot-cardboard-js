import React from 'react';
import { IStepperWizardStep } from '../../../../Components/StepperWizard/StepperWizard.types';
import { ModifyPivotKeys } from '../../Components/WizardShell/Internal/ModifyStep/ModifyStep.types';

/** mapping of step to index for external components to deep link to the right step */
export enum WizardStepNumber {
    AddSource = 0,
    Modify = 1,
    Save = 2
}

export interface IWizardAction {
    onClick: () => void;
    disabled: boolean;
    text?: string;
    iconName?: string;
}

// Context types
export interface IWizardNavigationContext {
    wizardNavigationContextState: IWizardNavigationContextState;
    wizardNavigationContextDispatch: React.Dispatch<WizardNavigationContextAction>;
}

// Additional properties to set the initial values for the current step in navigation
export type NavigateToPayload = {
    stepNumber: WizardStepNumber;
};
export type NavigateToModifyPayload = {
    stepNumber: WizardStepNumber.Modify;
    showDiagram: boolean;
    selectedPivotKey: ModifyPivotKeys;
};

export interface IWizardNavigationContextState {
    currentStep: number;
    currentStepProps?: Record<string, any>;
    steps: Array<IStepperWizardStep>;
    primaryAction?: IWizardAction;
    secondaryActions?: IWizardAction[];
}

export enum WizardNavigationContextActionType {
    // General setters
    SET_STEPS = 'SET_STEPS',
    NAVIGATE_TO = 'NAVIGATE_TO',
    // Button actions
    SET_PRIMARY_ACTION = 'SET_PRIMARY_ACTION',
    SET_SECONDARY_ACTIONS = 'SET_SECONDARY_ACTIONS',
    SET_SECONDARY_ACTION_BY_INDEX = 'SET_SECONDARY_ACTION_BY_INDEX',
    SET_PRIMARY_ACTION_IS_DISABLED = 'SET_PRIMARY_ACTION_IS_DISABLED',
    SET_SECONDARY_ACTION_IS_DISABLED = 'SET_SECONDARY_ACTION_IS_DISABLED'
}

export type WizardNavigationContextAction =
    // General setters
    | {
          type: WizardNavigationContextActionType.NAVIGATE_TO;
          payload: NavigateToPayload | NavigateToModifyPayload;
      }
    | {
          type: WizardNavigationContextActionType.SET_STEPS;
          payload: {
              steps: Array<IStepperWizardStep>;
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_PRIMARY_ACTION;
          payload: {
              buttonProps: IWizardAction;
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_PRIMARY_ACTION_IS_DISABLED;
          payload: {
              isDisabled: boolean;
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_SECONDARY_ACTIONS;
          payload: {
              buttonProps: IWizardAction[];
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_SECONDARY_ACTION_BY_INDEX;
          payload: {
              buttonProps: IWizardAction;
              index: number;
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_SECONDARY_ACTION_IS_DISABLED;
          payload: {
              index: number;
              isDisabled: boolean;
          };
      };

// Provider types
export interface IWizardNavigationContextProviderProps {
    initialState?: Partial<IWizardNavigationContextState>;
}
