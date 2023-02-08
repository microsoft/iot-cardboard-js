import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesBuilder from './TimeSeriesBuilder';
import { ITimeSeriesBuilderProps } from './TimeSeriesBuilder.types';
import { createGUID } from '../../../../Models/Services/Utils';
import DataHistoryExplorerMockSeriesData from '../../__mockData__/DataHistoryExplorerMockSeriesData.json';

const wrapperStyle = { width: '400px', height: '400px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Internal/TimeSeriesBuilder/Mock',
    component: TimeSeriesBuilder,
    decorators: [
        getDefaultStoryDecorator<ITimeSeriesBuilderProps>(wrapperStyle)
    ]
};

type TimeSeriesBuilderStory = ComponentStory<typeof TimeSeriesBuilder>;

const Template: TimeSeriesBuilderStory = (args) => {
    return (
        <TimeSeriesBuilder
            onAddSeriesClick={(calloutTargetId) =>
                console.log(
                    `Add clicked with target callout id ${calloutTargetId}`
                )
            }
            onEditSeriesClick={(seriesId, calloutTargetId) =>
                console.log(
                    `Edit clicked for twin with id ${seriesId} and with target callout id ${calloutTargetId}`
                )
            }
            onRemoveSeriesClick={(seriesId) => {
                console.log(`Remove clicked for twin with id ${seriesId}`);
            }}
            {...args}
        />
    );
};

export const EmptyList = Template.bind({}) as TimeSeriesBuilderStory;
EmptyList.args = {
    timeSeriesTwins: [],
    missingTimeSeriesTwinIds: []
} as ITimeSeriesBuilderProps;

const noDataSeriesId = createGUID();
export const ListWithNoDataSeries = Template.bind({}) as TimeSeriesBuilderStory;
ListWithNoDataSeries.args = {
    timeSeriesTwins: [
        {
            ...DataHistoryExplorerMockSeriesData[0],
            seriesId: noDataSeriesId
        }
    ],
    missingTimeSeriesTwinIds: [noDataSeriesId]
} as ITimeSeriesBuilderProps;

export const LongList = Template.bind({}) as TimeSeriesBuilderStory;
LongList.args = {
    timeSeriesTwins: DataHistoryExplorerMockSeriesData
} as ITimeSeriesBuilderProps;
