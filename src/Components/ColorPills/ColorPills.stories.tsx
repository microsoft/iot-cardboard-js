import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ColorPills from './ColorPills';
import { IColorPillsProps } from './ColorPills.types';
import { VisualColorings } from '../../Models/Constants/VisualRuleTypes';

const wrapperStyle = { width: '100%', padding: 20 };

export default {
    title: 'Components/ColorPills',
    component: ColorPills,
    decorators: [getDefaultStoryDecorator<IColorPillsProps>(wrapperStyle)]
};

type ColorPillsStory = ComponentStory<typeof ColorPills>;

const Template: ColorPillsStory = (args) => {
    const visualColorings: VisualColorings[] = [
        {
            color: '#B53C30',
            label: undefined
        },
        {
            color: '#F5BB41',
            label: 'Temperature warning'
        },
        {
            color: '#31D15C',
            label: 'Temperature too hot'
        },
        {
            color: '#31D15C',
            label: 'Extra'
        }
    ];

    return (
        <ColorPills
            {...args}
            visualColorings={visualColorings}
            width={'compact'}
        />
    );
};

export const Base = Template.bind({}) as ColorPillsStory;
