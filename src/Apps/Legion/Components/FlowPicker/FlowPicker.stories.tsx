import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import FlowPicker from './FlowPicker';
import { IFlowPickerProps } from './FlowPicker.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/FlowPicker',
    component: FlowPicker,
    decorators: [getDefaultStoryDecorator<IFlowPickerProps>(wrapperStyle)]
};

type FlowPickerStory = ComponentStory<typeof FlowPicker>;

const Template: FlowPickerStory = (args) => {
    return <FlowPicker {...args} />;
};

export const Base = Template.bind({}) as FlowPickerStory;
Base.args = {} as IFlowPickerProps;
