import React from 'react';
import { IStepperWizardStep } from '../../../../../Components/StepperWizard/StepperWizard.types';
import { IDataManagementAdapter } from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import {
    IViewModelFromCooked,
    IViewTwinFromCooked
} from '../../../Components/WizardShell/Internal/TwinVerificationStep/TwinVerificationStep.types';
import { ICookAssets, IModelProperty, ITwinGraph } from '../../Interfaces';

// Context types
export interface IWizardNavigationContext {
    wizardNavigationContextState: IWizardNavigationContextState;
    wizardNavigationContextDispatch: React.Dispatch<WizardNavigationContextAction>;
}

export interface ConnectStepData {
    selectedSourceDatabase: string;
    selectedSourceTable: string;
    selectedSourceTwinIDColumn: string;
    selectedSourceTableType: string;
    selectedTargetDatabase: string;
    cookedAssets: ICookAssets;
}

export interface VerificationStepData {
    models: Array<IViewModelFromCooked>;
    twins: Array<IViewTwinFromCooked>;
    properties: Array<IModelProperty>;
}

export interface WizardStepData {
    // TODO: Add the data for each step when they are ready
    connectStepData: ConnectStepData;
    verificationStepData: VerificationStepData;
    relationshipStepData: ITwinGraph;
    finishStepData: ITwinGraph;
}

export interface IWizardNavigationContextState {
    adapter: IDataManagementAdapter;
    currentStep: number;
    steps: Array<IStepperWizardStep>;
    stepData?: WizardStepData;
    validity: {
        isValid: boolean;
    };
}

export enum WizardNavigationContextActionType {
    SET_STEPS = 'SET_STEPS',
    NAVIGATE_TO = 'NAVIGATE_TO',
    SET_STEP_VALIDITY = 'SET_STEP_VALIDITY',
    SET_CONNECT_STEP_DATA = 'SET_CONNECT_STEP_DATA',
    SET_VERIFICATION_STEP_DATA = 'SET_VERIFICATION_STEP_DATA',
    SET_MODEL_PROPERTY_SELECTED = 'SET_MODEL_PROPERTY_SELECTED',
    SET_SELECTED_TWINS = 'SET_SELECTED_TWINS'
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
              type: WizardNavigationContextActionType.SET_CONNECT_STEP_DATA;
              payload: ConnectStepData;
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_VERIFICATION_STEP_DATA;
          payload: VerificationStepData;
      }
    | {
          type: WizardNavigationContextActionType.SET_MODEL_PROPERTY_SELECTED;
          payload: {
              modelId: string;
              propertyId: string;
              checked: boolean;
          };
      }
    | {
          type: WizardNavigationContextActionType.SET_SELECTED_TWINS;
          payload: {
              selectedTwinIndices: Array<number>;
          };
      };

// Provider types
export interface IWizardNavigationContextProviderProps {
    initialState?: Partial<IWizardNavigationContextState>;
}
