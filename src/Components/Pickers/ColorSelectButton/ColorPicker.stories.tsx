import React, { useState } from 'react';
import { getDefaultStoryDecorator } from '../../../Models/Services/StoryUtilities';
import { defaultSwatchColors } from '../../../Theming/Palettes';
import ColorPicker from './ColorPicker';

const cardStyle: React.CSSProperties = {
    height: '300px',
    width: '300px',
    padding: '10px'
};

export default {
    title: 'Components/Pickers/Color picker',
    component: ColorPicker,
    decorators: [getDefaultStoryDecorator(cardStyle)]
};

export const SelectColorButton = (args) => {
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

export const SelectColorButtonCustomized = (args) => {
    const [selectedColor, setSelectedColor] = useState(defaultSwatchColors[0]);

    return (
        <ColorPicker
            items={defaultSwatchColors}
            onChangeItem={setSelectedColor}
            selectedItem={selectedColor.item}
            styles={{
                root: {
                    background: 'red',
                    display: 'flex',
                    justifyContent: 'center'
                },
                button: {
                    borderRadius: 0
                }
            }}
            {...args}
        />
    );
};
