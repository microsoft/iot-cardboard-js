import React from 'react';
import { ComponentStory } from '@storybook/react';
import WizardShell from './WizardShell';
import { IWizardShellProps } from './WizardShell.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/WizardShell',
    component: WizardShell,
    decorators: [getDefaultStoryDecorator<IWizardShellProps>(wrapperStyle)]
};

type WizardShellStory = ComponentStory<typeof WizardShell>;

const Template: WizardShellStory = (args) => {
    return <WizardShell {...args} />;
};

export const Base = Template.bind({}) as WizardShellStory;
Base.args = {} as IWizardShellProps;
