import React from 'react';
import { ComponentStory } from '@storybook/react';
import TimeSeriesChart from './TimeSeriesChart';
import { ITimeSeriesChartProps } from './TimeSeriesChart.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import { QuickTimeSpans } from '../../../../../../Models/Constants/Constants';
import { QuickTimeSpanKey } from '../../../../../../Models/Constants/Enums';
import DataHistoryExplorerMockSeriesData from '../../../../__mockData__/DataHistoryExplorerMockSeriesData.json';
import MockADXTimeSeriesData from '../../../../../../Adapters/__mockData__/MockAdapterData/MockADXTimeSeriesData.json';
import { IDataHistoryTimeSeriesTwin } from '../../../../../../Models/Constants';

const wrapperStyle = { width: '100%', height: '400px' };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesChart',
    component: TimeSeriesChart,
    decorators: [getDefaultStoryDecorator<ITimeSeriesChartProps>(wrapperStyle)]
};

type TimeSeriesChartStory = ComponentStory<typeof TimeSeriesChart>;

const Template: TimeSeriesChartStory = (args) => {
    return (
        <TimeSeriesViewerContext.Provider
            value={{
                timeSeriesTwins: [
                    DataHistoryExplorerMockSeriesData[0] as IDataHistoryTimeSeriesTwin
                ]
            }}
        >
            <TimeSeriesChart {...args} />
        </TimeSeriesViewerContext.Provider>
    );
};
export const Mock = Template.bind({}) as TimeSeriesChartStory;
Mock.args = {
    explorerChartOptions: {
        yAxisType: 'independent',
        defaultQuickTimeSpanInMillis:
            QuickTimeSpans[QuickTimeSpanKey.Last60Days],
        aggregationType: 'avg',
        xMinDateInMillis: Date.parse('2023-1-1'),
        xMaxDateInMillis: Date.parse('2023-1-20')
    },
    data: [MockADXTimeSeriesData[0]]
} as ITimeSeriesChartProps;
