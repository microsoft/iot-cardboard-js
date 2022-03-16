import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { Theme } from '../..';
import CheckboxRenderer, { CheckboxRendererProps } from './CheckboxRenderer';

const cardStyle = {
    width: '300px',
    background: 'grey',
    padding: '15px',
};
export default {
    title: 'Components/CheckboxRenderer',
    component: CheckboxRenderer,
    decorators: [getDefaultStoryDecorator<CheckboxRendererProps>(cardStyle)],
};

type TemplateStory = ComponentStory<typeof CheckboxRenderer>;
const Template: TemplateStory = (args) => {
    return <CheckboxRenderer {...args} />;
};

const defaultProps: CheckboxRendererProps = {
    isChecked: false,
};

export const Unchecked = Template.bind({}) as TemplateStory;
Unchecked.args = defaultProps;

export const Checked = Template.bind({}) as TemplateStory;
Checked.args = {
    ...defaultProps,
    isChecked: true,
};

export const UncheckedDark = Template.bind({}) as TemplateStory;
UncheckedDark.args = Unchecked.args;
UncheckedDark.parameters = {
    theme: Theme.Dark,
};

export const CheckedDark = Template.bind({}) as TemplateStory;
CheckedDark.args = Checked.args;
CheckedDark.parameters = {
    theme: Theme.Dark,
};
