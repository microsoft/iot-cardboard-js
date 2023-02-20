import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import JobsContainer from './JobsContainer';
import { IJobsContainerProps } from './JobsContainer.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Jobs/JobsContainer',
    component: JobsContainer,
    decorators: [getDefaultStoryDecorator<IJobsContainerProps>(wrapperStyle)]
};

type JobsContainerStory = ComponentStory<typeof JobsContainer>;

const Template: JobsContainerStory = (args) => {
    return <JobsContainer {...args} />;
};

export const Base = Template.bind({}) as JobsContainerStory;
Base.args = {} as IJobsContainerProps;
