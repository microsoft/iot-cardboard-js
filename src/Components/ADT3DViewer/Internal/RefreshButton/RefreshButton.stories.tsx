import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import RefreshButton from './RefreshButton';
import { IRefreshButtonProps } from './RefreshButton.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/RefreshButton',
    component: RefreshButton,
    decorators: [getDefaultStoryDecorator<IRefreshButtonProps>(wrapperStyle)]
};

type RefreshButtonStory = ComponentStory<typeof RefreshButton>;

const Template: RefreshButtonStory = (args) => {
    return <RefreshButton {...args} />;
};

export const Base = Template.bind({}) as RefreshButtonStory;
Base.args = {
    lastRefreshTimeInMs: Date.now() - 2000,
    refreshFrequency: 20000,
    onClick: () => {
        alert('clicked');
    }
} as IRefreshButtonProps;
