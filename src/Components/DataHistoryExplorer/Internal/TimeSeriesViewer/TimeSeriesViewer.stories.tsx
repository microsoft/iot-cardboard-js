import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesViewer from './TimeSeriesViewer';
import {
    ITimeSeriesViewerProps,
    TimeSeriesViewerMode
} from './TimeSeriesViewer.types';
import { transformADXTimeSeriesToTimeSeriesTableData } from '../../../../Models/SharedUtils/DataHistoryUtils';
import { QuickTimeSpans } from '../../../../Models/Constants/Constants';
import { QuickTimeSpanKey } from '../../../../Models/Constants/Enums';
import DataHistoryExplorerMockSeriesData from '../../__mockData__/DataHistoryExplorerMockSeriesData.json';
import MockADXTimeSeriesData from '../../../../Adapters/__mockData__/MockAdapterData/MockADXTimeSeriesData.json';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants';

const wrapperStyle = { width: '600px', height: '400px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Internal/TimeSeriesViewer',
    component: TimeSeriesViewer,
    decorators: [getDefaultStoryDecorator<ITimeSeriesViewerProps>(wrapperStyle)]
};

type TimeSeriesViewerStory = ComponentStory<typeof TimeSeriesViewer>;

const Template: TimeSeriesViewerStory = (args) => {
    return (
        <TimeSeriesViewer
            explorerChartOptions={{
                yAxisType: 'independent',
                defaultQuickTimeSpanInMillis:
                    QuickTimeSpans[QuickTimeSpanKey.Last30Days],
                aggregationType: 'avg',
                xMinDateInMillis: Date.parse('2023-1-1'),
                xMaxDateInMillis: Date.parse('2023-1-20')
            }}
            onViewerModeChange={(viewMode) =>
                console.log(`Pivot changed to ${viewMode}!`)
            }
            timeSeriesTwins={
                DataHistoryExplorerMockSeriesData as Array<IDataHistoryTimeSeriesTwin>
            }
            data={{
                chart: MockADXTimeSeriesData,
                table: transformADXTimeSeriesToTimeSeriesTableData(
                    MockADXTimeSeriesData
                )
            }}
            {...args}
        />
    );
};

export const Chart = Template.bind({}) as TimeSeriesViewerStory;
Chart.args = {
    viewerModeProps: {
        viewerMode: TimeSeriesViewerMode.Chart,
        deeplink:
            "https://mockkustoclustername.westus2.kusto.windows.net/mockKustoDatabaseName?web=1&query=mockKustoTableName | where TimeStamp > ago(900000ms) | where Id == 'PasteurizationMachine_A01' and Key == 'Temperature'"
    }
} as ITimeSeriesViewerProps;

export const Table = Template.bind({}) as TimeSeriesViewerStory;
Table.args = {
    viewerModeProps: {
        viewerMode: TimeSeriesViewerMode.Table,
        onDownloadClick: () => console.log('Download clicked!')
    }
} as ITimeSeriesViewerProps;

export const Empty = Template.bind({}) as TimeSeriesViewerStory;
Empty.args = {
    viewerModeProps: {
        viewerMode: TimeSeriesViewerMode.Table,
        onDownloadClick: () => console.log('Download clicked!')
    },
    timeSeriesTwins: []
} as ITimeSeriesViewerProps;
