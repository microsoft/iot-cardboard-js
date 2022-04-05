import React, { useMemo } from 'react';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import MockAdapter from '../../Adapters/MockAdapter';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import AlertElementsPanel from './AlertElementsPanel';
import { IViewerElementsPanelItem } from './ViewerElementsPanel.types';
import BaseComponent from '../BaseComponent/BaseComponent';

export default {
    title: 'Components/ElementsPanel',
    component: AlertElementsPanel
};

export const AlertPanel = (_arg, { globals: { theme } }) => {
    const scenesConfig = mockVConfig as I3DScenesConfig;
    const sceneId = 'f7053e7537048e03be4d1e6f8f93aa8a';
    const adapter = new MockAdapter();
    const pollingInterval = 5000;

    const wrapperStyle = {
        width: '300px',
        height: '200px'
    };

    const { sceneAlerts } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig,
        pollingInterval
    );

    const panelItems: IViewerElementsPanelItem = useMemo(
        () => ({
            element: sceneAlerts[0]?.sceneVisual?.element,
            behaviors: sceneAlerts[0]?.sceneVisual?.behaviors,
            twins: sceneAlerts[0]?.sceneVisual?.twins
        }),
        [sceneAlerts]
    );

    return (
        <BaseComponent theme={theme}>
            <div style={wrapperStyle}>
                <AlertElementsPanel
                    alerts={panelItems}
                    onItemClick={null}
                    onItemHover={null}
                    onItemBlur={null}
                />
            </div>
        </BaseComponent>
    );
};
