import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import LayerDropdown from './LayerDropdown';
import { LayerDropdownProps } from './LayerDropdown.types';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/LayerDropdown',
    component: LayerDropdown,
    decorators: [getDefaultStoryDecorator<LayerDropdownProps>(wrapperStyle)]
};

type LayerDropdownStory = ComponentStory<typeof LayerDropdown>;

const Template: LayerDropdownStory = (args) => {
    return <LayerDropdown {...args} />
}

export const LayerDropdownMock = Template.bind({}) as LayerDropdownStory;

LayerDropdownMock.args = {}
