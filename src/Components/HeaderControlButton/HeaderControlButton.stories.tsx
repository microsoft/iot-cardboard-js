import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import HeaderControlButton from './HeaderControlButton';
import { IHeaderControlButtonProps } from './HeaderControlButton.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/HeaderControlButton',
    component: HeaderControlButton,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

type HeaderControlButtonStory = ComponentStory<typeof HeaderControlButton>;

const Template: HeaderControlButtonStory = (args) => {
    return <HeaderControlButton {...args} />;
};

export const Base = Template.bind({}) as HeaderControlButtonStory;
Base.args = {
    iconProps: { iconName: 'Color' },
    isActive: false,
    onClick: () => alert('clicked')
} as IHeaderControlButtonProps;

export const Active = Template.bind({}) as HeaderControlButtonStory;

Active.args = {
    iconProps: { iconName: 'Color' },
    isActive: true,
    onClick: () => alert('clicked')
} as IHeaderControlButtonProps;
