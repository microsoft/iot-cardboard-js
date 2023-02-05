import React from 'react';
import { ComponentStory } from '@storybook/react';
import TimeSeriesCommandBar from './TimeSeriesCommandBar';
import { ITimeSeriesCommandBarProps } from './TimeSeriesCommandBar.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { QuickTimeSpans } from '../../../../../../Models/Constants/Constants';
import { QuickTimeSpanKey } from '../../../../../../Models/Constants/Enums';
import { TimeSeriesViewerMode } from '../../TimeSeriesViewer.types';

const wrapperStyle = { width: '100%', height: '100px' };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesCommandBar',
    component: TimeSeriesCommandBar,
    decorators: [
        getDefaultStoryDecorator<ITimeSeriesCommandBarProps>(wrapperStyle)
    ]
};

type TimeSeriesCommandBarStory = ComponentStory<typeof TimeSeriesCommandBar>;

const Template: TimeSeriesCommandBarStory = (args) => {
    return (
        <TimeSeriesCommandBar
            defaultChartOptions={{
                yAxisType: 'independent',
                aggregationType: 'avg',
                defaultQuickTimeSpanInMillis:
                    QuickTimeSpans[QuickTimeSpanKey.Last15Mins]
            }}
            onChartOptionsChange={(options) => {
                console.log(options);
            }}
            {...args}
        />
    );
};

export const ChartCommandBar = Template.bind({}) as TimeSeriesCommandBarStory;
ChartCommandBar.args = {
    viewerModeProps: {
        viewerMode: TimeSeriesViewerMode.Chart,
        deeplink:
            "https://mockkustoclustername.westus2.kusto.windows.net/mockKustoDatabaseName?web=1&query=mockKustoTableName | where TimeStamp > ago(900000ms) | where Id == 'PasteurizationMachine_A01' and Key == 'Temperature'"
    }
} as ITimeSeriesCommandBarProps;

export const TableCommandBar = Template.bind({}) as TimeSeriesCommandBarStory;
TableCommandBar.args = {
    viewerModeProps: {
        viewerMode: TimeSeriesViewerMode.Table,
        onDownloadClick: () => console.log('Downloading table data...')
    }
} as ITimeSeriesCommandBarProps;
