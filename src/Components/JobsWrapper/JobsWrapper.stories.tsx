import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import JobsWrapper from './JobsWrapper';
import { IJobsWrapperProps } from './JobsWrapper.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/JobsWrapper',
    component: JobsWrapper,
    decorators: [getDefaultStoryDecorator<IJobsWrapperProps>(wrapperStyle)]
};

type JobsWrapperStory = ComponentStory<typeof JobsWrapper>;

const Template: JobsWrapperStory = (args) => {
    return <JobsWrapper {...args} />;
};

export const Base = Template.bind({}) as JobsWrapperStory;
Base.args = {} as IJobsWrapperProps;
