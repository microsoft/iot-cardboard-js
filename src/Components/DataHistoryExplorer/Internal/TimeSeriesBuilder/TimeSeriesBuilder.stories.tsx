import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesBuilder from './TimeSeriesBuilder';
import { ITimeSeriesBuilderProps } from './TimeSeriesBuilder.types';
import { createGUID } from '../../../../Models/Services/Utils';

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
            seriesId: createGUID(),
            twinId: 'PasteurizationMachine_A01',
            twinPropertyName: 'InFlow',
            twinPropertyType: 'double',
            chartProps: { color: 'red' }
        },
        {
            seriesId: noDataSeriesId,
            twinId: 'PasteurizationMachine_A02',
            twinPropertyName: 'OutFlow',
            twinPropertyType: 'double',
            chartProps: { color: 'green' }
        }
    ],
    missingTimeSeriesTwinIds: [noDataSeriesId]
} as ITimeSeriesBuilderProps;

export const LongList = Template.bind({}) as TimeSeriesBuilderStory;
LongList.args = {
    timeSeriesTwins: [
        {
            seriesId: createGUID(),
            twinId: 'PasteurizationMachine_A01',
            twinPropertyName: 'InFlow',
            twinPropertyType: 'double',
            chartProps: { color: 'red' }
        },
        {
            seriesId: createGUID(),
            twinId: 'PasteurizationMachine_A02',
            twinPropertyName: 'OutFlow',
            twinPropertyType: 'double',
            chartProps: { color: 'green' }
        },
        {
            seriesId: createGUID(),
            twinId: 'PasteurizationMachine_A03',
            twinPropertyName: 'Temperature',
            twinPropertyType: 'double',
            chartProps: { color: 'blue' }
        },
        {
            seriesId: createGUID(),
            twinId: 'PasteurizationMachine_A03',
            twinPropertyName: 'InFlow',
            twinPropertyType: 'double',
            chartProps: { color: 'orange' }
        },
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C1',
            twinPropertyName: 'InFlow',
            twinPropertyType: 'double',
            chartProps: { color: 'yellow' }
        },
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C2',
            twinPropertyName: 'OutFlow',
            twinPropertyType: 'float',
            chartProps: { color: 'pink' }
        },
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C3',
            twinPropertyName: 'Temperature',
            twinPropertyType: 'float',
            chartProps: { color: 'purple' }
        }
    ]
} as ITimeSeriesBuilderProps;
