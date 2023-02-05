import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesTwinCallout from './TimeSeriesTwinCallout';
import { ITimeSeriesTwinCalloutProps } from './TimeSeriesTwinCallout.types';
import MockAdapter from '../../../../Adapters/MockAdapter';
import { DefaultButton } from '@fluentui/react';
import DataHistoryExplorerMockSeriesData from '../../__mockData__/DataHistoryExplorerMockSeriesData.json';

const wrapperStyle = { width: '200px', height: '600px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Internal/TimeSeriesTwinCallout/Mock',
    component: TimeSeriesTwinCallout,
    decorators: [
        getDefaultStoryDecorator<ITimeSeriesTwinCalloutProps>(wrapperStyle)
    ]
};

type TimeSeriesTwinCalloutStory = ComponentStory<typeof TimeSeriesTwinCallout>;

const Template: TimeSeriesTwinCalloutStory = (args) => {
    return (
        <>
            <DefaultButton
                text="Target button"
                id="mock-time-series-twin-callout-target"
            />
            <TimeSeriesTwinCallout
                {...args}
                adapter={new MockAdapter()}
                target={'mock-time-series-twin-callout-target'}
                onPrimaryActionClick={(timeSeriesTwin) => {
                    console.log(timeSeriesTwin);
                }}
            />
        </>
    );
};

export const New = Template.bind({}) as TimeSeriesTwinCalloutStory;
New.args = {} as ITimeSeriesTwinCalloutProps;

export const Edit = Template.bind({}) as TimeSeriesTwinCalloutStory;
Edit.args = {
    timeSeriesTwin: DataHistoryExplorerMockSeriesData[0]
} as ITimeSeriesTwinCalloutProps;
