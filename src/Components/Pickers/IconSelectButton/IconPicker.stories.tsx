import { ComponentStory } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import React, { useState } from 'react';
import {
    findAllCalloutItemsByTestId,
    getDefaultStoryDecorator,
    waitForFirstRender
} from '../../../Models/Services/StoryUtilities';
import { defaultSwatchIcons } from '../../../Theming/Palettes';
import IconPicker from './IconPicker';

const cardStyle: React.CSSProperties = {
    padding: '20px'
};

export default {
    title: 'Components/Pickers/Icon picker',
    component: IconPicker,
    decorators: [getDefaultStoryDecorator(cardStyle)]
};

type TemplateStory = ComponentStory<typeof IconPicker>;
const Template: TemplateStory = (args) => {
    const [selectedColor, setSelectedColor] = useState(defaultSwatchIcons[0]);
    return (
        <IconPicker
            items={defaultSwatchIcons}
            onChangeItem={setSelectedColor}
            selectedItem={selectedColor.item}
            {...args}
        />
    );
};

export const Base = Template.bind({}) as TemplateStory;

export const Opened = Template.bind({}) as TemplateStory;
Opened.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = canvas.getByTestId('icon-picker-button');
    await userEvent.click(button);
};

export const SelectItem = Template.bind({}) as TemplateStory;
SelectItem.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const menuButton = canvas.getByTestId('icon-picker-button');
    await userEvent.click(menuButton);

    await waitForFirstRender();
    // Finds the button and clicks it
    const optionButton = (
        await findAllCalloutItemsByTestId('icon-picker-option')
    )[2];
    await optionButton.click();
};

export const Customized = Template.bind({}) as TemplateStory;
Customized.args = {
    styles: {
        root: {
            background: 'red',
            display: 'flex',
            justifyContent: 'center'
        },
        button: {
            borderRadius: 0
        }
    }
};
