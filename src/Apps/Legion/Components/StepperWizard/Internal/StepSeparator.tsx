import React from 'react';
import { IStepSeparatorProps } from './StepSeparator.types';

export const StepSeparator: React.FC<IStepSeparatorProps> = ({
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
