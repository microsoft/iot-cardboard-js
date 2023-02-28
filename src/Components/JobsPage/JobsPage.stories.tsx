import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import JobsPage from './JobsPage';
import { IJobsPageProps } from './JobsPage.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Pages/JobsPage',
    component: JobsPage,
    decorators: [getDefaultStoryDecorator<IJobsPageProps>(wrapperStyle)]
};

type JobsPageStory = ComponentStory<typeof JobsPage>;

const Template: JobsPageStory = (args) => {
    return <JobsPage {...args} />;
};

export const Base = Template.bind({}) as JobsPageStory;
Base.args = {} as IJobsPageProps;
