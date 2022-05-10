import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import HeaderControlGroup from './HeaderControlGroup';
import { IHeaderControlGroupProps } from './HeaderControlGroup.types';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/HeaderControlGroup',
    component: HeaderControlGroup,
    decorators: [
        getDefaultStoryDecorator<IHeaderControlGroupProps>(wrapperStyle)
    ]
};

type HeaderControlGroupStory = ComponentStory<typeof HeaderControlGroup>;

const Template: HeaderControlGroupStory = (args) => {
    return <HeaderControlGroup {...args} />;
};

export const Base = Template.bind({}) as HeaderControlGroupStory;

Base.args = {};
