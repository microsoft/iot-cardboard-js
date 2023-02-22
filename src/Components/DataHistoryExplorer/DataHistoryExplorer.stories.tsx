import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorer from './DataHistoryExplorer';
import { IDataHistoryExplorerProps } from './DataHistoryExplorer.types';
import MockAdapter from '../../Adapters/MockAdapter';
import { createGUID } from '../../Models/Services/Utils';
import { getMockTimeSeriesDataArrayInLocalTime } from '../../Models/SharedUtils/DataHistoryUtils';
import isChromatic from 'chromatic/isChromatic';

const wrapperStyle = { width: '100%', height: '500px' };

export default {
    title: 'Components/DataHistoryExplorer/Mock',
    component: DataHistoryExplorer,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerProps>(wrapperStyle)
    ]
};

type DataHistoryExplorerStory = ComponentStory<typeof DataHistoryExplorer>;

const Template: DataHistoryExplorerStory = (args) => {
    return <DataHistoryExplorer adapter={new MockAdapter()} {...args} />;
};

export const WithoutTitle = Template.bind({}) as DataHistoryExplorerStory;
WithoutTitle.args = {
    hasTitle: false
} as IDataHistoryExplorerProps;

export const WithTitle = Template.bind({}) as DataHistoryExplorerStory;
WithTitle.args = {
    hasTitle: true
} as IDataHistoryExplorerProps;

export const WithSeries = Template.bind({}) as DataHistoryExplorerStory;
WithSeries.args = {
    timeSeriesTwins: [
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C0',
            twinPropertyName: 'Temperature',
            twinPropertyType: 'double',
            chartProps: {
                color: 'yellow'
            }
        }
    ]
} as IDataHistoryExplorerProps;

export const LargeData = Template.bind({}) as DataHistoryExplorerStory;
LargeData.args = {
    timeSeriesTwins: [
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C0',
            twinPropertyName: 'Temperature',
            twinPropertyType: 'double',
            chartProps: {
                color: 'red'
            }
        },
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C0',
            twinPropertyName: 'InFlow',
            twinPropertyType: 'double',
            chartProps: {
                color: 'green'
            }
        }
    ],
    adapter: new MockAdapter({
        mockData: getMockTimeSeriesDataArrayInLocalTime(
            2,
            500000,
            undefined,
            isChromatic()
        )
    })
} as IDataHistoryExplorerProps;
