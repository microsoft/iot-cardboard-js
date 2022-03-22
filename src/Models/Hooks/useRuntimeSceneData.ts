import { useEffect, useState } from 'react';
import { VisualType } from '../Classes/3DVConfig';
import { CustomMeshItem, SceneVisual } from '../Classes/SceneView.types';
import { IADT3DViewerAdapter } from '../Constants/Interfaces';
import { getSceneElementStatusColor, parseExpression } from '../Services/Utils';
import { I3DScenesConfig } from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import useAdapter from './useAdapter';

export const useRuntimeSceneData = (
    adapter: IADT3DViewerAdapter,
    sceneId: string,
    sceneConfig: I3DScenesConfig,
    pollingInterval: number
) => {
    const [modelUrl, setModelUrl] = useState('');
    const [sceneVisuals, setSceneVisuals] = useState<Array<SceneVisual>>([]);

    const sceneData = useAdapter({
        adapterMethod: () => adapter.getSceneData(sceneId, sceneConfig),
        refetchDependencies: [sceneId, sceneConfig],
        isLongPolling: true,
        pollingIntervalMillis: pollingInterval
    });

    useEffect(() => {
        if (sceneData?.adapterResult?.result?.data) {
            const sceneVisuals = [
                ...sceneData.adapterResult.result.data.sceneVisuals
            ];

            sceneVisuals.forEach((sceneVisual) => {
                const coloredMeshItems: Array<CustomMeshItem> = [];
                sceneVisual.visuals?.map((visual) => {
                    switch (visual.type) {
                        case VisualType.StatusColoring: {
                            const color = getSceneElementStatusColor(
                                visual.statusValueExpression,
                                visual.valueRanges,
                                sceneVisual.twins
                            );
                            if (color) {
                                sceneVisual.meshIds?.map((meshId) => {
                                    const coloredMesh: CustomMeshItem = {
                                        meshId: meshId,
                                        color: color
                                    };
                                    if (
                                        !coloredMeshItems.find(
                                            (item) =>
                                                item.meshId ===
                                                coloredMesh.meshId
                                        )
                                    ) {
                                        coloredMeshItems.push(coloredMesh);
                                    }
                                });
                            }
                            break;
                        }
                        case VisualType.Alert: {
                            if (
                                parseExpression(
                                    visual.triggerExpression,
                                    sceneVisual.twins
                                )
                            ) {
                                const color = visual.color;
                                sceneVisual.meshIds?.map((meshId) => {
                                    const coloredMesh: CustomMeshItem = {
                                        meshId: meshId,
                                        color: color
                                    };
                                    if (
                                        !coloredMeshItems.find(
                                            (item) =>
                                                item.meshId ===
                                                coloredMesh.meshId
                                        )
                                    ) {
                                        coloredMeshItems.push(coloredMesh);
                                    }
                                });
                            }
                            break;
                        }
                    }
                });
                sceneVisual.coloredMeshItems = coloredMeshItems;
            });

            setModelUrl(sceneData.adapterResult.result.data.modelUrl);
            setSceneVisuals(sceneVisuals);
        }
    }, [sceneData.adapterResult.result]);

    return { modelUrl, sceneVisuals, isLoading: sceneData.isLoading };
};
