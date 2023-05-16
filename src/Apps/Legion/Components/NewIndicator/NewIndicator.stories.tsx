import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import NewIndicator from './NewIndicator';
import { INewIndicatorProps } from './NewIndicator.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/NewIndicator',
    component: NewIndicator,
    decorators: [getDefaultStoryDecorator<INewIndicatorProps>(wrapperStyle)]
};

type NewIndicatorStory = ComponentStory<typeof NewIndicator>;

const Template: NewIndicatorStory = (args) => {
    return <NewIndicator {...args} />;
};

export const Base = Template.bind({}) as NewIndicatorStory;
Base.args = {} as INewIndicatorProps;
