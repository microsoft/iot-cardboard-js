import { IAliasedTwinProperty } from '../Constants/Interfaces';
import { deepCopy } from '../Services/Utils';
import {
    I3DScenesConfig,
    IAlertVisual,
    IBehavior,
    IDataSource,
    IElement,
    IElementTwinToObjectMappingDataSource,
    ILayer,
    IPopoverVisual,
    IScene,
    IStatusColoringVisual,
    ITwinToObjectMapping,
    IValueRange,
    IVisual
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    DatasourceType,
    ElementType,
    IBehaviorTwinAliasItem,
    IElementTwinAliasItem,
    VisualType
} from './3DVConfig';

/** Static utilty methods for operations on the configuration file. */
abstract class ViewerConfigUtility {
    /** Add new scene to config file */
    static addScene(config: I3DScenesConfig, scene: IScene): I3DScenesConfig {
        const updatedConfig = deepCopy(config);
        updatedConfig.configuration.scenes.push(scene);
        return updatedConfig;
    }

    /** Update scene with matching ID */
    static editScene(
        config: I3DScenesConfig,
        sceneId: string,
        scene: IScene
    ): I3DScenesConfig {
        const sceneIndex: number = config.configuration.scenes.findIndex(
            (s) => s.id === sceneId
        );
        const updatedConfig = deepCopy(config);
        updatedConfig.configuration.scenes[sceneIndex] = scene;

        return updatedConfig;
    }

    /** Delete scene with matching ID */
    static deleteScene(
        config: I3DScenesConfig,
        sceneId: string
    ): I3DScenesConfig {
        const sceneIndex: number = config.configuration.scenes.findIndex(
            (s) => s.id === sceneId
        );
        const updatedConfig = deepCopy(config);
        updatedConfig.configuration.scenes.splice(sceneIndex, 1);
        return updatedConfig;
    }

    /** Create new layer */
    static createNewLayer(
        config: I3DScenesConfig,
        layer: ILayer
    ): I3DScenesConfig {
        const updatedConfig = deepCopy(config);
        updatedConfig.configuration.layers.push(layer);
        return updatedConfig;
    }

    /** Edit existing layer */
    static editLayer(config: I3DScenesConfig, layer: ILayer): I3DScenesConfig {
        const updatedConfig = deepCopy(config);
        const layerToUpdateIdx = updatedConfig.configuration.layers.findIndex(
            (l) => l.id === layer.id
        );

        if (layerToUpdateIdx !== -1) {
            updatedConfig.configuration.layers[layerToUpdateIdx] = layer;
        }
        return updatedConfig;
    }

    /** Delete existing layer */
    static deleteLayer(
        config: I3DScenesConfig,
        layer: ILayer
    ): I3DScenesConfig {
        const updatedConfig = deepCopy(config);
        const layerToDeleteIdx = updatedConfig.configuration.layers.findIndex(
            (l) => l.id === layer.id
        );

        if (layerToDeleteIdx !== -1) {
            updatedConfig.configuration.layers.splice(layerToDeleteIdx, 1);
        }
        return updatedConfig;
    }

    /** Delete existing layer */
    static getActiveLayersForBehavior(
        config: I3DScenesConfig,
        behaviorId: string
    ): string[] {
        const layers = config.configuration.layers;
        const activeLayerIds: string[] = [];

        layers.forEach((layer) => {
            if (layer.behaviorIDs.includes(behaviorId)) {
                activeLayerIds.push(layer.id);
            }
        });

        return activeLayerIds;
    }

    /** Set which layers a behaivor is present in */
    static setLayersForBehavior(
        config: I3DScenesConfig,
        behaviorId: string,
        selectedLayerIds: string[]
    ) {
        // Iterate over each layer
        const layers = config.configuration.layers;
        for (const layer of layers) {
            const behaviorInLayer = layer.behaviorIDs.includes(behaviorId);
            const layerIsSelected = selectedLayerIds.includes(layer.id);

            // if behavior ID isn't valid in layer
            if (behaviorInLayer && !layerIsSelected) {
                const idxToRemove = layer.behaviorIDs.indexOf(behaviorId);
                layer.behaviorIDs.splice(idxToRemove, 1);
            }
            // if behavior ID needs to be added to layer
            else if (!behaviorInLayer && layerIsSelected) {
                layer.behaviorIDs.push(behaviorId);
            }
        }
    }

