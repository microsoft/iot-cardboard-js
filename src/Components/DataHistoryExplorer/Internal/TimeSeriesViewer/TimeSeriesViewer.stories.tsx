import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesViewer from './TimeSeriesViewer';
import {
    ITimeSeriesViewerProps,
    TimeSeriesViewerMode
} from './TimeSeriesViewer.types';
import { createGUID } from '../../../../Models/Services/Utils';
import { getHighChartColorByIdx } from '../../../../Models/SharedUtils/DataHistoryUtils';
import { QuickTimeSpans } from '../../../../Models/Constants/Constants';
import { QuickTimeSpanKey } from '../../../../Models/Constants/Enums';

const wrapperStyle = { width: '600px', height: '400px', padding: 8 };

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
            explorerChartOptions={{
                yAxisType: 'independent',
                defaultQuickTimeSpanInMillis:
                    QuickTimeSpans[QuickTimeSpanKey.Last30Days],
                aggregationType: 'avg',
                xMinDateInMillis:
                    nowInMillis - QuickTimeSpans[QuickTimeSpanKey.Last30Days],
                xMaxDateInMillis: nowInMillis
            }}
            onViewerModeChange={(viewMode) =>
                console.log(`Pivot changed to ${viewMode}!`)
            }
            data={{
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
                        key: series1 + '1',
                        value: 115
                    },
                    {
                        seriesId: series1,
                        property: 'InFlow',
                        timestamp: '2023-01-09T18:03:09.216Z',
                        id: 'PasteurizationMachine_A01',
                        key: series1 + '2',
                        value: 23
                    },
                    {
                        seriesId: series1,
                        property: 'InFlow',
                        timestamp: '2023-01-09T18:04:16.698Z',
                        id: 'PasteurizationMachine_A01',
                        key: series1 + '3',
                        value: 188
                    },
                    {
                        seriesId: series2,
                        property: 'InFlow',
                        timestamp: '2023-01-09T18:03:28.683Z',
                        id: 'PasteurizationMachine_A02',
                        key: series2 + '1',
                        value: 272
                    },
                    {
                        seriesId: series2,
                        property: 'InFlow',
                        timestamp: '2023-01-09T18:03:47.933Z',
                        id: 'PasteurizationMachine_A02',
                        key: series2 + '2',
                        value: 169
                    },
                    {
                        seriesId: series2,
                        property: 'InFlow',
                        timestamp: '2023-01-09T18:04:29.398Z',
                        id: 'PasteurizationMachine_A02',
                        key: series2 + '3',
                        value: 238
                    }
                ]
            }}
        />
    );
};

const series1 = createGUID();
const series2 = createGUID();
export const Chart = Template.bind({}) as TimeSeriesViewerStory;
Chart.args = {
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
    viewerModeProps: {
        viewerMode: TimeSeriesViewerMode.Chart,
        deeplink:
            "https://mockkustoclustername.westus2.kusto.windows.net/mockKustoDatabaseName?web=1&query=mockKustoTableName | where TimeStamp > ago(900000ms) | where Id == 'PasteurizationMachine_A01' and Key == 'Temperature'"
    }
} as ITimeSeriesViewerProps;

export const Table = Template.bind({}) as TimeSeriesViewerStory;
Table.args = {
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
    viewerModeProps: {
        viewerMode: TimeSeriesViewerMode.Table,
        onDownloadClick: () => console.log('Download clicked!')
    }
} as ITimeSeriesViewerProps;

export const Empty = Template.bind({}) as TimeSeriesViewerStory;
Empty.args = {
    timeSeriesTwins: []
} as ITimeSeriesViewerProps;
