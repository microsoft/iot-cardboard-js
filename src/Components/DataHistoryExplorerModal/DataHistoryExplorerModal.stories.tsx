import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorerModal from './DataHistoryExplorerModal';
import { IDataHistoryExplorerModalProps } from './DataHistoryExplorerModal.types';
import MockAdapter from '../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorerModal',
    component: DataHistoryExplorerModal,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerModalProps>(wrapperStyle)
    ]
};

type DataHistoryExplorerModalStory = ComponentStory<
    typeof DataHistoryExplorerModal
>;

const Template: DataHistoryExplorerModalStory = (args) => {
    return <DataHistoryExplorerModal {...args} />;
};

export const Mock = Template.bind({}) as DataHistoryExplorerModalStory;
Mock.args = {
    adapter: new MockAdapter(),
    isOpen: true
} as IDataHistoryExplorerModalProps;
