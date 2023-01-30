import React from 'react';
import { ComponentStory } from '@storybook/react';
import ChartCommandBar from './ChartCommandBar';
import { IChartCommandBarProps } from './ChartCommandBar.types';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import { QuickTimeSpans } from '../../../../../../../../Models/Constants/Constants';
import { QuickTimeSpanKey } from '../../../../../../../../Models/Constants/Enums';

const wrapperStyle = { width: '100%', height: '100px' };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesChart/Internal/ChartCommandBar',
    component: ChartCommandBar,
    decorators: [getDefaultStoryDecorator<IChartCommandBarProps>(wrapperStyle)]
};

type ChartCommandBarStory = ComponentStory<typeof ChartCommandBar>;

const Template: ChartCommandBarStory = (args) => {
    return <ChartCommandBar {...args} />;
};

export const WithoutShare = Template.bind({}) as ChartCommandBarStory;
WithoutShare.args = {
    defaultOptions: {
        yAxisType: 'independent',
        aggregationType: 'avg',
        defaultQuickTimeSpanInMillis:
            QuickTimeSpans[QuickTimeSpanKey.Last15Mins]
    },
    onChange: (options) => {
        console.log(options);
    }
} as IChartCommandBarProps;

export const WithShare = Template.bind({}) as ChartCommandBarStory;
WithShare.args = {
    deeplink:
        "https://mockkustoclustername.westus2.kusto.windows.net/mockKustoDatabaseName?web=1&query=mockKustoTableName | where TimeStamp > ago(900000ms) | where Id == 'PasteurizationMachine_A01' and Key == 'Temperature'"
} as IChartCommandBarProps;
