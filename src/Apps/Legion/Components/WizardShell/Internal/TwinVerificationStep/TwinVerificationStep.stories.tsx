import React from 'react';
import { ComponentStory } from '@storybook/react';
import TwinVerificationStep from './TwinVerificationStep';
import { ITwinVerificationStepProps } from './TwinVerificationStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { IStepperWizardStep } from '../../../StepperWizard/StepperWizard.types';
import { WizardNavigationContextProvider } from '../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { WizardStepData } from '../../../../Models/Context/WizardNavigationContext/WizardNavigationContext.types';
import {
    mockModels,
    mockProperties,
    mockTwins
} from './TwinVerificationMockData';
import { ICookAssets } from '../../../../Models/Interfaces';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/WizardShell/TwinVerificationStep',
    component: TwinVerificationStep,
    decorators: [
        getDefaultStoryDecorator<ITwinVerificationStepProps>(wrapperStyle)
    ]
};

type TwinVerificationStepStory = ComponentStory<typeof TwinVerificationStep>;

const Template: TwinVerificationStepStory = (args) => {
    const steps: IStepperWizardStep[] = [
        {
            label: 'Connect'
        },
        {
            label: 'Verify'
        },
        {
            label: 'Build'
        },
        {
            label: 'Finish'
        }
    ];

    const cookedData: ICookAssets = {
        models: mockModels,
        properties: mockProperties,
        twins: mockTwins
    };

    const stepData: WizardStepData = {
        connectStepData: {
            models: null,
            properties: null,
            twins: null
        },
        verificationStepData: {
            ...cookedData,
            modelSelectedProperties: null,
            twinSelectedProperties: null
        },
        relationshipStepData: null,
        finishStepData: null
    };

    return (
        <WizardNavigationContextProvider
            initialState={{
                steps: steps,
                currentStep: 0,
                stepData: stepData
            }}
        >
            <TwinVerificationStep {...args} />
        </WizardNavigationContextProvider>
    );
};

export const Base = Template.bind({}) as TwinVerificationStepStory;
Base.args = {} as ITwinVerificationStepProps;
