import React, { useMemo } from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import ElementsPanel from './ViewerElementsPanel';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import { ViewerElementsPanelItem } from './ViewerElementsPanel.types';

const componentStyle = {
    height: '800px',
    width: '400px'
};

export default {
    title: 'Components/ElementsPanel',
    component: ElementsPanel
};

export const ViewerElementsPanel = (args, { globals: { theme, locale } }) => {
    const scenesConfig = mockVConfig as I3DScenesConfig;
    const sceneId = '58e02362287440d9a5bf3f8d6d6bfcf9';
    const adapter = new MockAdapter();
    const pollingInterval = 5000;

    const { sceneVisuals, isLoading } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig,
        pollingInterval
    );

    const panelItems: Array<ViewerElementsPanelItem> = useMemo(
        () =>
            sceneVisuals.map((sceneVisual) => ({
                element: sceneVisual.element,
                behaviors: sceneVisual.behaviors,
                twins: sceneVisual.twins
            })),
        [sceneVisuals]
    );

    return (
        <div style={componentStyle}>
            <ElementsPanel
                baseComponentProps={{ theme, locale }}
                isLoading={isLoading}
                panelItems={panelItems}
                onItemClick={(item, panelItem, behavior) =>
                    console.log(item, panelItem, behavior)
                }
            />
        </div>
    );
};
