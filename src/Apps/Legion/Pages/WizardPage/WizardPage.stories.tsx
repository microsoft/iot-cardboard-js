import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import WizardPage from './WizardPage';
import { IWizardPageProps } from './WizardPage.types';
import { AppDataContextProvider } from '../../Contexts/AppDataContext/AppDataContext';
import { AppNavigationContextProvider } from '../../Contexts/NavigationContext/AppNavigationContext';
import { GET_MOCK_APP_DATA_CONTEXT_STATE } from '../../Contexts/AppDataContext/AppDataContext.mock';
import { GET_MOCK_APP_NAV_CONTEXT_STATE } from '../../Contexts/NavigationContext/AppNavigationContext.mock';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Pages/WizardPage',
    component: WizardPage,
    decorators: [getDefaultStoryDecorator<IWizardPageProps>(wrapperStyle)]
};

type WizardPageStory = ComponentStory<typeof WizardPage>;

const Template: WizardPageStory = (args) => {
    return (
        <AppDataContextProvider
            initialState={GET_MOCK_APP_DATA_CONTEXT_STATE()}
        >
            <AppNavigationContextProvider
                initialState={GET_MOCK_APP_NAV_CONTEXT_STATE()}
            >
                <WizardPage {...args} />
            </AppNavigationContextProvider>
        </AppDataContextProvider>
    );
};

export const Base = Template.bind({}) as WizardPageStory;
Base.args = {} as IWizardPageProps;
