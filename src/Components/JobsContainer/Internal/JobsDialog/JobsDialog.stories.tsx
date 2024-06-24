import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import JobsDialog from './JobsDialog';
import { IJobsDialogProps } from './JobsDialog.types';
import MockAdapter from '../../../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components-Jobs/Jobs',
    component: JobsDialog,
    decorators: [getDefaultStoryDecorator<IJobsDialogProps>(wrapperStyle)]
};

type JobsDialogStory = ComponentStory<typeof JobsDialog>;

const Template: JobsDialogStory = (args) => {
    return <JobsDialog {...args} />;
};

export const Dialog = Template.bind({}) as JobsDialogStory;
Dialog.args = {
    adapter: new MockAdapter(),
    isOpen: true
} as IJobsDialogProps;
