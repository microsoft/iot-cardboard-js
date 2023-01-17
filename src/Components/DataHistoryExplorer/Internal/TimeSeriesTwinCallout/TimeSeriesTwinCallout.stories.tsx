import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesTwinCallout from './TimeSeriesTwinCallout';
import { ITimeSeriesTwinCalloutProps } from './TimeSeriesTwinCallout.types';
import MockAdapter from '../../../../Adapters/MockAdapter';
import { DefaultButton } from '@fluentui/react';
import { DataHistoryExplorerContext } from '../../DataHistoryExplorer';

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
        <DataHistoryExplorerContext.Provider
            value={{ adapter: new MockAdapter() }}
        >
            <DefaultButton
                text="Target button"
                id="mock-time-series-twin-callout-target"
            />
            <TimeSeriesTwinCallout
                {...args}
                target={'mock-time-series-twin-callout-target'}
            />
        </DataHistoryExplorerContext.Provider>
    );
};

export const New = Template.bind({}) as TimeSeriesTwinCalloutStory;
New.args = {
    onPrimaryActionClick(timeSeriesTwin) {
        console.log(timeSeriesTwin);
    }
} as ITimeSeriesTwinCalloutProps;

export const Edit = Template.bind({}) as TimeSeriesTwinCalloutStory;
Edit.args = {
    timeSeriesTwin: {
        twinId: 'PasteurizationMachine_A01',
        twinPropertyName: 'InFlow',
        twinPropertyType: 'double',
        label: 'PasteurizationMachine_A01 InFlow'
    }
} as ITimeSeriesTwinCalloutProps;
