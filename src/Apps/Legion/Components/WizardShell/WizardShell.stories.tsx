import React from 'react';
import { ComponentStory } from '@storybook/react';
import WizardShell from './WizardShell';
import { IWizardShellProps } from './WizardShell.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA
} from './WizardShellMockData';
import { WizardDataContextProvider } from '../../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataManagementContextProvider } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import { DEFAULT_MOCK_DATA_MANAGEMENT_STATE } from './WizardShellMockData';
import { AppDataContextProvider } from '../../Contexts/AppDataContext/AppDataContext';
import { GET_MOCK_APP_DATA_CONTEXT_STATE } from '../../Contexts/AppDataContext/AppDataContext.mock';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Apps/Legion/WizardShell',
    component: WizardShell,
    decorators: [getDefaultStoryDecorator<IWizardShellProps>(wrapperStyle)]
};

type WizardShellStory = ComponentStory<typeof WizardShell>;

const Template: WizardShellStory = (args) => {
    return (
        <AppDataContextProvider
            initialState={GET_MOCK_APP_DATA_CONTEXT_STATE()}
        >
            // DATA MANAGEMENT PROVIDER IS TEMPORARY HERE, WILL REMOVE WHEN DATA
            SOURCE STEP IS UPDATED
            <WizardDataManagementContextProvider
                initialState={DEFAULT_MOCK_DATA_MANAGEMENT_STATE}
            >
                <WizardDataContextProvider
                    initialState={GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT('Dairy')}
                >
                    <WizardNavigationContextProvider
                        initialState={WIZARD_NAVIGATION_MOCK_DATA}
                    >
                        <WizardShell {...args} />
                    </WizardNavigationContextProvider>
                </WizardDataContextProvider>
            </WizardDataManagementContextProvider>
        </AppDataContextProvider>
    );
};

export const Mock = Template.bind({}) as WizardShellStory;
Mock.args = {} as IWizardShellProps;
