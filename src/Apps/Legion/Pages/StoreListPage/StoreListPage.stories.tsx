import React from 'react';
import { ComponentStory } from '@storybook/react';
import StoreListPage from './StoreListPage';
import { IStoreListPageProps } from './StoreListPage.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/StoreListPage',
    component: StoreListPage,
    decorators: [getDefaultStoryDecorator<IStoreListPageProps>(wrapperStyle)]
};

type StoreListPageStory = ComponentStory<typeof StoreListPage>;

const Template: StoreListPageStory = (args) => {
    return <StoreListPage {...args} />;
};

export const Base = Template.bind({}) as StoreListPageStory;
Base.args = {} as IStoreListPageProps;
