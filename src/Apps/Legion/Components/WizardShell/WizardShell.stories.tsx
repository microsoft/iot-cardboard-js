import React from 'react';
import { ComponentStory } from '@storybook/react';
import WizardShell from './WizardShell';
import { IWizardShellProps } from './WizardShell.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { wizardData, steps } from './WizardShellMockData';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import { DataManagementContextProvider } from '../../Contexts/DataManagementContext/DataManagementContext';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/Apps/Legion/WizardShell',
    component: WizardShell,
    decorators: [getDefaultStoryDecorator<IWizardShellProps>(wrapperStyle)]
};

type WizardShellStory = ComponentStory<typeof WizardShell>;

const Template: WizardShellStory = (args) => {
    return (
        <DataManagementContextProvider
            initialState={{
                ...wizardData
            }}
        >
            <WizardNavigationContextProvider
                initialState={{
                    adapter: new MockDataManagementAdapter(),
                    steps: steps,
                    currentStep: 0
                }}
            >
                <WizardShell {...args} />
            </WizardNavigationContextProvider>
        </DataManagementContextProvider>
    );
};

export const Mock = Template.bind({}) as WizardShellStory;
Mock.args = {} as IWizardShellProps;
