import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import SceneRefreshButton from './SceneRefreshButton';
import { ISceneRefreshButtonProps } from './SceneRefreshButton.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/SceneRefreshButton',
    component: SceneRefreshButton,
    decorators: [
        getDefaultStoryDecorator<ISceneRefreshButtonProps>(wrapperStyle)
    ]
};

type SceneRefreshButtonStory = ComponentStory<typeof SceneRefreshButton>;

const Template: SceneRefreshButtonStory = (args) => {
    return <SceneRefreshButton {...args} />;
};

export const Base = Template.bind({}) as SceneRefreshButtonStory;
Base.args = {
    lastRefreshTimeInMs: Date.now() - 2000,
    refreshFrequency: 20000,
    onClick: () => {
        alert('clicked');
    }
} as ISceneRefreshButtonProps;
