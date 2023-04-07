import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import StoreList from './StoreList';
import { IStoreListProps } from './StoreList.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/StoreList',
    component: StoreList,
    decorators: [getDefaultStoryDecorator<IStoreListProps>(wrapperStyle)]
};

type StoreListStory = ComponentStory<typeof StoreList>;

const Template: StoreListStory = (args) => {
    return <StoreList {...args} />;
};

export const Base = Template.bind({}) as StoreListStory;
Base.args = {} as IStoreListProps;
