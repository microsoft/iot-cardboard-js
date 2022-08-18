import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../Models/Services/StoryUtilities';
import PropertyInspectorCallout from './PropertyInspectorCallout';
import { IPropertyInspectorCalloutProps } from './PropertyInspectorCallout.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/PropertyInspectorCallout',
    component: PropertyInspectorCallout,
    decorators: [
        getDefaultStoryDecorator<IPropertyInspectorCalloutProps>(wrapperStyle)
    ]
};

type PropertyInspectorCalloutStory = ComponentStory<
    typeof PropertyInspectorCallout
>;

const Template: PropertyInspectorCalloutStory = (args) => {
    return <PropertyInspectorCallout {...args} />;
};

export const Base = Template.bind({}) as PropertyInspectorCalloutStory;
Base.args = {} as IPropertyInspectorCalloutProps;
