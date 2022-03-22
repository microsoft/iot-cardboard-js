import React, { useState } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import ModelViewerModePicker, { ViewerMode } from './ModelViewerModePicker';

export default {
    title: 'Components/ModelViewerModePicker',
    component: ModelViewerModePicker
};

export const Picker = (_arg, { globals: { theme } }) => {
    const [viewerMode, setViewerMode] = useState<ViewerMode>(null);
    return (
        <BaseComponent theme={theme}>
            <div style={{ width: '100%', height: '600px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <div>
                        <span>Style: </span>
                        <span>{viewerMode?.style}</span>
                    </div>
                    <div>
                        <span>Object color: </span>
                        <span>{viewerMode?.objectColor}</span>
                    </div>
                    <div>
                        <span>Background: </span>
                        <span>{viewerMode?.background}</span>
                    </div>
                </div>
                <ModelViewerModePicker
                    theme={theme}
                    themeUpdated={(viewerMode) => setViewerMode(viewerMode)}
                    objectColors={['#50E6FF', '#FFC46B', '#B9B9B9']}
                    backgroundColors={['#3256FF', '#000000', '#FAF9F6']}
                />
            </div>
        </BaseComponent>
    );
};
