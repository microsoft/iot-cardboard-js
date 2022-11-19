import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import CardboardSpinButton from './CardboardSpinButton';
import { ICardboardSpinButtonProps } from './CardboardSpinButton.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/CardboardSpinButton',
    component: CardboardSpinButton,
    decorators: [
        getDefaultStoryDecorator<ICardboardSpinButtonProps>(wrapperStyle)
    ]
};

type CardboardSpinButtonStory = ComponentStory<typeof CardboardSpinButton>;

const Template: CardboardSpinButtonStory = (args) => {
    return <CardboardSpinButton {...args} />;
};

export const Base = Template.bind({}) as CardboardSpinButtonStory;
Base.args = {} as ICardboardSpinButtonProps;
