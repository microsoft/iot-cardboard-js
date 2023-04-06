import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import WizardPage from './WizardPage';
import { IWizardPageProps } from './WizardPage.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/WizardPage',
    component: WizardPage,
    decorators: [getDefaultStoryDecorator<IWizardPageProps>(wrapperStyle)]
};

type WizardPageStory = ComponentStory<typeof WizardPage>;

const Template: WizardPageStory = (args) => {
    return <WizardPage {...args} />;
};

export const Base = Template.bind({}) as WizardPageStory;
Base.args = {} as IWizardPageProps;
