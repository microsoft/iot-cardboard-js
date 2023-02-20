import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import JobsDialog from './JobsDialog';
import { IJobsDialogProps } from './JobsDialog.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Jobs/JobsDialog',
    component: JobsDialog,
    decorators: [getDefaultStoryDecorator<IJobsDialogProps>(wrapperStyle)]
};

type JobsDialogStory = ComponentStory<typeof JobsDialog>;

const Template: JobsDialogStory = (args) => {
    return <JobsDialog {...args} />;
};

export const Base = Template.bind({}) as JobsDialogStory;
Base.args = {} as IJobsDialogProps;
