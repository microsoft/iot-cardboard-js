import React, { useState } from 'react';
import ModelThemePicker, { ModelTheme } from './ModelThemePicker';

export default {
    title: 'Components/ModelThemePicker',
    component: ModelThemePicker
};

export const Picker = () => {
    const [theme, setTheme] = useState<ModelTheme>(null);
    return (
        <div style={{ maxWidth: '720px', width: '100%' }}>
            <div style={{ marginBottom: '30px' }}>
                <div>
                    <span>Theme: </span>
                    <span>{theme?.theme}</span>
                </div>
                <div>
                    <span>Object color: </span>
                    <span>{theme?.objectColor}</span>
                </div>
                <div>
                    <span>Background: </span>
                    <span>{theme?.background}</span>
                </div>
            </div>
            <ModelThemePicker
                themeUpdated={(theme) => setTheme(theme)}
                objectColors={['#50E6FF', '#FFC46B', '#B9B9B9']}
                backgroundColors={['#3256FF', '#000000', '#FFFFFF']}
            />
        </div>
    );
};
