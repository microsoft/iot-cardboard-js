import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import GraphViewerControls from './GraphViewerControls';
import { IGraphViewerControlsProps } from './GraphViewerControls.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/GraphViewerControls',
    component: GraphViewerControls,
    decorators: [
        getDefaultStoryDecorator<IGraphViewerControlsProps>(wrapperStyle)
    ]
};

type GraphViewerControlsStory = ComponentStory<typeof GraphViewerControls>;

const Template: GraphViewerControlsStory = (args) => {
    return <GraphViewerControls {...args} />;
};

export const Base = Template.bind({}) as GraphViewerControlsStory;
Base.args = {} as IGraphViewerControlsProps;
