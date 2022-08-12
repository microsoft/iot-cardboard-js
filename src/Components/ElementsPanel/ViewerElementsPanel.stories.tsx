import React, { useMemo } from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import ElementsPanel from './ViewerElementsPanel';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import {
    IViewerElementsPanelItem,
    IViewerElementsPanelProps
} from './ViewerElementsPanel.types';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = {
    width: '100%',
    height: '600px'
};

export default {
    title: 'Components/ElementsPanel',
    component: ElementsPanel,
    decorators: [
        getDefaultStoryDecorator<IViewerElementsPanelProps>(wrapperStyle)
    ]
};

export const ViewerElementsPanel = () => {
    const scenesConfig = mockVConfig as I3DScenesConfig;
    const sceneId = 'f7053e7537048e03be4d1e6f8f93aa8a';
    const adapter = new MockAdapter();

    const { sceneVisuals, isLoading } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig
    );

    const panelItems: Array<IViewerElementsPanelItem> = useMemo(
        () =>
            sceneVisuals.map((sceneVisual) => ({
                element: sceneVisual.element,
                behaviors: sceneVisual.behaviors,
                twins: sceneVisual.twins
            })),
        [sceneVisuals]
    );

    return (
        <div style={wrapperStyle}>
            <ElementsPanel
                isLoading={isLoading}
                panelItems={panelItems}
                onItemClick={(item, panelItem, behavior) =>
                    console.log(item, panelItem, behavior)
                }
            />
        </div>
    );
};
