import React, { useMemo } from 'react';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import MockAdapter from '../../Adapters/MockAdapter';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import AlertModal from './AlertModal';
import { IViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';
import BaseComponent from '../BaseComponent/BaseComponent';

export default {
    title: 'Components/AlertModal',
    component: AlertModal
};

export const Alert = (_arg, { globals: { theme } }) => {
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
            <AlertModal
                alerts={panelItems}
                position={{ left: 50, top: 50 }}
                onClose={null}
                onItemClick={null}
                onItemHover={null}
                onItemBlur={null}
            />
        </BaseComponent>
    );
};
