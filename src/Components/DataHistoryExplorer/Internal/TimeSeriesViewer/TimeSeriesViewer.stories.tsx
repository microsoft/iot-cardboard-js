import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesViewer from './TimeSeriesViewer';
import { ITimeSeriesViewerProps } from './TimeSeriesViewer.types';
import { createGUID } from '../../../../Models/Services/Utils';
import { getHighChartColorByIdx } from '../../../../Models/SharedUtils/DataHistoryUtils';
import { QuickTimeSpans } from '../../../../Models/Constants/Constants';
import { QuickTimeSpanKey } from '../../../../Models/Constants/Enums';

const wrapperStyle = { width: '600px', height: '400px' };

export default {
    title: 'Components/DataHistoryExplorer/Internal/TimeSeriesViewer',
    component: TimeSeriesViewer,
    decorators: [getDefaultStoryDecorator<ITimeSeriesViewerProps>(wrapperStyle)]
};

type TimeSeriesViewerStory = ComponentStory<typeof TimeSeriesViewer>;

const nowInMillis = Date.now();
const Template: TimeSeriesViewerStory = (args) => {
    return (
        <TimeSeriesViewer
            {...args}
            chartOptions={{
                yAxisType: 'independent',
                defaultQuickTimeSpanInMillis:
                    QuickTimeSpans[QuickTimeSpanKey.LastYear],
                aggregationType: 'avg',
                xMinDateInMillis:
                    nowInMillis - QuickTimeSpans[QuickTimeSpanKey.LastYear],
                xMaxDateInMillis: nowInMillis
            }}
            onViewerModeChange={(viewMode) =>
                console.log(`Pivot changed to ${viewMode}!`)
            }
        />
    );
};

const series1 = createGUID();
const series2 = createGUID();
export const Mock = Template.bind({}) as TimeSeriesViewerStory;
Mock.args = {
    timeSeriesTwins: [
        {
            seriesId: series1,
            twinId: 'PasteurizationMachine_A01',
            twinPropertyName: 'Inflow',
            twinPropertyType: 'double',
            label: 'PasteurizationMachine_A01 (Inflow)',
            chartProps: {
                color: getHighChartColorByIdx(0)
            }
        },
        {
            seriesId: series2,
            twinId: 'PasteurizationMachine_A02',
            twinPropertyName: 'Inflow',
            twinPropertyType: 'double',
            label: 'PasteurizationMachine_A02 (Inflow)',
            chartProps: {
                color: getHighChartColorByIdx(1)
            }
        }
    ],
    data: {
        chart: [
            {
                seriesId: series1,
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
            },
            {
                seriesId: series2,
                id: 'PasteurizationMachine_A02',
                key: 'Inflow',
                data: [
                    {
                        timestamp: '2023-01-09T18:03:28.683Z', // note that date is in UTC
                        value: 272
                    },
                    {
                        timestamp: '2023-01-09T18:03:47.933Z', // note that date is in UTC
                        value: 169
                    },
                    {
                        timestamp: '2023-01-09T18:04:29.398Z', // note that date is in UTC
                        value: 238
                    }
                ]
            }
        ],
        table: [
            {
                seriesId: series1,
                property: 'InFlow',
                timestamp: '2023-01-09T18:02:49.712Z',
                id: 'PasteurizationMachine_A01',
                key: 'InFlow',
                value: 115
            },
            {
                seriesId: series1,
                property: 'InFlow',
                timestamp: '2023-01-09T18:03:09.216Z',
                id: 'PasteurizationMachine_A01',
                key: 'InFlow',
                value: 23
            },
            {
                seriesId: series1,
                property: 'InFlow',
                timestamp: '2023-01-09T18:04:16.698Z',
                id: 'PasteurizationMachine_A01',
                key: 'InFlow',
                value: 188
            },
            {
                seriesId: series2,
                property: 'InFlow',
                timestamp: '2023-01-09T18:03:28.683Z',
                id: 'PasteurizationMachine_A02',
                key: 'Inflow',
                value: 272
            },
            {
                seriesId: series2,
                property: 'InFlow',
                timestamp: '2023-01-09T18:03:47.933Z',
                id: 'PasteurizationMachine_A02',
                key: 'Inflow',
                value: 169
            },
            {
                seriesId: series2,
                property: 'InFlow',
                timestamp: '2023-01-09T18:04:29.398Z',
                id: 'PasteurizationMachine_A02',
                key: 'Inflow',
                value: 238
            }
        ]
    }
} as ITimeSeriesViewerProps;

export const Empty = Template.bind({}) as TimeSeriesViewerStory;
Empty.args = {
    timeSeriesTwins: []
} as ITimeSeriesViewerProps;
