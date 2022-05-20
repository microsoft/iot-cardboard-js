import React from 'react';
import './StepperWizard.scss';
import { Stepper } from './Internal/Stepper';
import { IStepperWizardProps } from './StepperWizard.types';

const StepperWizard = ({
    type,
    steps,
    currentStepIndex,
    isCurrentStepWithWarning = false,
    isNavigationDisabled = false,
    includeIcons = false,
    isAllCompletedSuccessfully = false
}: IStepperWizardProps) => {
    return (
        <div className={`cb-stepper-wizard cb-stepper-${type}`}>
            <Stepper
                type={type}
                steps={steps}
                currentStepIndex={currentStepIndex}
                isCurrentStepWithWarning={isCurrentStepWithWarning}
                isNavigationDisabled={isNavigationDisabled}
                includeIcons={includeIcons}
                isAllCompletedSuccessfully={isAllCompletedSuccessfully}
            />
        </div>
    );
};

export default StepperWizard;
