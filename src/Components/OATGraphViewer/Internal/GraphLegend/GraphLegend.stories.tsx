import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import GraphLegend from './GraphLegend';
import { IGraphLegendProps } from './GraphLegend.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/GraphLegend',
    component: GraphLegend,
    decorators: [getDefaultStoryDecorator<IGraphLegendProps>(wrapperStyle)]
};

type GraphLegendStory = ComponentStory<typeof GraphLegend>;

const Template: GraphLegendStory = (args) => {
    return <GraphLegend {...args} />;
};

export const Base = Template.bind({}) as GraphLegendStory;
Base.args = {} as IGraphLegendProps;
