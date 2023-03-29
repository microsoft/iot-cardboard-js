import React from 'react';
import { Stack } from '@fluentui/react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import SampleGraph from './SampleGraph';
import { ISampleGraphProps } from './SampleGraph.types';
import {
    GraphContextProvider,
    useGraphContext
} from '../../Apps/Legion/Contexts/GraphContext/GraphContext';

const wrapperStyle: any = {
    width: '100%',
    height: '100%',
    padding: 8,
    background: '#16203c',
    position: 'absolute'
};

export default {
    title: 'Components - OAT/Graph',
    component: SampleGraph,
    decorators: [
        getDefaultStoryDecorator<ISampleGraphProps<INodeData>>(wrapperStyle)
    ]
};

type SampleGraphStory = ComponentStory<typeof SampleGraph>;

const Template: SampleGraphStory = (args) => {
    return (
        <GraphContextProvider>
            <TemplateContent {...args} />
        </GraphContextProvider>
    );
};
const TemplateContent: SampleGraphStory = (args) => {
    const { graphState } = useGraphContext();
    return (
        <Stack
            styles={{
                root: { height: '100%' }
            }}
        >
            <div>Selected nodes: {graphState.selectedNodes.join(', ')}</div>
            <Stack.Item grow={1}>
                <SampleGraph {...args} />
            </Stack.Item>
        </Stack>
    );
};

interface INodeData {
    property1: string;
}

export const Base = Template.bind({}) as SampleGraphStory;
Base.args = {
    nodes: [
        {
            id: '1',
            label: 'Node 1',
            icon: 'CircleRing',
            color: 'red',
            data: { property1: 'something' }
        },
        {
            id: '2',
            label: 'Node 2',
            icon: 'CircleRing',
            color: 'blue',
            data: { property1: 'something' }
        },
        {
            id: '3',
            label: 'Node 3',
            icon: 'CircleRing',
            color: 'red',
            data: { property1: 'something' }
        },
        {
            id: '4',
            label: 'Node 4',
            icon: 'CircleRing',
            color: 'yellow',
            data: { property1: 'something' }
        },
        {
            id: '5',
            label: 'Node 5',
            icon: 'CircleRing',
            color: 'yellow',
            data: { property1: 'something' }
        }
    ]
} as ISampleGraphProps<INodeData>;
