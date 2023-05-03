import React from 'react';
import { ComponentStory } from '@storybook/react';
import ModifyStep from './ModifyStep';
import { IModifyStepProps } from './ModifyStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { WizardDataContextProvider } from '../../../../Contexts/WizardDataContext/WizardDataContext';
import {
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../WizardShellMockData';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/WizardShell/ModifyStep',
    component: ModifyStep,
    decorators: [getDefaultStoryDecorator<IModifyStepProps>(wrapperStyle)]
};

type ModifyStepStory = ComponentStory<typeof ModifyStep>;

const Template: ModifyStepStory = (args) => {
    return (
        <WizardDataContextProvider
            initialState={GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT()}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <ModifyStep {...args} />
            </WizardNavigationContextProvider>
        </WizardDataContextProvider>
    );
};

export const Base = Template.bind({}) as ModifyStepStory;
Base.args = {} as IModifyStepProps;
