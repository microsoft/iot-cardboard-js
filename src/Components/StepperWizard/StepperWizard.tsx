import React from 'react';
import './StepperWizard.scss';
import { Stepper } from './Components/Stepper';
import { IStepperWizardProps } from '../../Models/Constants/Interfaces';

const StepperWizard = ({ steps, currentStepIndex }: IStepperWizardProps) => {
    return (
        <div className={'cb-stepper-wizard'}>
            <Stepper steps={steps} currentStepIndex={currentStepIndex} />
        </div>
    );
};

export default StepperWizard;
