import { useEffect, useState } from 'react';
import { VisualType } from '../Classes/3DVConfig';
import {
    CustomMeshItem,
    SceneViewBadge,
    SceneViewBadgeGroup,
    SceneVisual,
    TransformedElementItem,
    TransformInfo
} from '../Classes/SceneView.types';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import { IADT3DViewerAdapter } from '../Constants/Interfaces';
import { BadgeIcons } from '../Constants/BadgeIcons';
import {
    deepCopy,
    getSceneElementStatusColor,
    parseLinkedTwinExpression
} from '../Services/Utils';
import {
    I3DScenesConfig,
    IBehavior,
    IExpressionRangeVisual
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import useAdapter from './useAdapter';

export const useRuntimeSceneData = (
    adapter: IADT3DViewerAdapter,
    sceneId: string,
    scenesConfig: I3DScenesConfig,
    pollingInterval: number,
    /** Optional array of layer Ids to apply SceneVisual behavior filtering */
    selectedLayerIds: string[] = null
) => {
    const [modelUrl, setModelUrl] = useState('');
    const [sceneVisuals, setSceneVisuals] = useState<Array<SceneVisual>>([]);
    const [sceneAlerts, setSceneAlerts] = useState<Array<SceneViewBadgeGroup>>(
        []
    );

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
            let sceneVisuals = deepCopy(
                sceneData.adapterResult.result.data.sceneVisuals
            );

            if (selectedLayerIds) {
                const behaviorIdsInSelectedLayers = ViewerConfigUtility.getBehaviorIdsInSelectedLayers(
                    scenesConfig,
                    [...selectedLayerIds],
                    sceneId
                );

                // Apply layer filtering to behaviors - splice out behaviors not in selected layers
                sceneVisuals = sceneVisuals.map((sv) => ({
                    ...sv,
                    behaviors: sv.behaviors.filter((b) =>
                        behaviorIdsInSelectedLayers.includes(b.id)
                    )
                }));
            }

            const alerts: Array<{
                sceneVisual: SceneVisual;
                sceneViewBadge: SceneViewBadge;
            }> = [];

            // for each scene visual retrieve the TRANSFORMED mesh ids and update it in the scene visual
            // if they are triggered by the element's behaviors and currently active
            sceneVisuals.forEach((sceneVisual) => {
                sceneVisual.transformedElementItems = []; // initialize

                // const transformedMeshItems: Array<CustomMeshItem> = []; --> an array of all the transformed meshes
                sceneVisual.behaviors?.forEach((behavior) => {
                    behavior.visuals?.forEach((visual) => {
                        if (visual.type !== VisualType.ExpressionRangeVisual) {
                            return;
                        }

                        // get the current property value of the twin for this behavior visual
                        const currentValue = parseLinkedTwinExpression(
                            visual.valueExpression,
                            sceneVisual.twins
                        );

                        // get extensionProperties, find out if they are behaviors with transforms
                        if (visual.valueRanges[0] !== undefined) {
                            const valueRanges = visual.valueRanges;

                            // iterate through each valueRange and determine if it applies to the current mesh
                            // based on the currentValue of the evaluated valueExpression
                            valueRanges.forEach((valueRange) => {
                                const values = valueRange.values;
                                const extensionProperties =
                                    valueRange.visual.extensionProperties;
                                // if the currentValue is in the determined valueRange and extensionProperties is defined,
                                // define a CustomMeshItem as the meshId and the transform associated with the currentValue
                                if (
                                    extensionProperties &&
                                    values.includes(currentValue)
                                ) {
                                    // only add if has transform too ... currently transform is just another value set to "true"
                                    // (issues with "unknown" types unable to be an object)
                                    if (extensionProperties.transform) {
                                        //have to assume that extensionProperties will have all the right info
                                        const transform: TransformInfo = {
                                            rotation: {
                                                x: extensionProperties.xRot as number,
                                                y: extensionProperties.yRot as number,
                                                z: extensionProperties.zRot as number
                                            },
                                            position: {
                                                x: extensionProperties.xPos as number,
                                                y: extensionProperties.yPos as number,
                                                z: extensionProperties.zPos as number
                                            }
                                        };
                                        // iterate through each mesh in the element and add its meshId to a
                                        // TransformedElement object and assign the transform (as decided by
                                        // extensionProperties) to that TransformedElement
                                        // problem: who is the parent? for now, we can just do the first one ...
                                        const transformedElementItem: TransformedElementItem = {
                                            meshIds: [],
                                            parentMeshId: null,
                                            transform: null
                                        };
                                        sceneVisual.element.objectIDs?.forEach(
                                            (meshId) => {
                                                transformedElementItem.meshIds.push(
                                                    meshId
                                                );
                                            }
                                        );
                                        // for now just set parent to be first mesh
                                        transformedElementItem.parentMeshId =
                                            transformedElementItem.meshIds[0];
                                        transformedElementItem.transform = deepCopy(
                                            transform
                                        );
                                        // console.log(transformedElementItem);
                                        sceneVisual.transformedElementItems.push(
                                            transformedElementItem
                                        );
                                    }
                                }
                            });
                        }
                    });
                });
            });

            // for each scene visual retrieve the colored mesh ids and update it in the scene visual
            // if they are triggered by the element's behaviors and currently active
            sceneVisuals.forEach((sceneVisual) => {
                sceneVisual.coloredMeshItems = [];

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
                                        // coloredMeshItems.push(coloredMesh);
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

            setModelUrl(sceneData.adapterResult.result.data.modelUrl);
            setSceneVisuals(sceneVisuals);
            setSceneAlerts(groupedAlerts);
        }
    }, [
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
        triggerRuntimeRefetch: sceneData.callAdapter
    };
};
function buildAlert(
    visual: IExpressionRangeVisual,
    sceneVisual: SceneVisual,
    behavior: IBehavior
) {
    const color = visual.valueRanges[0].visual.color;
    const meshId = sceneVisual.element.objectIDs?.[0];
    const iconName = visual.valueRanges[0].visual.iconName;
    const icon = BadgeIcons?.[iconName]
        ? BadgeIcons[iconName]
        : BadgeIcons.default;

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
