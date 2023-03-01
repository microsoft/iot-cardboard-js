import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import HomePage from './HomePage';
import { IHomePageProps } from './HomePage.types';
import { INGRESS_STORYBOOK_APPNAME } from '../../Models/Constants';
import { NavigationContextProvider } from '../../Models/Context/NavigationContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: `${INGRESS_STORYBOOK_APPNAME}/HomePage`,
    component: HomePage,
    decorators: [getDefaultStoryDecorator<IHomePageProps>(wrapperStyle)]
};

type HomePageStory = ComponentStory<typeof HomePage>;

const Template: HomePageStory = (args) => {
    // Navigation context provider is required here, however clicking navigation buttons will have no effect. This is intended.
    return (
        <NavigationContextProvider>
            <HomePage {...args} />
        </NavigationContextProvider>
    );
};

export const Base = Template.bind({}) as HomePageStory;
Base.args = {} as IHomePageProps;
