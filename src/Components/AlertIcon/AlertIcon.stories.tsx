import { ComponentStory } from '@storybook/react';
import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { defaultSwatchColors } from '../../Theming/Palettes';
import AlertIcon from './AlertIcon';

const cardStyle: React.CSSProperties = {
    padding: '20px'
};

export default {
    title: 'Components/Alerts/Icon',
    component: AlertIcon,
    decorators: [getDefaultStoryDecorator(cardStyle)]
};

type TemplateStory = ComponentStory<typeof AlertIcon>;
const Template: TemplateStory = (args) => {
    return (
        <AlertIcon
            icon={'AlarmClock'}
            color={defaultSwatchColors[0].item}
            {...args}
        />
    );
};

export const Base = Template.bind({}) as TemplateStory;
export const Empty = Template.bind({}) as TemplateStory;
Empty.args = {
    icon: '',
    color: ''
};
export const ColorOnly = Template.bind({}) as TemplateStory;
ColorOnly.args = {
    icon: ''
};
export const IconOnly = Template.bind({}) as TemplateStory;
IconOnly.args = {
    color: ''
};
