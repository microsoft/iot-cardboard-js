import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import SampleGraph from './SampleGraph';
import { ISampleGraphProps } from './SampleGraph.types';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../Models/Context/OatPageContext/OatPageContext.mock';
import { Stack } from '@fluentui/react';

const wrapperStyle = {
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
        <OatPageContextProvider
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')]
            }}
            disableLocalStorage={true}
        >
            <TemplateContent {...args} />
        </OatPageContextProvider>
    );
};
const TemplateContent: SampleGraphStory = (args) => {
    const { oatPageState } = useOatPageContext();
    return (
        <Stack
            styles={{
                root: { height: '100%' }
            }}
        >
            <div>Selected item: {JSON.stringify(oatPageState.selection)}</div>
            <Stack.Item grow={1}>
                <SampleGraph {...args} />
            </Stack.Item>
        </Stack>
    );
};

export const Base = Template.bind({}) as SampleGraphStory;
Base.args = {} as ISampleGraphProps;
