import React from 'react';

interface ISeparator {
    isFinished?: boolean;
}

export const StepSeparator: React.FC<ISeparator> = ({ isFinished }) => {
    return (
        <div className={'cb-stepper-wizard-stepper-separator'}>
            <div
                className={`cb-stepper-wizard-stepper-separator-line ${
                    isFinished ? 'cb-step-is-finished' : ''
                }`}
            >
            </div>
        </div>
    );
};
