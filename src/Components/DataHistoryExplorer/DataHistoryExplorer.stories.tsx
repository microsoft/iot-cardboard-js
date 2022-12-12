import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorer from './DataHistoryExplorer';
import { IDataHistoryExplorerProps } from './DataHistoryExplorer.types';
import MockAdapter from '../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '300px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer',
    component: DataHistoryExplorer,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerProps>(wrapperStyle)
    ]
};

type DataHistoryExplorerStory = ComponentStory<typeof DataHistoryExplorer>;

const Template: DataHistoryExplorerStory = (args) => {
    return <DataHistoryExplorer {...args} />;
};

export const Mock = Template.bind({}) as DataHistoryExplorerStory;
Mock.args = {
    adapter: new MockAdapter(),
    isOpen: true
} as IDataHistoryExplorerProps;
