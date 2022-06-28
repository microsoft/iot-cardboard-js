import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import TransformsBuilder from './TransformsBuilder';
import { ITransformsBuilderProps } from './TransformsBuilder.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/TransformsBuilder',
    component: TransformsBuilder,
    decorators: [
        getDefaultStoryDecorator<ITransformsBuilderProps>(wrapperStyle)
    ]
};

type TransformsBuilderStory = ComponentStory<typeof TransformsBuilder>;

const Template: TransformsBuilderStory = (args) => {
    return <TransformsBuilder {...args} />;
};

export const Base = Template.bind({}) as TransformsBuilderStory;
Base.args = {} as ITransformsBuilderProps;
