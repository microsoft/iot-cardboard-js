import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ColorPillsTooltip from './ColorPillsTooltip';
import { IColorPillsTooltipProps } from './ColorPillsTooltip.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/ColorPillsTooltip',
    component: ColorPillsTooltip,
    decorators: [
        getDefaultStoryDecorator<IColorPillsTooltipProps>(wrapperStyle)
    ]
};

type ColorPillsTooltipStory = ComponentStory<typeof ColorPillsTooltip>;

const Template: ColorPillsTooltipStory = (args) => {
    return <ColorPillsTooltip {...args} />;
};

export const Base = Template.bind({}) as ColorPillsTooltipStory;
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
} as IColorPillsTooltipProps;