    /** Add behavior to target scene */
    static addBehavior(
        config: I3DScenesConfig,
        sceneId: string,
        behavior: IBehavior,
        selectedLayerIds: string[]
    ): I3DScenesConfig {
        const updatedConfig = deepCopy(config);
        updatedConfig.configuration.behaviors.push(behavior);
        updatedConfig.configuration.scenes
            .find((scene) => scene.id === sceneId)
            ?.behaviorIDs?.push(behavior.id);

        // Update behavior layer data
        ViewerConfigUtility.setLayersForBehavior(
            updatedConfig,
            behavior.id,
            selectedLayerIds
        );
        return updatedConfig;
    }

    /** Update behavior with matching ID.
     * Note, original behavior ID is used in case the behavior ID has been
     * changed with the update.*/
    static editBehavior(
        config: I3DScenesConfig,
        behavior: IBehavior,
        selectedLayerIds: string[]
    ): I3DScenesConfig {
        const updatedConfig = deepCopy(config);

        // Update modified behavior
        const behaviorIdx = updatedConfig.configuration.behaviors.findIndex(
            (b) => b.id === behavior.id
        );
        updatedConfig.configuration.behaviors[behaviorIdx] = behavior;

        // Update behavior layer data
        ViewerConfigUtility.setLayersForBehavior(
            updatedConfig,
            behavior.id,
            selectedLayerIds
        );

        return updatedConfig;
    }

    /** Adds existing behavior to the target scene */
    static addBehaviorToScene(
        config: I3DScenesConfig,
        sceneId: string,
        behavior: IBehavior
    ): I3DScenesConfig {
        const updatedConfig = deepCopy(config);
        updatedConfig.configuration.scenes
            .find((scene) => scene.id === sceneId)
            ?.behaviorIDs?.push(behavior.id);
        return updatedConfig;
    }

    /** Delete behavior.
     * Options for deletion from current scene, or ALL scenes.
     */
    static deleteBehavior(
        config: I3DScenesConfig,
        sceneId: string,
        behaviorId: string,
        removeFromAllScenes?: boolean
    ): I3DScenesConfig {
        const updatedConfig = deepCopy(config);

        // Remove behavior from active scene
        const activeScene = updatedConfig.configuration.scenes.find(
            (scene) => scene.id === sceneId
        );

        const matchingBehaviorIdxInActiveScene = activeScene.behaviorIDs.indexOf(
            behaviorId
        );

        if (matchingBehaviorIdxInActiveScene !== -1) {
            activeScene.behaviorIDs.splice(matchingBehaviorIdxInActiveScene, 1);
        }

        // Clean up behavior datasources when removing behavior from scene reference only
        const elementIdsInActiveScene = ViewerConfigUtility.getDictionaryOfElementsIdsInScene(
            config,
            sceneId
        );

        const behavior = config.configuration.behaviors.find(
            (b) => b.id === behaviorId
        );

        if (behavior) {
            const twinToObjectMapping = behavior.datasources.find(
                (ds) =>
                    ds.type ===
                    DatasourceType.ElementTwinToObjectMappingDataSource
            ) as IElementTwinToObjectMappingDataSource;
            if (twinToObjectMapping) {
                twinToObjectMapping.elementIDs = twinToObjectMapping.elementIDs.filter(
                    (id) => !(id in elementIdsInActiveScene)
                );
            }
        }

        if (removeFromAllScenes) {
            // Splice behavior out of behavior list
            const behaviorIdx = updatedConfig.configuration.behaviors.findIndex(
                (b) => b.id === behaviorId
            );

            if (behaviorIdx !== -1) {
                updatedConfig.configuration.behaviors.splice(behaviorIdx, 1);
            }

            // If matching behavior Id found in ANY scene, splice out scene's behavior Id array
            updatedConfig.configuration.scenes.forEach((scene) => {
                const matchingBehaviorIdIdx = scene.behaviorIDs.indexOf(
                    behaviorId
                );
                if (matchingBehaviorIdIdx !== -1) {
                    scene.behaviorIDs.splice(matchingBehaviorIdIdx, 1);
                }
            });
        }
        return updatedConfig;
    }

