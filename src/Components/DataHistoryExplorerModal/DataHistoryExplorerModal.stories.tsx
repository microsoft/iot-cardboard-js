import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorerModal from './DataHistoryExplorerModal';
import { IDataHistoryExplorerModalProps } from './DataHistoryExplorerModal.types';
import MockAdapter from '../../Adapters/MockAdapter';
import { ComponentStory } from '@storybook/react';

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
            {...args}
            adapter={new MockAdapter()}
            isOpen={true}
        />
    );
};

export const Empty = Template.bind({}) as DataHistoryExplorerModalStory;
Empty.args = {} as IDataHistoryExplorerModalProps;

export const WithSeries = Template.bind({}) as DataHistoryExplorerModalStory;
WithSeries.args = {
    timeSeriesTwins: [
        {
            twinId: 'SaltMachine_C0',
            twinPropertyName: 'Temperature',
            twinPropertyType: 'double',
            chartProps: {
                color: 'yellow'
            }
        }
    ]
} as IDataHistoryExplorerModalProps;
