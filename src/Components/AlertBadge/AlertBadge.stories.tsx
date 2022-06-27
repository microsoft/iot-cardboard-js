import React from 'react';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import MockAdapter from '../../Adapters/MockAdapter';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import AlertBadge from './AlertBadge';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { ViewerModeBackgroundColors } from '../../Models/Constants';

const wrapperStyle = { width: 'auto', height: '100px' };

export default {
    title: 'Components/AlertBadge',
    component: AlertBadge,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

export const SingleAlert = () => {
    const scenesConfig = mockVConfig as I3DScenesConfig;
    const sceneId = 'f7053e7537048e03be4d1e6f8f93aa8a';
    const adapter = new MockAdapter();
    const pollingInterval = 5000;

    const { sceneAlerts } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig,
        pollingInterval
    );

    return (
        <div style={wrapperStyle}>
            <AlertBadge
                badgeGroup={sceneAlerts[0]}
                backgroundColor={ViewerModeBackgroundColors[0]}
            />
        </div>
    );
};
