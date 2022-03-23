import React, { useMemo } from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import ElementsPanel from './ElementsPanel';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ElementsPanelItem } from './Internal/ElementList';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';

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

    const panelItems: Array<ElementsPanelItem> = useMemo(
        () =>
            sceneVisuals.map((sceneVisual) => ({
                element: sceneVisual.element,
                visuals: sceneVisual.visuals,
                twins: sceneVisual.twins,
                meshIds: sceneVisual.meshIds
            })),
        [sceneVisuals]
    );

    return (
        <div style={componentStyle}>
            <ElementsPanel
                baseComponentProps={{ theme, locale }}
                isLoading={isLoading}
                panelItems={panelItems}
                onItemClick={(item, panelItem) =>
                    console.log(item, panelItem.meshIds)
                }
            />
        </div>
    );
};
