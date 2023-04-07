import React from 'react';
import { ComponentStory } from '@storybook/react';
import WizardShell from './WizardShell';
import { IWizardShellProps } from './WizardShell.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    WIZARD_NAVIGATION_MOCK_DATA
} from './WizardShellMockData';
import { WizardDataManagementContextProvider } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/Apps/Legion/WizardShell',
    component: WizardShell,
    decorators: [getDefaultStoryDecorator<IWizardShellProps>(wrapperStyle)]
};

type WizardShellStory = ComponentStory<typeof WizardShell>;

const Template: WizardShellStory = (args) => {
    return (
        <WizardDataManagementContextProvider
            initialState={{
                ...DEFAULT_MOCK_DATA_MANAGEMENT_STATE
            }}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <WizardShell {...args} />
            </WizardNavigationContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export const Mock = Template.bind({}) as WizardShellStory;
Mock.args = {} as IWizardShellProps;
