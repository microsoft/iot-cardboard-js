import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import JobsList from './JobsList';
import { IJobsListProps } from './JobsList.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components-Jobs/Jobs',
    component: JobsList,
    decorators: [getDefaultStoryDecorator<IJobsListProps>(wrapperStyle)]
};

type JobsListStory = ComponentStory<typeof JobsList>;

const Template: JobsListStory = (args) => {
    return <JobsList {...args} />;
};

export const Default = Template.bind({}) as JobsListStory;
Default.args = {} as IJobsListProps;
