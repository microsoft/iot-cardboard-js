import { useEffect, useState } from 'react';
import {
    CustomMeshItem,
    RuntimeBadge,
    SceneViewBadge,
    SceneViewBadgeGroup,
    SceneVisual
} from '../Classes/SceneView.types';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import { DEFAULT_REFRESH_RATE_IN_MILLISECONDS } from '../Constants';
import { IADT3DViewerAdapter } from '../Constants/Interfaces';
import { deepCopy, getDebugLogger } from '../Services/Utils';
import { hasBadge, shouldShowVisual } from '../SharedUtils/VisualRuleUtils';
import {
    I3DScenesConfig,
    IBehavior,
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
        DEFAULT_REFRESH_RATE_IN_MILLISECONDS
    );
    const [lastRefreshTime, setLastRefreshTime] = useState<number>(null);
    const [sceneVisuals, setSceneVisuals] = useState<Array<SceneVisual>>([]);
    const [sceneBadges, setSceneBadges] = useState<Array<SceneViewBadgeGroup>>(
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
            const badgeVisuals: Array<{
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

                sceneVisual.behaviors?.forEach((behavior) => {
                    behavior.visuals?.forEach((visual) => {
                        if (!ViewerConfigUtility.isVisualRule(visual)) {
                            return;
                        }

                        visual.valueRanges.forEach((condition) => {
                            // Check if visual will be shown, then determine if it is a badge or coloring
                            if (
                                shouldShowVisual(
                                    visual.valueRangeType,
                                    sceneVisual.twins,
                                    visual.valueExpression,
                                    condition.values
                                )
                            ) {
                                if (hasBadge(condition)) {
                                    const badge = buildBadgeVisual(
                                        sceneVisual,
                                        behavior,
                                        condition.visual.iconName,
                                        condition.visual.color
                                    );
                                    badgeVisuals.push(badge);
                                } else {
                                    sceneVisual.element.objectIDs?.forEach(
                                        (meshId) => {
                                            const coloredMesh: CustomMeshItem = {
                                                meshId: meshId,
                                                color: condition.visual.color
                                            };
                                            sceneVisual.coloredMeshItems.push(
                                                coloredMesh
                                            );
                                        }
                                    );
                                }
                            }
                        });
                    });
                });
            });

            const groupedBadges: SceneViewBadgeGroup[] = [];

            badgeVisuals.forEach((badge) => {
                // create first group
                if (groupedBadges.length === 0) {
                    groupedBadges.push({
                        id:
                            badge.sceneViewBadge.meshId +
                            badge.sceneViewBadge.id,
                        element: badge.sceneVisual.element,
                        behaviors: badge.sceneVisual.behaviors,
                        twins: badge.sceneVisual.twins,
                        meshId: badge.sceneViewBadge.meshId,
                        badges: [badge.sceneViewBadge]
                    });
                } else {
                    const group = groupedBadges.find(
                        (ga) => ga.meshId === badge.sceneViewBadge.meshId
                    );

                    // add to existing group
                    if (group) {
                        group.id += badge.sceneViewBadge.id;
                        group.badges.push(badge.sceneViewBadge);
                    } else {
                        // create new group
                        groupedBadges.push({
                            id:
                                badge.sceneViewBadge.meshId +
                                badge.sceneViewBadge.id,
                            element: badge.sceneVisual.element,
                            behaviors: badge.sceneVisual.behaviors,
                            twins: badge.sceneVisual.twins,
                            meshId: badge.sceneViewBadge.meshId,
                            badges: [badge.sceneViewBadge]
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
                const fastestPossibleRefreshRateSeconds = twinCount * 500; // 2 twin/second
                const actualRefreshRateSeconds = pollingConfig.minimumPollingFrequency
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
            setSceneBadges(groupedBadges);
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
        sceneBadges,
        isLoading: sceneData.isLoading,
        triggerRuntimeRefetch: () =>
            sceneData.callAdapter({ isManualRefresh: true }),
        lastRefreshTime: lastRefreshTime,
        nextRefreshTime: lastRefreshTime + pollingInterval
    };
};

function buildBadgeVisual(
    sceneVisual: SceneVisual,
    behavior: IBehavior,
    iconName: string,
    color: string
): { sceneVisual: SceneVisual; sceneViewBadge: RuntimeBadge } {
    const meshId = sceneVisual.element.objectIDs?.[0];

    const sceneViewBadge: RuntimeBadge = {
        id: behavior.id,
        meshId: meshId,
        color: color,
        icon: iconName
    };

    return {
        sceneVisual: sceneVisual,
        sceneViewBadge: sceneViewBadge
    };
}
