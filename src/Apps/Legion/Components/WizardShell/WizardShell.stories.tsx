import React from 'react';
import { ComponentStory } from '@storybook/react';
import WizardShell from './WizardShell';
import { IWizardShellProps } from './WizardShell.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { stepData, steps } from './WizardShellMockData';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/WizardShell',
    component: WizardShell,
    decorators: [getDefaultStoryDecorator<IWizardShellProps>(wrapperStyle)]
};

type WizardShellStory = ComponentStory<typeof WizardShell>;

const Template: WizardShellStory = (args) => {
    return (
        <WizardNavigationContextProvider
            initialState={{
                adapter: new MockDataManagementAdapter(),
                steps: steps,
                currentStep: 0,
                stepData: stepData
            }}
        >
            <WizardShell {...args} />
        </WizardNavigationContextProvider>
    );
};

export const Mock = Template.bind({}) as WizardShellStory;
Mock.args = {} as IWizardShellProps;
