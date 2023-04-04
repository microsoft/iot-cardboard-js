import React from 'react';
import { ComponentStory } from '@storybook/react';
import TwinVerificationStep from './TwinVerificationStep';
import { ITwinVerificationStepProps } from './TwinVerificationStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { stepData, steps } from '../../WizardShellMockData';

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
