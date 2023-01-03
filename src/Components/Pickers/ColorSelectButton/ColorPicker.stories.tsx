import { ComponentStory } from '@storybook/react';
import { within, screen, userEvent } from '@storybook/testing-library';
import React, { useState } from 'react';
import {
    getDefaultStoryDecorator,
    waitForFirstRender
} from '../../../Models/Services/StoryUtilities';
import { defaultSwatchColors } from '../../../Theming/Palettes';
import IconPicker from '../IconSelectButton/IconPicker';
import ColorPicker from './ColorPicker';

const cardStyle: React.CSSProperties = {
    padding: '20px'
};

export default {
    title: 'Components/Pickers/Color picker',
    component: ColorPicker,
    decorators: [getDefaultStoryDecorator(cardStyle)]
};

type TemplateStory = ComponentStory<typeof IconPicker>;
const Template: TemplateStory = (args) => {
    const [selectedColor, setSelectedColor] = useState(defaultSwatchColors[0]);
    return (
        <ColorPicker
            items={defaultSwatchColors}
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
    const button = canvas.getByTestId('color-picker-button');
    await userEvent.click(button);
};

export const SelectItem = Template.bind({}) as TemplateStory;
SelectItem.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const menuButton = canvas.getByTestId('color-picker-button');
    await userEvent.click(menuButton);

    await waitForFirstRender();
    // Finds the button and clicks it
    const optionButton = (await screen.findAllByRole('gridcell'))[2];
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