    /**
     * Update only passed list of elements in a scene in config
     * @param config the config to edit
     * @param sceneId the scene Id where the elements to be updated are in
     * @returns the updated config
     */
    static editElements(
        config: I3DScenesConfig,
        sceneId: string,
        updatedElements: Array<ITwinToObjectMapping>
    ): I3DScenesConfig {
        const updatedConfig = deepCopy(config);
        const updatedElementIds = updatedElements.map((e) => e.id);
        const activeSceneIdx = updatedConfig.configuration.scenes.findIndex(
            (scene) => scene.id === sceneId
        );
        const unchangedSceneElements = config.configuration.scenes[
            activeSceneIdx
        ]?.elements?.filter(
            (e) =>
                ViewerConfigUtility.isTwinToObjectMappingElement(e) &&
                !updatedElementIds.includes(e.id)
        );
        updatedConfig.configuration.scenes[activeSceneIdx].elements = [
            ...unchangedSceneElements,
            ...updatedElements
        ];

        return updatedConfig;
    }

    static getBehaviorElementIds(behavior: IBehavior): string[] {
        return (
            (behavior.datasources.find(
                (ds) =>
                    ds.type ===
                    DatasourceType.ElementTwinToObjectMappingDataSource
            ) as IElementTwinToObjectMappingDataSource)?.elementIDs || []
        );
    }

    /** Returns information about the number of element and scene references on a behavior  */
    static getBehaviorMetaData(
        config: I3DScenesConfig,
        sceneId: string,
        behavior: IBehavior
    ): { numElementsInActiveScene: number; numSceneRefs: number } {
        const dictionaryOfElementsIdsInScene = ViewerConfigUtility.getDictionaryOfElementsIdsInScene(
            config,
            sceneId
        );

        let numElementsInActiveScene = 0;

        const behaviorElementIds = ViewerConfigUtility.getBehaviorElementIds(
            behavior
        );
        behaviorElementIds.forEach((elementId) => {
            if (elementId in dictionaryOfElementsIdsInScene) {
                numElementsInActiveScene++;
            }
        });

        let numSceneRefs = 0;

        config.configuration.scenes.forEach((s) => {
            if (s.behaviorIDs.includes(behavior.id)) {
                numSceneRefs++;
            }
        });

        return {
            numElementsInActiveScene,
            numSceneRefs
        };
    }

    /** Returns information about the number of behaviors and meshes on a element  */
    static getElementMetaData(
        element: ITwinToObjectMapping,
        config: I3DScenesConfig
    ) {
        const numBehaviors = this.getBehaviorsOnElement(
            element,
            config?.configuration?.behaviors
        )?.length;
        return numBehaviors;
    }

    static getDictionaryOfElementsIdsInScene(
        config: I3DScenesConfig,
        sceneId: string
    ): Record<string, any> {
        // Build up dictionary of all active element IDs on current scene
        const scene = config.configuration.scenes?.find(
            (s) => s.id === sceneId
        );
        const elementIdMap = {};

        scene?.elements
            ?.filter(ViewerConfigUtility.isTwinToObjectMappingElement)
            .forEach((ttom) => {
                if (!(ttom.id in elementIdMap)) elementIdMap[ttom.id] = ttom;
            });

        return elementIdMap;
    }

    static getElementsInScene(
        config: I3DScenesConfig,
        sceneId: string
    ): Array<ITwinToObjectMapping> {
        const scene = config.configuration.scenes?.find(
            (s) => s.id === sceneId
        );

        return scene?.elements?.filter(
            ViewerConfigUtility.isTwinToObjectMappingElement
        );
    }

    static isElementTwinToObjectMappingDataSource(
        dataSource: IDataSource
    ): dataSource is IElementTwinToObjectMappingDataSource {
        return (
            dataSource.type ===
            DatasourceType.ElementTwinToObjectMappingDataSource
        );
    }

