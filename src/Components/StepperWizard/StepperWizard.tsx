import React from 'react';
import './StepperWizard.scss';
import { Stepper } from './Components/Stepper';
import { IStepperWizardProps } from '../../Models/Constants/Interfaces';

const StepperWizard = ({
    steps,
    currentStepIndex,
    isNavigationDisabled = false
}: IStepperWizardProps) => {
    return (
        <div className={'cb-stepper-wizard'}>
            <Stepper
                steps={steps}
                currentStepIndex={currentStepIndex}
                isNavigationDisabled={isNavigationDisabled}
            />
        </div>
    );
};

export default StepperWizard;
