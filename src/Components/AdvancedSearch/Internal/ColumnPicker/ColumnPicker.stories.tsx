import React from 'react';
import { ComponentStory } from '@storybook/react';
import ColumnPicker from './ColumnPicker';
import { IColumnPickerProps } from './ColumnPicker.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/ColumnPicker',
    component: ColumnPicker
};

type ColumnPickerStory = ComponentStory<typeof ColumnPicker>;

const Template: ColumnPickerStory = (args) => {
    return <ColumnPicker {...args} />;
};

export const Base = Template.bind({}) as ColumnPickerStory;
Base.args = {} as IColumnPickerProps;
