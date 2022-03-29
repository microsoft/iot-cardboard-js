import React, { useState } from 'react';
import { getDefaultStoryDecorator } from '../../../Models/Services/StoryUtilities';
import { defaultSwatchIcons } from '../../../Theming/Palettes';
import IconPicker from './IconPicker';

const cardStyle: React.CSSProperties = {
    height: '300px',
    width: '300px',
    padding: '10px'
};

export default {
    title: 'Components/Pickers/Icon picker',
    component: IconPicker,
    decorators: [getDefaultStoryDecorator(cardStyle)]
};

export const Base = (args) => {
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

export const Customized = (args) => {
    const [selectedColor, setSelectedColor] = useState(defaultSwatchIcons[0]);

    return (
        <IconPicker
            items={defaultSwatchIcons}
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
