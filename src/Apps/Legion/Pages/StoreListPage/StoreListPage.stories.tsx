import React from 'react';
import { ComponentStory } from '@storybook/react';
import StoreListPage from './StoreListPage';
import { IStoreListPageProps } from './StoreListPage.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { AppDataContextProvider } from '../../Contexts/AppDataContext/AppDataContext';
import { AppNavigationContextProvider } from '../../Contexts/NavigationContext/AppNavigationContext';
import { GET_MOCK_APP_DATA_CONTEXT_STATE } from '../../Contexts/AppDataContext/AppDataContext.mock';
import { GET_MOCK_APP_NAV_CONTEXT_STATE } from '../../Contexts/NavigationContext/AppNavigationContext.mock';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Pages/StoreListPage',
    component: StoreListPage,
    decorators: [getDefaultStoryDecorator<IStoreListPageProps>(wrapperStyle)]
};

type StoreListPageStory = ComponentStory<typeof StoreListPage>;

const Template: StoreListPageStory = (args) => {
    return (
        <AppDataContextProvider
            initialState={{
                ...GET_MOCK_APP_DATA_CONTEXT_STATE(),
                targetDatabase: null
            }}
        >
            <AppNavigationContextProvider
                initialState={GET_MOCK_APP_NAV_CONTEXT_STATE()}
            >
                <StoreListPage {...args} />
            </AppNavigationContextProvider>
        </AppDataContextProvider>
    );
};

export const Base = Template.bind({}) as StoreListPageStory;
Base.args = {} as IStoreListPageProps;
