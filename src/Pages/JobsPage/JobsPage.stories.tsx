import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import JobsPage from './JobsPage';
import { IJobsPageProps } from './JobsPage.types';
import MockAdapter from '../../Adapters/MockAdapter';

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

export const MockJobsPage = Template.bind({}) as JobsPageStory;
MockJobsPage.args = {
    adapter: new MockAdapter()
} as IJobsPageProps;
