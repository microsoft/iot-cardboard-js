import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorerModal from './DataHistoryExplorerModal';
import { IDataHistoryExplorerModalProps } from './DataHistoryExplorerModal.types';
import MockAdapter from '../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Modal',
    component: DataHistoryExplorerModal,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerModalProps>(wrapperStyle)
    ]
};

export const Mock = (args) => {
    return (
        <DataHistoryExplorerModal
            {...args}
            adapter={new MockAdapter()}
            isOpen={true}
        />
    );
};
