import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import PageManager from './PageManager';
import { IPageManagerProps } from './PageManager.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/PageManager',
    component: PageManager,
    decorators: [getDefaultStoryDecorator<IPageManagerProps>(wrapperStyle)]
};

type PageManagerStory = ComponentStory<typeof PageManager>;

const Template: PageManagerStory = (args) => {
    return <PageManager {...args} />;
};

export const Base = Template.bind({}) as PageManagerStory;
Base.args = {} as IPageManagerProps;
