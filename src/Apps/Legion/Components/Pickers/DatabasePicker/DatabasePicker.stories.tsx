import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import DatabasePicker from './DatabasePicker';
import { IDatabasePickerProps } from './DatabasePicker.types';

const wrapperStyle = { width: '320px', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/Pickers/DatabasePicker',
    component: DatabasePicker,
    decorators: [getDefaultStoryDecorator<IDatabasePickerProps>(wrapperStyle)]
};

type DatabasePickerStory = ComponentStory<typeof DatabasePicker>;

const Template: DatabasePickerStory = (args) => {
    return <DatabasePicker {...args} />;
};

export const Creatable = Template.bind({}) as DatabasePickerStory;
Creatable.args = {
    isCreatable: true,
    // eslint-disable-next-line no-console
    onDatabaseNameChange: (dbName) => console.log(dbName)
} as IDatabasePickerProps;

export const Dropdown = Template.bind({}) as DatabasePickerStory;
Dropdown.args = { isCreatable: false } as IDatabasePickerProps;
