import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import TablePicker from './TablePicker';
import { ITablePickerProps } from './TablePicker.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/Pickers/TablePicker',
    component: TablePicker,
    decorators: [getDefaultStoryDecorator<ITablePickerProps>(wrapperStyle)]
};

type TablePickerStory = ComponentStory<typeof TablePicker>;

const Template: TablePickerStory = (args) => {
    return <TablePicker {...args} />;
};

export const Base = Template.bind({}) as TablePickerStory;
Base.args = {
    databaseName: 'MockDatabase',
    onTableNameChange: (tableName) => console.log(tableName)
} as ITablePickerProps;
