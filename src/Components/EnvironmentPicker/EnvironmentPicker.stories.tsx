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
    localStorageKey: process.env.STORYBOOK_MOCK_ENVIRONMENTS_LOCAL_STORAGE_KEY,
    selectedItemLocalStorageKey:
        process.env.STORYBOOK_MOCK_SELECTED_ENVIRONMENT_LOCAL_STORAGE_KEY,
    storage: {
        isLocalStorageEnabled: true,
        localStorageKey:
            process.env.STORYBOOK_MOCK_CONTAINERS_LOCAL_STORAGE_KEY,
        selectedItemLocalStorageKey:
            process.env.STORYBOOK_MOCK_SELECTED_CONTAINER_LOCAL_STORAGE_KEY
    }
} as EnvironmentPickerProps;

export const MockEnvironmentPickerWithoutLocalStorage = Template.bind({});
MockEnvironmentPickerWithoutLocalStorage.args = {
    isLocalStorageEnabled: false,
    storage: {
        isLocalStorageEnabled: false
    }
} as EnvironmentPickerProps;
