import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesViewer from './TimeSeriesViewer';
import { ITimeSeriesViewerProps } from './TimeSeriesViewer.types';
import MockAdapter from '../../../../Adapters/MockAdapter';
import { DataHistoryExplorerContext } from '../../DataHistoryExplorer';

const wrapperStyle = { width: '600px', height: '400px' };

export default {
    title: 'Components/TimeSeriesViewer',
    component: TimeSeriesViewer,
    decorators: [getDefaultStoryDecorator<ITimeSeriesViewerProps>(wrapperStyle)]
};

type TimeSeriesViewerStory = ComponentStory<typeof TimeSeriesViewer>;

const Template: TimeSeriesViewerStory = (args) => {
    return (
        <DataHistoryExplorerContext.Provider
            value={{ adapter: new MockAdapter() }}
        >
            <TimeSeriesViewer {...args} />{' '}
        </DataHistoryExplorerContext.Provider>
    );
};

export const Mock = Template.bind({}) as TimeSeriesViewerStory;
Mock.args = {
    timeSeriesTwinList: [
        {
            twinId: 'PasteurizationMachine_A01',
            twinPropertyName: 'Inflow',
            label: 'PasteurizationMachine_A01 Inflow'
        },
        {
            twinId: 'PasteurizationMachine_A02',
            twinPropertyName: 'Inflow'
        }
    ]
} as ITimeSeriesViewerProps;
