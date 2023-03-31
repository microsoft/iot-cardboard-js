import React from 'react';
import { IStepperWizardStep } from '../../../../../Components/StepperWizard/StepperWizard.types';
import { ICookAssets, ITwinGraph } from '../../Interfaces';

// Context types
export interface IWizardNavigationContext {
    wizardNavigationContextState: IWizardNavigationContextState;
    wizardNavigationContextDispatch: React.Dispatch<WizardNavigationContextAction>;
}

// TODO: Bring this back if needed
// export interface ConnectStepData {
//     twins: ITwin[];
//     models: IModel[];
//     properties: IModelProperty[];
// }

export interface VerificationStepData extends ICookAssets {
    modelSelectedProperties: Record<string, boolean>;
    twinSelectedProperties: Record<string, boolean>;
}

export interface WizardStepData {
    // TODO: Add the data for each step when they are ready
    connectStepData: ICookAssets;
    verificationStepData: VerificationStepData;
    relationshipStepData: ITwinGraph;
    finishStepData: ITwinGraph;
}

export interface IWizardNavigationContextState {
    currentStep: number;
    steps: Array<IStepperWizardStep>;
    stepData?: WizardStepData;
}

export enum WizardNavigationContextActionType {
    SET_STEPS = 'SET_STEPS',
    NAVIGATE_TO = 'NAVIGATE_TO',
    SET_VERIFICATION_STEP_DATA = 'SET_VERIFICATION_STEP_DATA',
    SET_MODEL_PROPERTY_SELECTED = 'SET_MODEL_PROPERTY_SELECTED'
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
          type: WizardNavigationContextActionType.SET_VERIFICATION_STEP_DATA;
          payload: VerificationStepData;
      }
    | {
          type: WizardNavigationContextActionType.SET_MODEL_PROPERTY_SELECTED;
          payload: {
              propertyId: string;
              checked: boolean;
          };
      };

// Provider types
export interface IWizardNavigationContextProviderProps {
    initialState?: Partial<IWizardNavigationContextState>;
}
