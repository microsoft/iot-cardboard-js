import React from 'react';
import { ComponentStory } from '@storybook/react';
import TimeSeriesChart from './TimeSeriesChart';
import { ITimeSeriesChartProps } from './TimeSeriesChart.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import { createGUID } from '../../../../../../Models/Services/Utils';
import { getHighChartColorByIdx } from '../../../../../../Models/SharedUtils/DataHistoryUtils';
import { QuickTimeSpans } from '../../../../../../Models/Constants/Constants';
import { QuickTimeSpanKey } from '../../../../../../Models/Constants/Enums';

const wrapperStyle = { width: '100%', height: '400px' };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesChart',
    component: TimeSeriesChart,
    decorators: [getDefaultStoryDecorator<ITimeSeriesChartProps>(wrapperStyle)]
};

type TimeSeriesChartStory = ComponentStory<typeof TimeSeriesChart>;

const seriesId = createGUID();
const Template: TimeSeriesChartStory = (args) => {
    return (
        <TimeSeriesViewerContext.Provider
            value={{
                timeSeriesTwins: [
                    {
                        seriesId: seriesId,
                        twinId: 'PasteurizationMachine_A01',
                        twinPropertyName: 'Inflow',
                        twinPropertyType: 'double',
                        label: 'PasteurizationMachine_A01 (Inflow)',
                        chartProps: {
                            color: getHighChartColorByIdx(0)
                        }
                    }
                ]
            }}
        >
            <TimeSeriesChart {...args} />
        </TimeSeriesViewerContext.Provider>
    );
};

const nowInMillis = Date.now();
export const Mock = Template.bind({}) as TimeSeriesChartStory;
Mock.args = {
    chartOptions: {
        yAxisType: 'independent',
        defaultQuickTimeSpanInMillis: QuickTimeSpans[QuickTimeSpanKey.LastYear],
        aggregationType: 'avg',
        xMinDateInMillis:
            nowInMillis - QuickTimeSpans[QuickTimeSpanKey.LastYear],
        xMaxDateInMillis: nowInMillis
    },
    data: [
        {
            seriesId: seriesId,
            id: 'PasteurizationMachine_A01',
            key: 'Inflow',
            data: [
                {
                    timestamp: '2023-01-09T18:02:49.712Z', // note that date is in UTC
                    value: 115
                },
                {
                    timestamp: '2023-01-09T18:03:09.216Z', // note that date is in UTC
                    value: 23
                },
                {
                    timestamp: '2023-01-09T18:04:16.698Z', // note that date is in UTC
                    value: 188
                }
            ]
        }
    ]
} as ITimeSeriesChartProps;
