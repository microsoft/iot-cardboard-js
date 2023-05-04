import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import ConsumeShell from './ConsumeShell';
import { IConsumeShellProps } from './ConsumeShell.types';
import { AppDataContextProvider } from '../../Contexts/AppDataContext/AppDataContext';
import { GET_MOCK_APP_DATA_CONTEXT_STATE } from '../../Contexts/AppDataContext/AppDataContext.mock';
import { WizardDataContextProvider } from '../../Contexts/WizardDataContext/WizardDataContext';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../WizardShell/WizardShellMockData';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Apps/Legion/ConsumeShell',
    component: ConsumeShell,
    decorators: [getDefaultStoryDecorator<IConsumeShellProps>(wrapperStyle)]
};

type ConsumeShellStory = ComponentStory<typeof ConsumeShell>;

const Template: ConsumeShellStory = (args) => {
    return (
        <AppDataContextProvider
            initialState={GET_MOCK_APP_DATA_CONTEXT_STATE()}
        >
            <WizardDataContextProvider
                initialState={GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT('Dairy')}
            >
                <WizardNavigationContextProvider
                    initialState={WIZARD_NAVIGATION_MOCK_DATA}
                >
                    <ConsumeShell {...args} />
                </WizardNavigationContextProvider>
            </WizardDataContextProvider>
        </AppDataContextProvider>
    );
};

export const Base = Template.bind({}) as ConsumeShellStory;
Base.args = {} as IConsumeShellProps;
