import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemEnumChild from './PropertyListItemEnumChild';
import { IPropertyListItemEnumChildProps } from './PropertyListItemEnumChild.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title:
        'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem/PropertyListItemChildHost/PropertyListItemEnumChild',
    component: PropertyListItemEnumChild,
    decorators: [
        getDefaultStoryDecorator<IPropertyListItemEnumChildProps>(wrapperStyle)
    ]
};

type PropertyListItemEnumChildStory = ComponentStory<
    typeof PropertyListItemEnumChild
>;

const Template: PropertyListItemEnumChildStory = (args) => {
    return <PropertyListItemEnumChild {...args} />;
};

export const Base = Template.bind({}) as PropertyListItemEnumChildStory;
Base.args = {} as IPropertyListItemEnumChildProps;
