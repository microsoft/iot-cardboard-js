import React, { useState } from 'react';
import {
    ViewerModeBackgroundColors,
    ViewerModeObjectColors
} from '../../Models/Constants';
import { ViewerMode } from '../../Models/Context/SceneThemeContext/SceneThemeContext.types';
import BaseComponent from '../BaseComponent/BaseComponent';
import ModelViewerModePicker from './ModelViewerModePicker';

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
                        <span>{viewerMode?.objectStyle}</span>
                    </div>
                    <div>
                        <span>Object color: </span>
                        <span>{viewerMode?.objectColor}</span>
                    </div>
                    <div>
                        <span>Background: </span>
                        <span>{viewerMode?.sceneBackground}</span>
                    </div>
                </div>
                <ModelViewerModePicker
                    viewerModeUpdated={(viewerMode) =>
                        setViewerMode(viewerMode)
                    }
                    objectColors={ViewerModeObjectColors}
                    backgroundColors={ViewerModeBackgroundColors}
                />
            </div>
        </BaseComponent>
    );
};
