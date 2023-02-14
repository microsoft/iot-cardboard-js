import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import Jobs from './Jobs';
import { IJobsProps } from './Jobs.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Jobs',
    component: Jobs,
    decorators: [getDefaultStoryDecorator<IJobsProps>(wrapperStyle)]
};

type JobsStory = ComponentStory<typeof Jobs>;

const Template: JobsStory = (args) => {
    return <Jobs {...args} />;
};

export const Base = Template.bind({}) as JobsStory;
Base.args = {} as IJobsProps;
