import React from 'react';
import { StepperWizardType } from '../StepperWizard.types';

interface ISeparator {
    orientation: StepperWizardType;
    isFinished?: boolean;
    isAllCompletedSuccessfully: boolean;
}

export const StepSeparator: React.FC<ISeparator> = ({
    orientation,
    isFinished,
    isAllCompletedSuccessfully
}) => {
    return (
        <div
            className={`cb-stepper-wizard-stepper-separator cb-stepper-${orientation}`}
        >
            <div
                className={`cb-stepper-wizard-stepper-separator-line ${
                    isFinished ? 'cb-step-is-finished' : ''
                } ${
                    isAllCompletedSuccessfully ? 'cb-green-line' : ''
                } cb-stepper-${orientation}`}
            ></div>
        </div>
    );
};