    static isTwinToObjectMappingElement(
        element: IElement
    ): element is ITwinToObjectMapping {
        return element.type === ElementType.TwinToObjectMapping;
    }

    static isPopoverVisual(visual: IVisual): visual is IPopoverVisual {
        return visual.type === VisualType.Popover;
    }

    static isStatusColorVisual(
        visual: IVisual
    ): visual is IStatusColoringVisual {
        return visual.type === VisualType.StatusColoring;
    }

    static isAlertVisual(visual: IVisual): visual is IAlertVisual {
        return visual.type === VisualType.Alert;
    }

    static getBehaviorsSegmentedByPresenceInScene(
        config: I3DScenesConfig,
        sceneId: string
    ): [
        behaviorsInScene: Array<IBehavior>,
        behaviorsNotInScene: Array<IBehavior>
    ] {
        const behaviors = config?.configuration?.behaviors ?? [];
        const behaviorsInScene = [];
        const behaviorsNotInScene = [];

        const scene = config.configuration.scenes.find((s) => s.id === sceneId);

        const behaviorIdsInActiveScene = scene?.behaviorIDs;

        behaviors.forEach((behavior) => {
            if (
                behaviorIdsInActiveScene &&
                behaviorIdsInActiveScene.includes(behavior.id)
            ) {
                behaviorsInScene.push(behavior);
            } else {
                behaviorsNotInScene.push(behavior);
            }
        });

        // Sanity check to ensure all behaviors have been segmented
        if (
            behaviorsInScene.length + behaviorsNotInScene.length ===
            behaviors.length
        ) {
            return [behaviorsInScene, behaviorsNotInScene];
        } else {
            return [[], behaviors];
        }
    }

