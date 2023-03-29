import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import SampleGraph from './SampleGraph';
import { ISampleGraphProps } from './SampleGraph.types';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { Stack } from '@fluentui/react';
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
    decorators: [getDefaultStoryDecorator<ISampleGraphProps>(wrapperStyle)]
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

export const Base = Template.bind({}) as SampleGraphStory;
Base.args = {} as ISampleGraphProps;
