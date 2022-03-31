import { ComponentStory } from '@storybook/react';
import React from 'react';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { defaultSwatchColors } from '../../../../../../Theming/Palettes';
import AlertIconPreview from './AlertIconPreview';

const cardStyle: React.CSSProperties = {
    padding: '20px'
};

export default {
    title: 'Components/Alerts/IconPreview',
    component: AlertIconPreview,
    decorators: [getDefaultStoryDecorator(cardStyle)]
};

type TemplateStory = ComponentStory<typeof AlertIconPreview>;
const Template: TemplateStory = (args) => {
    return (
        <AlertIconPreview
            icon={'AlarmClock'}
            color={defaultSwatchColors[0].item}
            {...args}
        />
    );
};

export const Base = Template.bind({}) as TemplateStory;
export const Empty = Template.bind({}) as TemplateStory;
Empty.args = {
    color: '',
    icon: ''
};
export const ColorOnly = Template.bind({}) as TemplateStory;
ColorOnly.args = {
    icon: ''
};

export const IconOnly = Template.bind({}) as TemplateStory;
IconOnly.args = {
    color: ''
};
