import { IColorCellProps } from '@fluentui/react';
import React, { useState } from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { defaultSwatchColors } from '../../Theming/Palettes';
import IconSelectButton from './IconSelectButton';

const cardStyle = {
    height: '300px',
    width: '300px'
};

export default {
    title: 'Components/Icon Select Button',
    component: IconSelectButton,
    decorators: [getDefaultStoryDecorator(cardStyle)]
};

const swatchOptions: IColorCellProps[] = [
    {
        id: 'Running',
        color: 'Running'
    },
    {
        id: 'Snowflake',
        color: 'Snowflake'
    },
    {
        id: 'Frigid',
        color: 'Frigid'
    },
    {
        id: 'BlowingSnow',
        color: 'BlowingSnow'
    },
    {
        id: 'Ringer',
        color: 'Ringer'
    },
    {
        id: 'AlarmClock',
        color: 'AlarmClock'
    },
    {
        id: 'FastMode',
        color: 'FastMode'
    },
    {
        id: 'ShieldAlert',
        color: 'ShieldAlert'
    }
];

export const Base = (args) => {
    const [selectedColor, setSelectedColor] = useState(swatchOptions[0].color);

    return (
        <IconSelectButton
            buttonColor={selectedColor}
            iconOptions={swatchOptions}
            onChangeIcon={setSelectedColor}
            {...args}
        />
    );
};

export const Customized = (args) => {
    const [selectedColor, setSelectedColor] = useState(
        defaultSwatchColors[0].color
    );

    return (
        <IconSelectButton
            buttonColor={selectedColor}
            iconOptions={defaultSwatchColors}
            onChangeIcon={setSelectedColor}
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
