import { useEffect, useState } from 'react';
import { VisualType } from '../Classes/3DVConfig';
import {
    CustomMeshItem,
    SceneViewBadge,
    SceneViewBadgeGroup,
    SceneVisual
} from '../Classes/SceneView.types';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import { MINIMUM_REFRESH_RATE_IN_MILLISECONDS } from '../Constants';
import { IADT3DViewerAdapter } from '../Constants/Interfaces';
import {
    deepCopy,
    getDebugLogger,
    getSceneElementStatusColor,
    parseLinkedTwinExpression
} from '../Services/Utils';
import {
    I3DScenesConfig,
    IBehavior,
    IExpressionRangeVisual,
    IPollingConfiguration
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import useAdapter from './useAdapter';

const debugLogging = false;
const logDebugConsole = getDebugLogger('useRuntimeSceneData', debugLogging);

export const useRuntimeSceneData = (
    adapter: IADT3DViewerAdapter,
    sceneId: string,
    scenesConfig: I3DScenesConfig,
    /** Optional array of layer Ids to apply SceneVisual behavior filtering */
    selectedLayerIds: string[] = null
) => {
    const [modelUrl, setModelUrl] = useState('');
    const [pollingInterval, setPollingInterval] = useState(
        MINIMUM_REFRESH_RATE_IN_MILLISECONDS
    );
    const [lastRefreshTime, setLastRefreshTime] = useState<number>(null);
    const [sceneVisuals, setSceneVisuals] = useState<Array<SceneVisual>>([]);
    const [sceneAlerts, setSceneAlerts] = useState<Array<SceneViewBadgeGroup>>(
        []
    );

    const sceneData = useAdapter({
        adapterMethod: (args?: { isManualRefresh: boolean }) => {
            setLastRefreshTime(Date.now());
            return adapter.getSceneData(
                sceneId,
                scenesConfig,
                selectedLayerIds,
                args?.isManualRefresh ?? false
            );
        },
        refetchDependencies: [sceneId, scenesConfig, selectedLayerIds],
        isLongPolling: true,
        pollingIntervalMillis: pollingInterval
    });

    /**
     * After getting ADT3DViewerData (including scene visuals along with 3d model URL) from adapter, parse it to
     * update the colored meshes ids based on run expressions in behaviors against the returned ADT twin property data
     *  */
    useEffect(() => {
        if (sceneData?.adapterResult?.result?.data) {
            const sceneVisuals = deepCopy(
                sceneData.adapterResult.result.data.sceneVisuals
            );

            if (selectedLayerIds) {
                const behaviorIdsInSelectedLayers = ViewerConfigUtility.getBehaviorIdsInSelectedLayers(
                    scenesConfig,
                    [...selectedLayerIds],
                    sceneId
                );

                // Apply layer filtering to behaviors - splice out behaviors not in selected layers
                sceneVisuals.forEach((sv) => {
                    const filteredBehaviors = sv.behaviors.filter((b) =>
                        behaviorIdsInSelectedLayers.includes(b.id)
                    );
                    sv.behaviors = filteredBehaviors;
                });
            }

            const twinIds = new Set<string>();
            const alerts: Array<{
                sceneVisual: SceneVisual;
                sceneViewBadge: SceneViewBadge;
            }> = [];
            // for each scene visual retrieve the colored mesh ids and update it in the scene visual
            // if they are triggered by the element's behaviors and currently active
            sceneVisuals.forEach((sceneVisual) => {
                sceneVisual.coloredMeshItems = [];

                for (const twinId in sceneVisual.twins) {
                    twinIds.add(sceneVisual.twins[twinId].$dtId);
                }

                // const coloredMeshItems: Array<CustomMeshItem> = [];
                sceneVisual.behaviors?.forEach((behavior) => {
                    behavior.visuals?.forEach((visual) => {
                        if (visual.type !== VisualType.ExpressionRangeVisual) {
                            return;
                        }

                        // Status visual
                        if (visual.expressionType === 'NumericRange') {
                            const color = getSceneElementStatusColor(
                                visual.valueExpression,
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
                                        sceneVisual.coloredMeshItems.push(
                                            coloredMesh
                                        );
                                    }
                                );
                            }
                        } else if (
                            // Alert visual
                            visual.expressionType === 'CategoricalValues'
                        ) {
                            if (
                                parseLinkedTwinExpression(
                                    visual.valueExpression,
                                    sceneVisual.twins
                                )
                            ) {
                                const alert = buildAlert(
                                    visual,
                                    sceneVisual,
                                    behavior
                                );
                                alerts.push(alert);
                            }
                        }
                    });
                });
            });

            const groupedAlerts: SceneViewBadgeGroup[] = [];

            alerts.forEach((alert) => {
                // create first group
                if (groupedAlerts.length === 0) {
                    groupedAlerts.push({
                        id:
                            alert.sceneViewBadge.meshId +
                            alert.sceneViewBadge.id,
                        element: alert.sceneVisual.element,
                        behaviors: alert.sceneVisual.behaviors,
                        twins: alert.sceneVisual.twins,
                        meshId: alert.sceneViewBadge.meshId,
                        badges: [alert.sceneViewBadge]
                    });
                } else {
                    const group = groupedAlerts.find(
                        (ga) => ga.meshId === alert.sceneViewBadge.meshId
                    );

                    // add to exsiting group
                    if (group) {
                        group.id += alert.sceneViewBadge.id;
                        group.badges.push(alert.sceneViewBadge);
                    } else {
                        // create new group
                        groupedAlerts.push({
                            id:
                                alert.sceneViewBadge.meshId +
                                alert.sceneViewBadge.id,
                            element: alert.sceneVisual.element,
                            behaviors: alert.sceneVisual.behaviors,
                            twins: alert.sceneVisual.twins,
                            meshId: alert.sceneViewBadge.meshId,
                            badges: [alert.sceneViewBadge]
                        });
                    }
                }
            });

            // fetch the config
            const pollingConfig = ViewerConfigUtility.getPollingConfig(
                scenesConfig,
                sceneId
            );

            const computeInterval = (
                twinCount: number,
                pollingConfig: IPollingConfiguration
            ) => {
                const MIN_INTERVAL = 10000;
                const fastestPossibleRefreshRateSeconds = Math.max(
                    twinCount * 1000, // 1s per twin
                    MIN_INTERVAL
                );
                const actualRefreshRateSeconds =
                    pollingConfig.pollingStrategy === 'Limited' &&
                    pollingConfig.minimumPollingFrequency
                        ? Math.max(
                              fastestPossibleRefreshRateSeconds,
                              pollingConfig.minimumPollingFrequency
                          )
                        : fastestPossibleRefreshRateSeconds;
                logDebugConsole(
                    'debug',
                    `Computing refresh rate. FastestPossible: ${fastestPossibleRefreshRateSeconds}. (Twins: ${twinCount}) Actual: ${actualRefreshRateSeconds}. Config: `,
                    pollingConfig
                );
                return actualRefreshRateSeconds;
            };

            setPollingInterval(computeInterval(twinIds.size, pollingConfig));
            setModelUrl(sceneData.adapterResult.result.data.modelUrl);
            setSceneVisuals(sceneVisuals);
            setSceneAlerts(groupedAlerts);
        }
    }, [
        pollingInterval,
        sceneData.adapterResult.result,
        sceneId,
        scenesConfig,
        selectedLayerIds
    ]);

    return {
        modelUrl,
        sceneVisuals,
        sceneAlerts,
        isLoading: sceneData.isLoading,
        triggerRuntimeRefetch: () =>
            sceneData.callAdapter({ isManualRefresh: true }),
        lastRefreshTime: lastRefreshTime,
        nextRefreshTime: lastRefreshTime + pollingInterval
    };
};
function buildAlert(
    visual: IExpressionRangeVisual,
    sceneVisual: SceneVisual,
    behavior: IBehavior
) {
    const color = visual.valueRanges[0].visual.color;
    const meshId = sceneVisual.element.objectIDs?.[0];
    const icon = visual.valueRanges[0].visual.iconName;

    const alert = {
        sceneVisual: sceneVisual,
        sceneViewBadge: {
            id: behavior.id,
            meshId: meshId,
            color: color,
            icon: icon
        }
    };
    return alert;
}
