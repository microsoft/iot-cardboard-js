import React from 'react';
import { ComponentStory } from '@storybook/react';
import TwinVerificationStep from './TwinVerificationStep';
import { ITwinVerificationStepProps } from './TwinVerificationStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { wizardData, steps } from '../../WizardShellMockData';
import { DataManagementContextProvider } from '../../../../Contexts/DataManagementContext/DataManagementContext';

const wrapperStyle = { width: '100%', height: '600px' };

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
        <DataManagementContextProvider
            initialState={{
                ...wizardData
            }}
        >
            <WizardNavigationContextProvider
                initialState={{
                    steps: steps,
                    currentStep: 0
                }}
            >
                <TwinVerificationStep {...args} />
            </WizardNavigationContextProvider>
        </DataManagementContextProvider>
    );
};

export const Base = Template.bind({}) as TwinVerificationStepStory;
Base.args = {} as ITwinVerificationStepProps;
