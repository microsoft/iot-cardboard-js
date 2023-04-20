import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import ClusterPicker from './ClusterPicker';
import { IClusterPickerProps } from './ClusterPicker.types';

const wrapperStyle = { width: '320px', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/Pickers/ClusterPicker',
    component: ClusterPicker,
    decorators: [getDefaultStoryDecorator<IClusterPickerProps>(wrapperStyle)]
};

type ClusterPickerStory = ComponentStory<typeof ClusterPicker>;

const Template: ClusterPickerStory = (args) => {
    return <ClusterPicker {...args} />;
};

export const Creatable = Template.bind({}) as ClusterPickerStory;
Creatable.args = {
    isCreatable: true,
    // eslint-disable-next-line no-console
    onClusterUrlChange: (url) => console.log(url)
} as IClusterPickerProps;

export const Dropdown = Template.bind({}) as ClusterPickerStory;
Dropdown.args = {
    isCreatable: false
} as IClusterPickerProps;
