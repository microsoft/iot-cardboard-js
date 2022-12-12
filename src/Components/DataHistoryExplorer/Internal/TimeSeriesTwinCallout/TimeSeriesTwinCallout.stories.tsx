import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesTwinCallout from './TimeSeriesTwinCallout';
import { ITimeSeriesTwinCalloutProps } from './TimeSeriesTwinCallout.types';
import MockAdapter from '../../../../Adapters/MockAdapter';
import { DefaultButton } from '@fluentui/react';

const wrapperStyle = { width: '200px', height: '600px', padding: 8 };

export default {
    title: 'Components/TimeSeriesTwinCallout',
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
            <TimeSeriesTwinCallout adapter={new MockAdapter()} {...args} />
        </>
    );
};

export const Mock = Template.bind({}) as TimeSeriesTwinCalloutStory;
Mock.args = {
    target: 'mock-time-series-twin-callout-target',
    onPrimaryActionClick(timeSeriesTwin) {
        console.log(timeSeriesTwin);
    }
} as ITimeSeriesTwinCalloutProps;
