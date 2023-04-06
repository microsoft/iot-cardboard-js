import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import FlowPickerPage from './FlowPickerPage';
import { IFlowPickerPageProps } from './FlowPickerPage.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/FlowPickerPage',
    component: FlowPickerPage,
    decorators: [getDefaultStoryDecorator<IFlowPickerPageProps>(wrapperStyle)]
};

type FlowPickerPageStory = ComponentStory<typeof FlowPickerPage>;

const Template: FlowPickerPageStory = (args) => {
    return <FlowPickerPage {...args} />;
};

export const Base = Template.bind({}) as FlowPickerPageStory;
Base.args = {} as IFlowPickerPageProps;
