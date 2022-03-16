import React from 'react';
import { IStepperWizardStep } from '../../Models/Constants/Interfaces';
import StepperWizard from './StepperWizard';

export default {
    title: 'Components/StepperWizard',
    component: StepperWizard,
};

export const VerticalStepperWizard = (args) => {
    const steps: Array<IStepperWizardStep> = [
        {
            label: 'Step-1',
            onClick: () => {
                console.log('Step-1 clicked!');
            },
        },
        {
            label: 'Step-2',
            onClick: () => {
                console.log('Step-2 clicked!');
            },
        },
        {
            label: 'Step-3',
            onClick: () => {
                console.log('Step-3 clicked!');
            },
        },
    ];
    return (
        <div
            style={{
                height: '400px',
                width: 'fit-content',
            }}
        >
            <StepperWizard
                steps={steps}
                currentStepIndex={args.currentStepIndex}
            />
        </div>
    );
};

VerticalStepperWizard.argTypes = {
    currentStepIndex: {
        control: {
            type: 'radio',
            options: [0, 1, 2],
        },
        defaultValue: 1,
    },
};
