import { useEffect, useState } from 'react';
import { VisualType } from '../Classes/3DVConfig';
import {
    CustomMeshItem,
    SceneViewBadge,
    SceneVisual
} from '../Classes/SceneView.types';
import { BadgeIcons } from '../Constants';
import { IADT3DViewerAdapter } from '../Constants/Interfaces';
import { getSceneElementStatusColor, parseExpression } from '../Services/Utils';
import { I3DScenesConfig } from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import useAdapter from './useAdapter';

export const useRuntimeSceneData = (
    adapter: IADT3DViewerAdapter,
    sceneId: string,
    scenesConfig: I3DScenesConfig,
    pollingInterval: number
) => {
    const [modelUrl, setModelUrl] = useState('');
    const [sceneVisuals, setSceneVisuals] = useState<Array<SceneVisual>>([]);

    const sceneData = useAdapter({
        adapterMethod: () => adapter.getSceneData(sceneId, scenesConfig),
        refetchDependencies: [sceneId, scenesConfig],
        isLongPolling: true,
        pollingIntervalMillis: pollingInterval
    });

    /**
     * After getting ADT3DViewerData (including scene visuals along with 3d model URL) from adapter, parse it to
     * update the colored meshes ids based on run expressions in behaviors against the returned ADT twin property data
     *  */
    useEffect(() => {
        if (sceneData?.adapterResult?.result?.data) {
            const sceneVisuals = [
                ...sceneData.adapterResult.result.data.sceneVisuals
            ];

            // for each scene visual retrieve the colored mesh ids and update it in the scene visual
            // if they are triggered by the element's behaviors and currently active
            sceneVisuals.forEach((sceneVisual) => {
                const coloredMeshItems: Array<CustomMeshItem> = [];
                const alertBadges: Array<SceneViewBadge> = [];
                sceneVisual.behaviors?.forEach((behavior) => {
                    behavior.visuals?.forEach((visual) => {
                        switch (visual.type) {
                            case VisualType.StatusColoring: {
                                const color = getSceneElementStatusColor(
                                    visual.statusValueExpression,
                                    visual.valueRanges,
                                    sceneVisual.twins
                                );
                                if (color) {
                                    sceneVisual.element.objectIDs?.forEach(
                                        (meshId) => {
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
                                                coloredMeshItems.push(
                                                    coloredMesh
                                                );
                                            }
                                        }
                                    );
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
                                    const meshId =
                                        sceneVisual.element.objectIDs?.[0];
                                    alertBadges.push({
                                        color: color,
                                        meshId: meshId,
                                        icon: BadgeIcons.cross
                                    });
                                }
                                break;
                            }
                        }
                    });
                });

                sceneVisual.coloredMeshItems = coloredMeshItems;
                sceneVisual.alertBadges = alertBadges;
            });

            setModelUrl(sceneData.adapterResult.result.data.modelUrl);
            setSceneVisuals(sceneVisuals);
        }
    }, [sceneData.adapterResult.result]);

    return { modelUrl, sceneVisuals, isLoading: sceneData.isLoading };
};
