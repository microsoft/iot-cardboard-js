import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import JobsListWrapper from './JobsListWrapper';
import { IJobsListWrapperProps } from './JobsListWrapper.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/JobsListWrapper',
    component: JobsListWrapper,
    decorators: [getDefaultStoryDecorator<IJobsListWrapperProps>(wrapperStyle)]
};

type JobsListWrapperStory = ComponentStory<typeof JobsListWrapper>;

const Template: JobsListWrapperStory = (args) => {
    return <JobsListWrapper {...args} />;
};

export const Base = Template.bind({}) as JobsListWrapperStory;
Base.args = {} as IJobsListWrapperProps;
