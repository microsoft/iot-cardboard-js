import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import GraphAutoLayout from './GraphAutoLayout';
import { IGraphAutoLayoutProps } from './GraphAutoLayout.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/GraphAutoLayout',
    component: GraphAutoLayout,
    decorators: [getDefaultStoryDecorator<IGraphAutoLayoutProps>(wrapperStyle)]
};

type GraphAutoLayoutStory = ComponentStory<typeof GraphAutoLayout>;

const Template: GraphAutoLayoutStory = (args) => {
    return <GraphAutoLayout {...args} />;
};

export const Base = Template.bind({}) as GraphAutoLayoutStory;
Base.args = {} as IGraphAutoLayoutProps;
