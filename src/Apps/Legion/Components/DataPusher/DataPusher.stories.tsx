import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import DataPusher from './DataPusher';
import { IDataPusherProps } from './DataPusher.types';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';

const wrapperStyle = { width: '800px', height: '840px', padding: 8 };

export default {
    title: 'Apps/Legion/DataPusher',
    component: DataPusher,
    decorators: [getDefaultStoryDecorator<IDataPusherProps>(wrapperStyle)]
};

type DataPusherStory = ComponentStory<typeof DataPusher>;

const Template: DataPusherStory = (args) => {
    return <DataPusher {...args} />;
};

export const Mock = Template.bind({}) as DataPusherStory;
Mock.args = {
    adapter: new MockDataManagementAdapter()
} as IDataPusherProps;
