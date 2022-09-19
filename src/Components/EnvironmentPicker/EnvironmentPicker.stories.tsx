import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import EnvironmentPicker from './EnvironmentPicker';
import { EnvironmentPickerProps } from './EnvironmentPicker.types';

const wrapperStyle = { width: '336px' };

export default {
    title: 'Components/EnvironmentPicker',
    component: EnvironmentPicker,
    decorators: [getDefaultStoryDecorator<EnvironmentPickerProps>(wrapperStyle)]
};

const Template = (args: EnvironmentPickerProps) => (
    <EnvironmentPicker {...args} adapter={new MockAdapter()} />
);

export const MockEnvironmentPickerWithLocalStorage = Template.bind({});
MockEnvironmentPickerWithLocalStorage.args = {
    isLocalStorageEnabled: true,
    storage: {
        isLocalStorageEnabled: true
    }
} as EnvironmentPickerProps;

export const MockEnvironmentPickerWithoutLocalStorage = Template.bind({});
MockEnvironmentPickerWithoutLocalStorage.args = {
    isLocalStorageEnabled: false,
    storage: {
        isLocalStorageEnabled: false
    }
} as EnvironmentPickerProps;