    static getBehaviorsOnElement(
        element: ITwinToObjectMapping,
        behaviors: Array<IBehavior>
    ) {
        return (
            behaviors?.filter((behavior) => {
                const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
                    behavior
                );
                return dataSources?.[0]?.elementIDs?.find(
                    (id) => id === element?.id
                );
            }) || []
        );
    }

    static getAvailableBehaviorsForElement(
        element: ITwinToObjectMapping,
        behaviors: Array<IBehavior>
    ) {
        return (
            behaviors.filter((behavior) => {
                const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
                    behavior
                );
                return (
                    dataSources.length === 0 ||
                    !dataSources?.[0]?.elementIDs ||
                    !dataSources?.[0]?.elementIDs?.includes(element?.id)
                );
            }) || []
        );
    }

    static getElementTwinToObjectMappingDataSourcesFromBehavior(
        behavior: IBehavior
    ) {
        return behavior.datasources.filter(
            ViewerConfigUtility.isElementTwinToObjectMappingDataSource
        );
    }

    /**
     * Gets the list of all (union of) the active properties from the provided linked twins
     * Returns them with the Alias as a prefix. ex: LinkedTwin.MyProperty
     * @param twins List of twins the get the properties from
     * @returns list of properties with the alias prefixed (ex: LinkedTwin.MyProperty)
     */
    static getPropertyNamesWithAliasFromTwins(twins: Record<string, any>) {
        const properties = new Set<string>();
        for (const alias in twins) {
            const twin = twins[alias];
            const split = alias.split('.');
            const name = split.length ? split[0] : alias;
            for (const prop in twin) {
                if (prop.substring(0, 1) !== '$' || prop === '$dtId') {
                    properties.add(`${name}.${prop}`);
                }
            }
        }
        return Array.from(properties.values()).sort();
    }

    /**
     * Takes in the property names that have an alias at the start ex: "LinkedTwin" and splits off that prefix to only have the raw property names.
     * source of the input is usually `getPropertyNamesWithAliasFromTwins`
     * @param properties List of properties with the LinkedTwin type prefix
     * @returns list of raw property names
     */
    static getPropertyNameFromAliasedProperty(properties: string[]) {
        return properties
            .map((x) => {
                // comes back as LinkedTwin.PropertyName
                const sliced = x.split('.');
                return sliced[sliced.length - 1];
            })
            .sort();
    }

    static removeBehaviorFromList(
        behaviors: Array<IBehavior>,
        behaviorToRemove: IBehavior
    ) {
        return behaviors.filter(
            (behavior) => behavior.id !== behaviorToRemove.id
        );
    }

    static removeElementFromBehavior(
        element: ITwinToObjectMapping,
        behavior: IBehavior
    ) {
        const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
            behavior
        );
        dataSources[0].elementIDs = dataSources[0].elementIDs.filter(
            (mappingId) => mappingId !== element.id
        );
        return behavior;
    }

    static addElementToBehavior(
        element: ITwinToObjectMapping,
        behavior: IBehavior
    ) {
        const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
            behavior
        );
        if (
            dataSources?.[0]?.elementIDs &&
            !dataSources[0].elementIDs.includes(element.id)
        ) {
            dataSources[0].elementIDs.push(element.id);
        } else {
            dataSources[0] = {
                type: DatasourceType.ElementTwinToObjectMappingDataSource,
                elementIDs: [element.id]
            };
        }

        return behavior;
    }

    static getColorOrNullFromStatusValueRange(
        ranges: IValueRange[],
        value: number
    ): string | null {
        let color = null;
        if (ranges) {
            for (const range of ranges) {
                if (value >= Number(range.min) && value < Number(range.max)) {
                    color = range.color;
                }
            }
        }

        return color;
    }

    static getMatchingRangeFromValue(
        ranges: IValueRange[],
        value: number
    ): IValueRange | null {
        let targetRange: IValueRange = null;
        if (ranges) {
            for (const range of ranges) {
                if (value >= Number(range.min) && value < Number(range.max)) {
                    targetRange = range;
                }
            }
        }

        return targetRange;
    }
    static getGaugeWidgetConfiguration(
        ranges: IValueRange[],
        value: number
    ): {
        domainMin: number;
        domainMax: number;
        percent: number;
        colors: string[];
        nrOfLevels: number;
    } {
        const defaultMinGaugeDomain = -100;
        const defaultMaxGaugeDomain = 100;
        let domainMin = Number('Infinity');
        let domainMax = Number('-Infinity');
        let nrOfLevels = ranges.length;

        for (const valueRange of ranges) {
            const numericValueRangeMin = Number(valueRange.min);
            const numericValueRangeMax = Number(valueRange.max);

            // Find minimum range value
            if (numericValueRangeMin < domainMin) {
                domainMin = numericValueRangeMin;
            }

            // Find maximum range value
            if (numericValueRangeMax > domainMax) {
                domainMax = numericValueRangeMax;
            }
        }

        // If minimum is not finite -- snap to default min
        if (!isFinite(domainMin)) {
            domainMin = defaultMinGaugeDomain;
        }

        // If maximum is not finite -- snap to default max
        if (!isFinite(domainMin)) {
            domainMin = defaultMaxGaugeDomain;
        }

        const targetRange = ViewerConfigUtility.getMatchingRangeFromValue(
            ranges,
            value
        );
        const isOutOfValueRange = targetRange === null;

        const sortedRanges = ranges.sort(
            (a, b) => Number(a.min) - Number(b.min)
        );
        let outOfRangeColorInsertionIndex = sortedRanges.length;

        const gaugeRanges = sortedRanges.map((vr) => ({
            color: vr.color,
            id: vr.id
        }));

        if (isOutOfValueRange) {
            for (let i = 0; i < sortedRanges.length; i++) {
                if (value < Number(sortedRanges[i].min)) {
                    outOfRangeColorInsertionIndex = i;
                    break;
                }
            }
            gaugeRanges.splice(outOfRangeColorInsertionIndex, 0, {
                color: 'var(--cb-color-bg-canvas-inset)',
                id: 'OUT_OF_RANGE_ID'
            });
            nrOfLevels++;
        }

        let percent = (value - domainMin) / (domainMax - domainMin);

        if (percent > 1) {
            percent = 1;
        } else if (percent < 0) {
            percent = 0;
        } else {
            const targetId = isOutOfValueRange
                ? 'OUT_OF_RANGE_ID'
                : targetRange.id;

            // Find index into gauge colors to target
            const rangeIdx =
                gaugeRanges.findIndex((gr) => gr.id === targetId) || 0;

            // Snap percent to center of color range
            const rangeAnchors = [];
            const increment = 1 / nrOfLevels;
            let currentAnchor = increment / 2;
            while (currentAnchor < 1) {
                rangeAnchors.push(currentAnchor);
                currentAnchor += increment;
            }

            percent = rangeAnchors[rangeIdx];
        }

        return {
            domainMin,
            domainMax,
            percent,
            colors: gaugeRanges.map((gr) => gr.color),
            nrOfLevels
        };
    }

    static getMappingIdsForBehavior(behavior: IBehavior) {
        const mappingIds: string[] = [];
        // cycle through the datasources of behavior
        for (const dataSource of behavior.datasources) {
            // if its a TwinToObjectMappingDatasource get the mapping id
            if (
                dataSource.type ===
                DatasourceType.ElementTwinToObjectMappingDataSource
            ) {
                dataSource.elementIDs.forEach((mappingId) => {
                    mappingIds.push(mappingId);
                });
            }
        }

        return mappingIds;
    }

    static addTwinAliasToElement(
        element: ITwinToObjectMapping,
        alias: string,
        aliasedTwinId: string
    ): void {
        if (element && alias && aliasedTwinId) {
            if (element.twinAliases) {
                element.twinAliases[alias] = aliasedTwinId;
            } else {
                element.twinAliases = {
                    [alias]: aliasedTwinId
                };
            }
        }
    }

    static getTwinAliasItemsFromBehaviorAndElements = (
        behavior: IBehavior,
        selectedElementsForBehavior: Array<ITwinToObjectMapping>
    ): Array<IBehaviorTwinAliasItem> => {
        const twinAliases: Array<IBehaviorTwinAliasItem> = [];
        behavior.twinAliases?.forEach((behaviorTwinAlias) => {
            twinAliases.push({
                alias: behaviorTwinAlias,
                elementToTwinMappings: []
            });
        });
        twinAliases?.forEach((behaviorTwinAliasItem) => {
            selectedElementsForBehavior?.forEach((element) => {
                if (element.twinAliases?.[behaviorTwinAliasItem.alias]) {
                    const aliasedTwinId =
                        element.twinAliases?.[behaviorTwinAliasItem.alias];

                    behaviorTwinAliasItem.elementToTwinMappings.push({
                        twinId: aliasedTwinId,
                        elementId: element.id
                    });
                } else {
                    behaviorTwinAliasItem.elementToTwinMappings.push({
                        twinId: null,
                        elementId: element.id
                    });
                }
            });
        });
        return twinAliases;
    };

    static getTwinAliasItemsFromElement = (
        element: ITwinToObjectMapping
    ): Array<IElementTwinAliasItem> => {
        const twinAliases: Array<IElementTwinAliasItem> = [];
        if (element.twinAliases) {
            Object.keys(element.twinAliases).forEach((alias) => {
                const aliasedTwinId = element.twinAliases[alias];
                twinAliases.push({ alias: alias, twinId: aliasedTwinId });
            });
        }

        return twinAliases;
    };

    /**
     * Gets config, sceneId and selected elements in a behavior
     * Returns twin alias items available for a behavior to add which is
     * a union of twin aliases from behaviors in the scene and
     * selected elements in the scene
     * @param config
     * @param sceneId
     * @param selectedElements list of elements existing/selected in a behavior from scene
     * @returns list of twin alias items available to add to a behavior
     */
    static getAvailableBehaviorTwinAliasItemsBySceneAndElements = (
        config,
        sceneId,
        selectedElements
    ): Array<IBehaviorTwinAliasItem> => {
        const twinAliases: Array<IBehaviorTwinAliasItem> = [];
        const [
            behaviorsInScene
        ] = ViewerConfigUtility.getBehaviorsSegmentedByPresenceInScene(
            config,
            sceneId
        );
        // get twin aliases defined in all behaviors in the current scene
        behaviorsInScene?.forEach((behaviorInScene) => {
            const twinAliasesFromBehavior = ViewerConfigUtility.getTwinAliasItemsFromBehaviorAndElements(
                behaviorInScene,
                selectedElements
            );
            twinAliasesFromBehavior.forEach((twinAliasFromBehavior) => {
                if (
                    !twinAliases.find(
                        (twinAlias) =>
                            twinAlias.alias === twinAliasFromBehavior.alias
                    )
                ) {
                    twinAliases.push(twinAliasFromBehavior);
                }
            });
        });

        // merge it with the twin aliases defined in all the elements added to the current behavior
        selectedElements?.forEach((element) => {
            if (element.twinAliases) {
                Object.keys(element.twinAliases).forEach(
                    (twinAliasInElement) => {
                        if (
                            twinAliases.findIndex(
                                (twinAlias) =>
                                    twinAlias.alias === twinAliasInElement
                            ) === -1
                        ) {
                            twinAliases.push({
                                alias: twinAliasInElement,
                                elementToTwinMappings: [
                                    {
                                        elementId: element.id,
                                        twinId:
                                            element.twinAliases[
                                                twinAliasInElement
                                            ]
                                    }
                                ]
                            });
                        } else {
                            const elementIdsForThisAlias = twinAliases
                                .find(
                                    (twinAlias) =>
                                        twinAlias.alias === twinAliasInElement
                                )
                                .elementToTwinMappings.map(
                                    (mapping) => mapping.elementId
                                );
                            if (!elementIdsForThisAlias.includes(element.id)) {
                                twinAliases
                                    .find(
                                        (twinAlias) =>
                                            twinAlias.alias ===
                                            twinAliasInElement
                                    )
                                    .elementToTwinMappings.push({
                                        elementId: element.id,
                                        twinId:
                                            element.twinAliases[
                                                twinAliasInElement
                                            ]
                                    });
                            }
                        }
                    }
                );
            }
        });

        return twinAliases;
    };

    /**
     * Gets an alias and list of aliased properties
     * Returns the name of the properties having that alias
     * @param alias
     * @param aliasedProperties
     * @returns string list of property names
     */
    static getPropertyNamesFromAliasedPropertiesByAlias = (
        alias: string,
        aliasedProperties: Array<IAliasedTwinProperty>
    ): Array<string> => {
        return aliasedProperties
            .filter((aP) => aP.alias === alias)
            .map((aP) => aP.property);
    };

    /**
     * Gets an list of aliased properties
     * Returns list of unique aliases
     * @param aliasedProperties
     * @returns string list of aliases
     */
    static getUniqueAliasNamesFromAliasedProperties = (
        aliasedProperties: Array<IAliasedTwinProperty>
    ): Array<string> => {
        const aliases = [];
        aliasedProperties?.forEach((aP) => {
            if (!aliases.includes(aP.alias)) {
                aliases.push(aP.alias);
            }
        });
        return aliases;
    };

    /**
     * Gets a behavior and its elements
     * Returns the result of check if any of the twin ids in element to twin mappings
     * in any of the twin aliases in behavior is null/not set
     * @param behavior
     * @param elementsInBehavior to read the element to twin mappings for each alias defined in behavior
     * @returns boolean if twin aliases linked to a behavior is valid with all element to twin mappings filled
     */
    static areTwinAliasesValidInBehavior = (
        behavior: IBehavior,
        selectedElementsForBehavior: Array<ITwinToObjectMapping>
    ): boolean => {
        let isValid = true;
        const behaviorTwinAliases = ViewerConfigUtility.getTwinAliasItemsFromBehaviorAndElements(
            behavior,
            selectedElementsForBehavior
        );

        if (behaviorTwinAliases.length) {
            isValid = !behaviorTwinAliases.some((twinAliasItem) =>
                twinAliasItem.elementToTwinMappings.some(
                    (mapping) => !mapping.twinId || !mapping.elementId
                )
            );
        }
        return isValid;
    };
}

export default ViewerConfigUtility;
