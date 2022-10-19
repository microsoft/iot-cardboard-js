import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import CardboardMultiSelect from './CardboardMultiSelect';
import { ICardboardMultiSelectProps } from './CardboardMultiSelect.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/CardboardMultiSelect',
    component: CardboardMultiSelect,
    decorators: [
        getDefaultStoryDecorator<ICardboardMultiSelectProps>(wrapperStyle)
    ]
};

type CardboardMultiSelectStory = ComponentStory<typeof CardboardMultiSelect>;

const Template: CardboardMultiSelectStory = (args) => {
    return <CardboardMultiSelect {...args} />;
};

export const Base = Template.bind({}) as CardboardMultiSelectStory;
Base.args = {} as ICardboardMultiSelectProps;
