import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesBuilder from './TimeSeriesBuilder';
import { ITimeSeriesBuilderProps } from './TimeSeriesBuilder.types';
import MockAdapter from '../../../../Adapters/MockAdapter';
import { DataHistoryExplorerContext } from '../../DataHistoryExplorer';

const wrapperStyle = { width: '400px', height: '600px', padding: 8 };

export default {
    title: 'Components/TimeSeriesBuilder',
    component: TimeSeriesBuilder,
    decorators: [
        getDefaultStoryDecorator<ITimeSeriesBuilderProps>(wrapperStyle)
    ]
};

type TimeSeriesBuilderStory = ComponentStory<typeof TimeSeriesBuilder>;

const Template: TimeSeriesBuilderStory = (args) => {
    return (
        <DataHistoryExplorerContext.Provider
            value={{ adapter: new MockAdapter() }}
        >
            <TimeSeriesBuilder {...args} />
        </DataHistoryExplorerContext.Provider>
    );
};

export const Mock = Template.bind({}) as TimeSeriesBuilderStory;
Mock.args = {
    onTimeSeriesTwinListChange(timeSeriesTwinList) {
        console.log(timeSeriesTwinList);
    }
} as ITimeSeriesBuilderProps;
