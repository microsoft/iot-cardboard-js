export enum StepperWizardType {
    Vertical = 'vertical',
    Horizontal = 'horizontal'
}

export interface IStepperWizardStep {
    label: string;
    onClick?: () => void;
}

export interface IStepperWizardProps {
    type: StepperWizardType;
    steps: Array<IStepperWizardStep>;
    currentStepIndex?: number;
    isCurrentStepWithWarning?: boolean;
    isNavigationDisabled?: boolean;
    includeIcons?: boolean;
    isAllCompletedSuccessfully?: boolean; // to color the steps green
}
