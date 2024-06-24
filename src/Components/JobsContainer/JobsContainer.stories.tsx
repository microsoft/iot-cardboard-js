import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import JobsContainer from './JobsContainer';
import { IJobsContainerProps } from './JobsContainer.types';
import MockAdapter from '../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components-Jobs/Jobs',
    component: JobsContainer,
    decorators: [getDefaultStoryDecorator<IJobsContainerProps>(wrapperStyle)]
};

type JobsContainerStory = ComponentStory<typeof JobsContainer>;

const Template: JobsContainerStory = (args) => {
    return <JobsContainer {...args} />;
};

export const Container = Template.bind({}) as JobsContainerStory;
Container.args = { adapter: new MockAdapter() } as IJobsContainerProps;
