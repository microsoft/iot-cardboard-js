import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import GraphViewerControls from './GraphViewerControls';
import { IGraphViewerControlsProps } from './GraphViewerControls.types';
import { OatGraphContextProvider } from '../../../../Models/Context/OatGraphContext/OatGraphContext';
import { ReactFlowProvider } from 'react-flow-renderer';

const wrapperStyle = { width: '100%', height: '100px', padding: 8 };

export default {
    title: 'Components - OAT/OATGraphViewer/Internals/GraphViewerControls',
    component: GraphViewerControls,
    decorators: [
        getDefaultStoryDecorator<IGraphViewerControlsProps>(wrapperStyle)
    ]
};

type GraphViewerControlsStory = ComponentStory<typeof GraphViewerControls>;

const Template: GraphViewerControlsStory = (args) => {
    return (
        <ReactFlowProvider>
            <OatGraphContextProvider initialState={{ isLegendVisible: false }}>
                <GraphViewerControls {...args} />
            </OatGraphContextProvider>
        </ReactFlowProvider>
    );
};

export const Base = Template.bind({}) as GraphViewerControlsStory;
Base.args = {} as IGraphViewerControlsProps;
