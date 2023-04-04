import React from 'react';
import { ComponentStory } from '@storybook/react';
import LegionApp from './LegionApp';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { ILegionAppProps } from './LegionApp.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion',
    component: LegionApp,
    decorators: [getDefaultStoryDecorator<ILegionAppProps>(wrapperStyle)]
};

type LegionAppStory = ComponentStory<typeof LegionApp>;

const Template: LegionAppStory = (_args) => {
    return <LegionApp />;
};

export const App = Template.bind({}) as LegionAppStory;
App.args = {} as ILegionAppProps;
