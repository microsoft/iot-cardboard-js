import React from 'react';
import { ComponentStory } from '@storybook/react';
import TwinVerificationStep from './TwinVerificationStep';
import { ITwinVerificationStepProps } from './TwinVerificationStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../WizardShellMockData';
import { WizardDataManagementContextProvider } from '../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';

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
        <WizardDataManagementContextProvider
            initialState={{
                ...DEFAULT_MOCK_DATA_MANAGEMENT_STATE
            }}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <TwinVerificationStep {...args} />
            </WizardNavigationContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export const Base = Template.bind({}) as TwinVerificationStepStory;
Base.args = {} as ITwinVerificationStepProps;
