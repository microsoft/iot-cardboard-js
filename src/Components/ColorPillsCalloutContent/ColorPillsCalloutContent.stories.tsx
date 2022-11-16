import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ColorPillsCalloutContent from './ColorPillsCalloutContent';
import { IColorPillsCalloutContentProps } from './ColorPillsCalloutContent.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/ColorPillsCalloutContent',
    component: ColorPillsCalloutContent,
    decorators: [
        getDefaultStoryDecorator<IColorPillsCalloutContentProps>(wrapperStyle)
    ]
};

type ColorPillsCalloutContentStory = ComponentStory<
    typeof ColorPillsCalloutContent
>;

const Template: ColorPillsCalloutContentStory = (args) => {
    return <ColorPillsCalloutContent {...args} />;
};

export const Base = Template.bind({}) as ColorPillsCalloutContentStory;
Base.args = {
    visualColorings: [
        {
            color: '#B53C30'
        },
        {
            color: '#F5BB41',
            label: 'Temperature warning'
        },
        {
            color: '#31D15C',
            label: 'Temperature too hot'
        }
    ]
} as IColorPillsCalloutContentProps;
