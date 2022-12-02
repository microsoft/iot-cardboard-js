import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemArrayChild from './PropertyListItemArrayChild';
import { IPropertyListItemArrayChildProps } from './PropertyListItemArrayChild.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/PropertyListItemArrayChild',
    component: PropertyListItemArrayChild,
    decorators: [
        getDefaultStoryDecorator<IPropertyListItemArrayChildProps>(wrapperStyle)
    ]
};

type PropertyListItemArrayChildStory = ComponentStory<
    typeof PropertyListItemArrayChild
>;

const Template: PropertyListItemArrayChildStory = (args) => {
    return <PropertyListItemArrayChild {...args} />;
};

export const Base = Template.bind({}) as PropertyListItemArrayChildStory;
Base.args = {} as IPropertyListItemArrayChildProps;
