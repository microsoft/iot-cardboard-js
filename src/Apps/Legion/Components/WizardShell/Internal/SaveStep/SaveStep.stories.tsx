import React from 'react';
import { ComponentStory } from '@storybook/react';
import SaveStep from './SaveStep';
import { ISaveStepProps } from './SaveStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { WizardDataContextProvider } from '../../../../Contexts/WizardDataContext/WizardDataContext';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../WizardShellMockData';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/WizardShell/SaveStep',
    component: SaveStep,
    decorators: [getDefaultStoryDecorator<ISaveStepProps>(wrapperStyle)]
};

type SaveStepStory = ComponentStory<typeof SaveStep>;

const Template: SaveStepStory = (args) => {
    return (
        <WizardDataContextProvider
            initialState={GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT('Dairy')}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <SaveStep {...args} />
            </WizardNavigationContextProvider>
        </WizardDataContextProvider>
    );
};

export const Base = Template.bind({}) as SaveStepStory;
Base.args = {} as ISaveStepProps;
