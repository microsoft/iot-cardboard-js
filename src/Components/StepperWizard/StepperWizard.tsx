import React from 'react';
import './StepperWizard.scss';
import { Stepper } from './Components/Stepper';

export interface IStepperWizardStep {
    label: string;
    onClick?: () => void;
}

interface StepperWizardProps {
    steps: Array<IStepperWizardStep>;
    currentStepIndex?: number;
}

const StepperWizard = ({ steps, currentStepIndex }: StepperWizardProps) => {
    return (
        <div className={'cb-stepper-wizard'}>
            <Stepper steps={steps} currentStepIndex={currentStepIndex} />
        </div>
    );
};

export default StepperWizard;
