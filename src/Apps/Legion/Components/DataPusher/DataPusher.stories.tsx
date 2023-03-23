import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import DataPusher from './DataPusher';
import { IDataPusherProps } from './DataPusher.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/DataPusher',
    component: DataPusher,
    decorators: [getDefaultStoryDecorator<IDataPusherProps>(wrapperStyle)]
};

type DataPusherStory = ComponentStory<typeof DataPusher>;

const Template: DataPusherStory = (args) => {
    return <DataPusher {...args} />;
};

export const Base = Template.bind({}) as DataPusherStory;
Base.args = {} as IDataPusherProps;
