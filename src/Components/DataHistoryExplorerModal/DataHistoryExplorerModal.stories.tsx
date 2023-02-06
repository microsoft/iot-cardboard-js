import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorerModal from './DataHistoryExplorerModal';
import { IDataHistoryExplorerModalProps } from './DataHistoryExplorerModal.types';
import MockAdapter from '../../Adapters/MockAdapter';
import { ComponentStory } from '@storybook/react';
import { getHighChartColorByIdx } from '../../Models/SharedUtils/DataHistoryUtils';
import { createGUID } from '../../Models/Services/Utils';
import { ComponentErrorType } from '../../Models/Constants/Enums';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Modal/Mock',
    component: DataHistoryExplorerModal,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerModalProps>(wrapperStyle)
    ]
};

type DataHistoryExplorerModalStory = ComponentStory<
    typeof DataHistoryExplorerModal
>;

const Template: DataHistoryExplorerModalStory = (args) => {
    return (
        <DataHistoryExplorerModal
            adapter={new MockAdapter()}
            isOpen={true}
            {...args}
        />
    );
};

export const Empty = Template.bind({}) as DataHistoryExplorerModalStory;
Empty.args = {} as IDataHistoryExplorerModalProps;

export const WithSeries = Template.bind({}) as DataHistoryExplorerModalStory;
WithSeries.args = {
    timeSeriesTwins: [
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C0',
            twinPropertyName: 'Temperature',
            twinPropertyType: 'double',
            chartProps: {
                color: getHighChartColorByIdx(0)
            }
        },
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C1',
            twinPropertyName: 'Temperature',
            twinPropertyType: 'double',
            chartProps: {
                color: getHighChartColorByIdx(1)
            }
        },
        {
            seriesId: createGUID(),
            twinId: 'SaltMachine_C2',
            twinPropertyName: 'InFlow',
            twinPropertyType: 'double',
            chartProps: {
                color: getHighChartColorByIdx(2)
            }
        }
    ]
} as IDataHistoryExplorerModalProps;

export const TimeSeriesConnectionInformationFetchFailed = Template.bind(
    {}
) as DataHistoryExplorerModalStory;
const mockAdapter = new MockAdapter({
    mockError: {
        type: ComponentErrorType.TimeSeriesDatabaseConnectionFetchFailed
    }
});
mockAdapter.setADXConnectionInformation(null);
TimeSeriesConnectionInformationFetchFailed.args = {
    adapter: mockAdapter
};
