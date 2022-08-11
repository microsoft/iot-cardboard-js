import React, { useMemo } from 'react';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import MockAdapter from '../../Adapters/MockAdapter';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import AlertModal from './AlertModal';
import { IViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = { width: 'auto', height: 'auto' };

export default {
    title: 'Components/AlertModal',
    component: AlertModal,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

export const SingleAlert = () => {
    const scenesConfig = mockVConfig as I3DScenesConfig;
    const sceneId = 'f7053e7537048e03be4d1e6f8f93aa8a';
    const adapter = new MockAdapter();

    const { sceneAlerts } = useRuntimeSceneData(adapter, sceneId, scenesConfig);

    const panelItems: IViewerElementsPanelItem = useMemo(
        () => ({
            element: sceneAlerts[0]?.element,
            behaviors: sceneAlerts[0]?.behaviors,
            twins: sceneAlerts[0]?.twins
        }),
        [sceneAlerts]
    );

    return (
        <div style={wrapperStyle}>
            <AlertModal
                alerts={panelItems}
                position={{ left: 50, top: 50 }}
                onClose={null}
                onItemClick={null}
                onItemHover={null}
                onItemBlur={null}
            />
        </div>
    );
};

export const MultipleAlerts = () => {
    const scenesConfig = mockVConfig as I3DScenesConfig;
    const sceneId = 'f7053e7537048e03be4d1e6f8f93aa8a';
    const adapter = new MockAdapter();

    const { sceneAlerts } = useRuntimeSceneData(adapter, sceneId, scenesConfig);

    const panelItems: IViewerElementsPanelItem = useMemo(
        () => ({
            element: sceneAlerts[1]?.element,
            behaviors: sceneAlerts[1]?.behaviors,
            twins: sceneAlerts[1]?.twins
        }),
        [sceneAlerts]
    );

    return (
        <div style={wrapperStyle}>
            <AlertModal
                alerts={panelItems}
                position={{ left: 50, top: 50 }}
                onClose={null}
                onItemClick={null}
                onItemHover={null}
                onItemBlur={null}
            />
        </div>
    );
};

export const NoAlerts = () => {
    return (
        <div style={wrapperStyle}>
            <AlertModal
                alerts={null}
                position={{ left: 50, top: 50 }}
                onClose={null}
                onItemClick={null}
                onItemHover={null}
                onItemBlur={null}
            />
        </div>
    );
};
