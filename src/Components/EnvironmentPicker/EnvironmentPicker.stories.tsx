import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import EnvironmentPicker from './EnvironmentPicker';
import { EnvironmentPickerProps } from './EnvironmentPicker.types';

export default {
    title: 'Components/EnvironmentPicker',
    component: EnvironmentPicker
};

const Template = (
    args: EnvironmentPickerProps,
    { globals: { theme, locale } }
) => (
    <div style={{ width: 336 }}>
        <EnvironmentPicker
            {...args}
            adapter={new MockAdapter()}
            theme={theme}
            locale={locale}
        />
    </div>
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

export const MockEnvironmentPickerWithEnvironmentsFromSubscription = Template.bind(
    {}
);
MockEnvironmentPickerWithEnvironmentsFromSubscription.args = {
    ...MockEnvironmentPickerWithoutLocalStorage.args,
    shouldPullFromSubscription: true
} as EnvironmentPickerProps;
