import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import PropertyTypePicker from './PropertyTypePicker';
import { IPropertyTypePickerProps } from './PropertyTypePicker.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/PropertyTypePicker',
    component: PropertyTypePicker,
    decorators: [
        getDefaultStoryDecorator<IPropertyTypePickerProps>(wrapperStyle)
    ]
};

type PropertyTypePickerStory = ComponentStory<typeof PropertyTypePicker>;

const Template: PropertyTypePickerStory = (args) => {
    return <PropertyTypePicker {...args} />;
};

export const Base = Template.bind({}) as PropertyTypePickerStory;
Base.args = {} as IPropertyTypePickerProps;
