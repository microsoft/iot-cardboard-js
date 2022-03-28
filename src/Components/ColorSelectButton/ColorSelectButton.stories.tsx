import React, { useState } from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { defaultSwatchColors } from '../../Theming/Palettes';
import ColorSelectButton from './ColorSelectButton';

const cardStyle = {
    height: '300px',
    width: '300px'
};

export default {
    title: 'Components/Color Select Button',
    component: ColorSelectButton,
    decorators: [getDefaultStoryDecorator(cardStyle)]
};

export const SelectColorButton = (args) => {
    const [selectedColor, setSelectedColor] = useState(
        defaultSwatchColors[0].color
    );

    return (
        <ColorSelectButton
            buttonColor={selectedColor}
            colorSwatch={defaultSwatchColors}
            onChangeSwatchColor={setSelectedColor}
            {...args}
        />
    );
};

export const SelectColorButtonCustomized = (args) => {
    const [selectedColor, setSelectedColor] = useState(
        defaultSwatchColors[0].color
    );

    return (
        <ColorSelectButton
            buttonColor={selectedColor}
            colorSwatch={defaultSwatchColors}
            onChangeSwatchColor={setSelectedColor}
            styles={{
                root: {
                    background: 'red',
                    display: 'flex',
                    justifyContent: 'center'
                }
            }}
            {...args}
        />
    );
};
