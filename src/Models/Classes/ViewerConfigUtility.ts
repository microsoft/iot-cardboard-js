import { DEFAULT_LAYER_ID } from '../../Components/LayerDropdown/LayerDropdown';
import {
    MINIMUM_REFRESH_RATE_IN_MILLISECONDS,
    PRIMARY_TWIN_NAME
} from '../Constants';
import { DTwin, IAliasedTwinProperty } from '../Constants/Interfaces';
import { deepCopy, getDebugLogger } from '../Services/Utils';
import {
    I3DScenesConfig,
    IBehavior,
    IDataSource,
    IDTDLPropertyType,
    IElement,
    IElementTwinToObjectMappingDataSource,
    IExpressionRangeVisual,
    ILayer,
    IPollingConfiguration,
    IPollingStrategy,
    IPopoverVisual,
    IScene,
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
import { SceneVisual } from './SceneView.types';

const debugLogging = true;
const DEBUG_CONTEXT = 'ViewerConfigUtility';

/** Static utilty methods for operations on the configuration file. */
abstract class ViewerConfigUtility {
    static getSceneById(
        config: I3DScenesConfig,
        sceneId: string
    ): IScene | undefined {
        return config?.configuration.scenes.find((s) => s.id === sceneId);
    }

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

    /** Scene polling configuration */
    static getPollingConfig(
        config: I3DScenesConfig,
        sceneId: string
    ): IPollingConfiguration {
        const logDebugConsole = getDebugLogger(DEBUG_CONTEXT, debugLogging);
        const defaultConfig: IPollingConfiguration = {
            pollingStrategy: 'Realtime',
            minimumPollingFrequency: MINIMUM_REFRESH_RATE_IN_MILLISECONDS
        };
        if (config && sceneId) {
            const scene = this.getSceneById(config, sceneId);
            if (scene && scene.pollingConfiguration) {
                logDebugConsole(
                    'debug',
                    'Found polling configuration in config',
                    scene.pollingConfiguration
                );
                return scene.pollingConfiguration;
            }
        }

        logDebugConsole(
            'debug',
            'No polling configuration found in config, using default',
            defaultConfig
        );
        return defaultConfig;
    }

    /**
     * Sets the polling strategy value in the configuration file
     * @param config current configuration file
     * @param sceneId the current scene id
     * @param pollingStrategy the strategy to set in the config
     * @returns boolean indicating success
     */
    static setPollingStrategy(
        config: I3DScenesConfig,
        sceneId: string,
        pollingStrategy: IPollingStrategy
    ): boolean {
        const logDebugConsole = getDebugLogger(DEBUG_CONTEXT, debugLogging);
        if (config && sceneId && pollingStrategy) {
            const scene = this.getSceneById(config, sceneId);
            if (scene) {
                logDebugConsole(
                    'debug',
                    `Updating polling strategy from ${scene.pollingConfiguration?.pollingStrategy} to ${pollingStrategy}`
                );
                scene.pollingConfiguration = {
                    ...scene.pollingConfiguration,
                    pollingStrategy: pollingStrategy
                };
                // set the rate back to the default if changing strategy
                if (pollingStrategy === 'Realtime') {
                    scene.pollingConfiguration.minimumPollingFrequency = MINIMUM_REFRESH_RATE_IN_MILLISECONDS;
                }
                return true;
            } else {
                console.error(
                    `Unable to find the scene (id: ${sceneId}) to update the polling configuration`
                );
            }
        } else {
            console.error(
                'Invalid arguments. Unable to update the polling configuration.'
            );
        }
        return false;
    }
    /**
     * sets the polling refresh rate in the config
     * @param config current configuration file
     * @param sceneId current scene id
     * @param rateInMilliseconds the rate to set in milliseconds
     * @returns boolean indicating success
     */
    static setPollingRate(
        config: I3DScenesConfig,
        sceneId: string,
        rateInMilliseconds: number
    ): boolean {
        const logDebugConsole = getDebugLogger(DEBUG_CONTEXT, debugLogging);
        if (config && sceneId) {
            const scene = this.getSceneById(config, sceneId);
            if (scene) {
                logDebugConsole(
                    'debug',
                    `Updating polling rate from ${scene.pollingConfiguration?.minimumPollingFrequency} to ${rateInMilliseconds}`
                );
                scene.pollingConfiguration = {
                    ...scene.pollingConfiguration,
                    minimumPollingFrequency: rateInMilliseconds
                };
                return true;
            } else {
                console.error(
                    `Unable to find the scene (id: ${sceneId}) to update the polling configuration`
                );
            }
        } else {
            console.error(
                'Invalid arguments. Unable to update the polling configuration.'
            );
        }
        return false;
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

    /** Gets a given behavior from the config */
    static getBehaviorById(
        config: I3DScenesConfig,
        behaviorId: string
    ): IBehavior | undefined {
        if (!config || !behaviorId) return undefined;

        return config?.configuration?.behaviors?.find(
            (x) => x.id === behaviorId
        );
    }

    /** Gets a given element from the config */
    static getElementById(
        config: I3DScenesConfig,
        elementId: string
    ): ITwinToObjectMapping | undefined {
        if (!config || !elementId) return undefined;
        let element: ITwinToObjectMapping = undefined;

        config?.configuration?.scenes?.forEach((scene) => {
            element = scene.elements
                .filter(this.isTwinToObjectMappingElement)
                .find((element) => element.id === elementId);

            // return as soon as we find one
            if (element) {
                return element;
            }
        });

        return element;
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

        if (selectedLayerIds) {
            // Update behavior layer data
            ViewerConfigUtility.setLayersForBehavior(
                updatedConfig,
                behavior.id,
                selectedLayerIds
            );
        }
        return updatedConfig;
    }

    /** Update behavior with matching ID.
     * Note, original behavior ID is used in case the behavior ID has been
     * changed with the update.*/
    static editBehavior(
        config: I3DScenesConfig,
        behavior: IBehavior,
        selectedLayerIds?: string[],
        removedElements?: ITwinToObjectMapping[]
    ): I3DScenesConfig {
        const updatedConfig = deepCopy(config);
        const updatedBehavior = deepCopy(behavior);

        // Find behavior in config
        const behaviorIdx = updatedConfig.configuration.behaviors.findIndex(
            (b) => b.id === behavior.id
        );

        // Get element ids from config (old) and form behavior (new)
        const oldElementsDataSource = updatedConfig.configuration.behaviors[
            behaviorIdx
        ]?.datasources.find(
            (b) =>
                b.type === DatasourceType.ElementTwinToObjectMappingDataSource
        ) as IElementTwinToObjectMappingDataSource;
        const newElementsDataSource = updatedBehavior.datasources.find(
            (b) =>
                b.type === DatasourceType.ElementTwinToObjectMappingDataSource
        ) as IElementTwinToObjectMappingDataSource;

        // If found, remove elements that have been cleared out from old config
        // and merge with new behavior values
        if (oldElementsDataSource && newElementsDataSource) {
            let oldElementIds = [...oldElementsDataSource.elementIDs];
            if (removedElements) {
                const removedElementIds = removedElements.map(
                    (element) => element.id
                );
                oldElementIds = oldElementsDataSource.elementIDs.filter(
                    (elementid) => !removedElementIds.includes(elementid)
                );
            }
            const mergedElementIds = Array.from(
                new Set([...oldElementIds, ...newElementsDataSource.elementIDs])
            );
            newElementsDataSource.elementIDs = mergedElementIds;
        }

        // Update modified behavior
        updatedConfig.configuration.behaviors[behaviorIdx] = updatedBehavior;

        if (selectedLayerIds) {
            // Update behavior layer data
            ViewerConfigUtility.setLayersForBehavior(
                updatedConfig,
                behavior.id,
                selectedLayerIds
            );
        }

        return updatedConfig;
    }

    /**
     * Adds existing behavior to the target scene
     * @param config configuration data for the scene
     * @param sceneId id of the scene to update
     * @param behavior behavior to add to the scene
     * @param updateInPlace whether to update the config object provided or return a new copy
     * @returns
     */
    static addBehaviorToScene(
        config: I3DScenesConfig,
        sceneId: string,
        behavior: IBehavior,
        updateInPlace = false
    ): I3DScenesConfig {
        const updatedConfig = updateInPlace ? config : deepCopy(config);
        const currentScene = updatedConfig.configuration.scenes.find(
            (scene) => scene.id === sceneId
        );
        const behaviorIdsInScene = currentScene.behaviorIDs || [];
        if (!behaviorIdsInScene.includes(behavior.id)) {
            behaviorIdsInScene.push(behavior.id);
        }

        currentScene.behaviorIDs = behaviorIdsInScene;
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

            // If matching behavior Id found in ANY layers, splice out layers's behavior Id array
            updatedConfig.configuration.layers.forEach((layer) => {
                const matchingBehaviorIdIdx = layer.behaviorIDs.indexOf(
                    behaviorId
                );
                if (matchingBehaviorIdIdx !== -1) {
                    layer.behaviorIDs.splice(matchingBehaviorIdIdx, 1);
                }
            });
        }
        return updatedConfig;
    }

    /**
     * Gets both primary & aliased twin Ids for a behavior in the context
     * of a specfic scene.
     * @param behavior The behavior pull Ids from
     * @param config The 3D scenes config object
     * @param sceneId The scene Id from which to match elements
     * @returns `primaryTwinIds` & `aliasedTwinMap`
     */
    static getTwinIdsForBehaviorInScene(
        behavior: IBehavior,
        config: I3DScenesConfig,
        sceneId: string
    ): { primaryTwinIds: string[]; aliasedTwinMap: Record<string, string[]> } {
        const scene = config.configuration.scenes.find(
            (scene) => scene.id === sceneId
        );
        const primaryTwinIds = new Set<string>();
        const internalAliasedTwinUniqueMap: Record<string, Set<string>> = {};

        // Get all element Ids associated with the behavior
        const elementIds = ViewerConfigUtility.getElementIdsForBehavior(
            behavior
        );

        // Build up set of primaryTwinIds in scene
        scene.elements
            .filter(this.isTwinToObjectMappingElement)
            .forEach((elementInScene) => {
                // Check if objects Ids on element intersect with elementIds on behavior
                if (elementIds.includes(elementInScene.id)) {
                    // Add elements primary twin
                    primaryTwinIds.add(elementInScene.primaryTwinID);

                    // Only add element alias if behavior contains alias
                    if (behavior.twinAliases && elementInScene.twinAliases) {
                        for (const [
                            elementAlias,
                            aliasedTwinId
                        ] of Object.entries(elementInScene.twinAliases)) {
                            if (behavior.twinAliases.includes(elementAlias)) {
                                if (
                                    elementAlias in internalAliasedTwinUniqueMap
                                ) {
                                    internalAliasedTwinUniqueMap[
                                        elementAlias
                                    ].add(aliasedTwinId);
                                } else {
                                    internalAliasedTwinUniqueMap[
                                        elementAlias
                                    ] = new Set([aliasedTwinId]);
                                }
                            }
                        }
                    }
                }
            });

        const aliasedTwinMap: Record<string, string[]> = {};

        // Transform unique set of alias Ids into string array
        for (const key of Object.keys(internalAliasedTwinUniqueMap)) {
            aliasedTwinMap[key] = Array.from(
                internalAliasedTwinUniqueMap[key].values()
            );
        }

        return {
            aliasedTwinMap,
            primaryTwinIds: Array.from(primaryTwinIds.values())
        };
    }

    /**
     * Update only passed list of elements in a scene in config
     * @param config the config to edit
     * @param sceneId the scene Id where the elements to be updated are in
     * @returns the updated config
     */
    static updateElementsInScene(
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
            element?.id,
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
        if (!config) return [];

        const scene = ViewerConfigUtility.getSceneById(config, sceneId);

        return (
            scene?.elements?.filter(
                ViewerConfigUtility.isTwinToObjectMappingElement
            ) || []
        );
    }

    static getLayersInScene(
        config: I3DScenesConfig,
        sceneId: string
    ): Array<ILayer> {
        if (!config) return [];

        // Get behaviors in scene
        const behaviorIdsInScene = ViewerConfigUtility.getBehaviorIdsInScene(
            config,
            sceneId
        );

        // Filter layers by matching behavior Id present
        const layersInScene = config.configuration.layers.filter((layer) =>
            layer.behaviorIDs.some((behaviorId) =>
                behaviorIdsInScene.includes(behaviorId)
            )
        );

        return layersInScene;
    }

    static getUnlayeredBehaviorIdsInScene(
        config: I3DScenesConfig,
        sceneId: string
    ) {
        if (!config) return [];

        const behaviorIdsInScene = ViewerConfigUtility.getBehaviorIdsInScene(
            config,
            sceneId
        );
        const layersInScene = ViewerConfigUtility.getLayersInScene(
            config,
            sceneId
        );
        const layeredBehaviorIds = new Set();

        // Construct map of all behavior Ids contained in layers in the scene
        layersInScene.forEach((layer) => {
            layer.behaviorIDs.forEach((behaviorId) => {
                layeredBehaviorIds.add(behaviorId);
            });
        });

        // Find behavior Ids in the scene with no associated layer
        const unlayeredBehaviorIdMap = new Set();
        behaviorIdsInScene.forEach((behaviorId) => {
            if (!layeredBehaviorIds.has(behaviorId)) {
                unlayeredBehaviorIdMap.add(behaviorId);
            }
        });

        return Array.from(unlayeredBehaviorIdMap.values());
    }

    static getBehaviorIdsInSelectedLayers(
        config: I3DScenesConfig,
        selectedLayerIds: string[],
        sceneId: string
    ) {
        if (!config) return [];
        const selectedLayers = deepCopy(selectedLayerIds);
        const uniqueBehaviorIds = new Map();

        // Check if unlayered behavior mode selected
        const isUnlayeredBehaviorActive = selectedLayers.includes(
            DEFAULT_LAYER_ID
        );

        if (isUnlayeredBehaviorActive) {
            // Remove unlayered behavior key from id array
            selectedLayers.splice(selectedLayers.indexOf(DEFAULT_LAYER_ID), 1);

            // Add all behaviors WITHOUT LAYERS in scene to Id dict
            const unlayeredBehaviorIdsInScene = ViewerConfigUtility.getUnlayeredBehaviorIdsInScene(
                config,
                sceneId
            );
            unlayeredBehaviorIdsInScene.forEach((id) =>
                uniqueBehaviorIds.set(id, '')
            );
        }

        // Add behavior Ids from selected scene layers to Id dict
        config?.configuration.layers.forEach((layer) => {
            if (selectedLayers.includes(layer.id)) {
                layer.behaviorIDs.forEach((behaviorId) => {
                    uniqueBehaviorIds.set(behaviorId, '');
                });
            }
        });

        return Array.from(uniqueBehaviorIds.keys());
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
    ): visual is IExpressionRangeVisual {
        return (
            visual.type === VisualType.ExpressionRangeVisual &&
            visual.expressionType === 'NumericRange'
        );
    }

    static isAlertVisual(visual: IVisual): visual is IExpressionRangeVisual {
        return (
            visual.type === VisualType.ExpressionRangeVisual &&
            visual.expressionType === 'CategoricalValues'
        );
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

        const behaviorIdsInActiveScene = ViewerConfigUtility.getBehaviorIdsInScene(
            config,
            sceneId
        );

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

    static getBehaviorIdsInScene(config: I3DScenesConfig, sceneId: string) {
        const scene = ViewerConfigUtility.getSceneById(config, sceneId);
        return scene?.behaviorIDs || [];
    }

    /** gets all the behaviors in a given scene or empty array if none found */
    static getBehaviorsInScene(
        config: I3DScenesConfig,
        sceneId: string
    ): IBehavior[] {
        const logDebugConsole = getDebugLogger(DEBUG_CONTEXT, debugLogging);
        if (!config || !sceneId) {
            logDebugConsole(
                'warn',
                '[getBehaviorsInScene] [ABORT], critical argument missing {config, sceneId}',
                config,
                sceneId
            );
            return [];
        }
        const behaviorIds = ViewerConfigUtility.getBehaviorIdsInScene(
            config,
            sceneId
        );
        const behaviorsInAllScenes = config.configuration?.behaviors;
        if (!behaviorIds?.length || !behaviorsInAllScenes?.length) {
            return [];
        }

        const behaviors = behaviorsInAllScenes.filter((x) =>
            behaviorIds.includes(x.id)
        );
        return behaviors || [];
    }

    static getBehaviorsForElementId(
        config: I3DScenesConfig,
        elementId: string
    ): IBehavior[] | undefined {
        const logDebugConsole = getDebugLogger(DEBUG_CONTEXT, debugLogging);
        if (!config || !elementId) {
            logDebugConsole(
                'warn',
                '[getBehaviorsForElementId] [ABORT], critical argument missing {config, elementId}',
                config,
                elementId
            );
            return [];
        }
        const behaviors = config.configuration?.behaviors || [];
        return ViewerConfigUtility.getBehaviorsOnElement(elementId, behaviors);
    }

    /** get a list of behaviors that are associated with a given element */
    static getBehaviorsOnElement(
        elementId: string,
        behaviors: Array<IBehavior>
    ): IBehavior[] {
        if (!elementId || !behaviors?.length) return [];
        return (
            behaviors?.filter((behavior) => {
                const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
                    behavior
                );
                return dataSources?.[0]?.elementIDs?.find(
                    (id) => id === elementId
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
     * Gets the list of all (union of) the active properties from the provided primary twins
     * Returns them with the Alias as a prefix. ex: PrimaryTwin.MyProperty
     * @param twins List of twins the get the properties from
     * @returns list of properties with the alias prefixed (ex: PrimaryTwin.MyProperty)
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
     * Takes in the property names that have an alias at the start ex: "PrimaryTwin" and splits off that prefix to only have the raw property names.
     * source of the input is usually `getPropertyNamesWithAliasFromTwins`
     * @param properties List of properties with the PrimaryTwin type prefix
     * @returns list of raw property names
     */
    static getPropertyNameFromAliasedProperty(properties: string[]) {
        return properties
            .map((x) => {
                // comes back as PrimaryTwin.PropertyName
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

    static removeElementFromBehavior(elementId: string, behavior: IBehavior) {
        const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
            behavior
        );
        dataSources[0].elementIDs = dataSources[0].elementIDs.filter(
            (mappingId) => mappingId !== elementId
        );
        behavior.datasources = dataSources;

        return behavior;
    }

    static addElementToBehavior(elementId: string, behavior: IBehavior) {
        const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
            behavior
        );
        // initialized
        if (dataSources?.[0]?.elementIDs) {
            // add it
            if (!dataSources[0].elementIDs.includes(elementId)) {
                dataSources[0].elementIDs.push(elementId);
            }
        } else {
            // not initialized, create the data source
            dataSources[0] = {
                type: DatasourceType.ElementTwinToObjectMappingDataSource,
                elementIDs: [elementId]
            };
        }
        behavior.datasources = dataSources;

        return behavior;
    }

    static getColorOrNullFromStatusValueRange(
        ranges: IValueRange[],
        value: number
    ): string | null {
        let color = null;
        if (ranges) {
            for (const range of ranges) {
                if (
                    value >= Number(range.values[0]) &&
                    value < Number(range.values[1])
                ) {
                    color = range.visual.color;
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
                if (
                    value >= Number(range.values[0]) &&
                    value < Number(range.values[1])
                ) {
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
            const numericValueRangeMin = Number(valueRange.values[0]);
            const numericValueRangeMax = Number(valueRange.values[1]);

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
            (a, b) => Number(a.values[0]) - Number(b.values[1])
        );
        let outOfRangeColorInsertionIndex = sortedRanges.length;

        const gaugeRanges = sortedRanges.map((vr) => ({
            color: vr.visual.color,
            id: vr.id
        }));

        if (isOutOfValueRange) {
            for (let i = 0; i < sortedRanges.length; i++) {
                if (value < Number(sortedRanges[i].values[0])) {
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

    static getElementIdsForBehavior(behavior: IBehavior) {
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

    /** Given a draft behavior, current config & set of selected elements for behavior
     *  @returns copy of config with behavior & element updates applied to target scene
     */
    static copyConfigWithBehaviorAndElementEditsApplied = (
        config: I3DScenesConfig,
        behavior: IBehavior,
        selectedElements: ITwinToObjectMapping[],
        sceneId: string
    ) => {
        // Copy config
        let configSnapshot = deepCopy(config);

        // Apply draft behavior to config
        if (
            configSnapshot.configuration.behaviors
                .map((b) => b.id)
                .includes(behavior.id)
        ) {
            configSnapshot = ViewerConfigUtility.editBehavior(
                configSnapshot,
                behavior,
                []
            );
        } else {
            configSnapshot = ViewerConfigUtility.addBehavior(
                configSnapshot,
                sceneId,
                behavior,
                []
            );
        }

        // Apply updated elements to config
        configSnapshot = ViewerConfigUtility.updateElementsInScene(
            configSnapshot,
            sceneId,
            selectedElements ?? []
        );

        return configSnapshot;
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
    static hasGlobeCoordinates = (sceneList: IScene[]) => {
        const scene = sceneList.find(
            (s) => s?.latitude !== undefined || s?.longitude !== undefined
        );
        return scene ? true : false;
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

    /**
     * Gets an expression value which can by any and data type
     * Returns the result of the data transformation of that value for the given type
     * @param value the value of the expression in any type
     * @param dataType the type of the expression to be used for the transformation
     * @returns expression value in the given type
     * 
     * Date / Time Format based on RFC 3339: 
     *  date-fullyear   = 4DIGIT
        date-month      = 2DIGIT  ; 01-12
        date-mday       = 2DIGIT  ; 01-28, 01-29, 01-30, 01-31 based on
                                    ; month/year
        time-hour       = 2DIGIT  ; 00-23
        time-minute     = 2DIGIT  ; 00-59
        time-second     = 2DIGIT  ; 00-58, 00-59, 00-60 based on leap second
                                    ; rules
        time-secfrac    = "." 1*DIGIT
        time-numoffset  = ("+" / "-") time-hour ":" time-minute
        time-offset     = "Z" / time-numoffset

        partial-time    = time-hour ":" time-minute ":" time-second
                            [time-secfrac]
        full-date       = date-fullyear "-" date-month "-" date-mday
        full-time       = partial-time time-offset

        date-time       = full-date "T" full-time
     */
    static getTypedDTDLPropertyValue(
        value: unknown,
        dataType: IDTDLPropertyType
    ) {
        try {
            const stringifiedValue = String(value); // cast to string in case the value originally does not comply with its original type

            switch (dataType) {
                case 'boolean':
                    return stringifiedValue === 'true';
                case 'date': {
                    // Format: full-date, e.g. 1970-01-01
                    const d = new Date(stringifiedValue);
                    return d;
                }
                case 'dateTime': {
                    // Format: date-time, e.g. 2019-10-12T07:20:50.52Z
                    const d = new Date(stringifiedValue);
                    return d;
                }
                case 'double':
                    return parseFloat(stringifiedValue);
                case 'duration': {
                    // Format: P(n)Y(n)M(n)DT(n)H(n)M(n)S, e.g. P3Y6M4DT12H30M5S
                    const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
                    const [, years, months, , days, hours, minutes, seconds] =
                        stringifiedValue?.match(regex)?.map(parseFloat) || []; // period and weeks are not used

                    return {
                        years,
                        months,
                        days,
                        hours,
                        minutes,
                        seconds
                    };
                }
                case 'enum': // Format: string, e.g. 'Active'
                    return stringifiedValue;
                case 'float':
                    return parseFloat(stringifiedValue);
                case 'integer':
                case 'long':
                    return parseInt(stringifiedValue);
                case 'string':
                    return stringifiedValue;
                case 'time': {
                    // Format: partial-time time-offset, e.g. 07:20:50.52Z
                    return stringifiedValue;
                }
                default:
                    return stringifiedValue;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static getSceneVisualsInScene(
        config: I3DScenesConfig,
        sceneId: string,
        twinData: Map<string, DTwin>
    ): SceneVisual[] {
        const logDebugConsole = getDebugLogger(DEBUG_CONTEXT, debugLogging);
        logDebugConsole(
            'debug',
            '[getSceneVisualsInScene] [START] building scene visuals. {sceneId, config}',
            sceneId,
            config
        );

        if (!sceneId || !config) {
            logDebugConsole(
                'warn',
                '[getSceneVisualsInScene] [ABORT], critical argument missing. {sceneId, config}',
                sceneId,
                config
            );
            return [];
        }

        const sceneVisuals: SceneVisual[] = [];
        const elements = ViewerConfigUtility.getElementsInScene(
            config,
            sceneId
        );

        // cycle through elements to get twins for behavior and scene
        for (const element of elements) {
            const twins: Record<string, DTwin> = {};
            twins[PRIMARY_TWIN_NAME] = twinData.get(element.primaryTwinID);

            // check for twin aliases and add to twins object
            if (element.twinAliases) {
                for (const alias of Object.entries(element.twinAliases)) {
                    const aliasName = alias[0];
                    const twinId = alias[1];
                    twins[aliasName] = twinData.get(twinId);
                }
            }

            // get all the behaviors the element is part of
            const behaviors =
                ViewerConfigUtility.getBehaviorsForElementId(
                    config,
                    element.id
                ) || [];

            const sceneVisual = new SceneVisual(element, behaviors, twins);
            sceneVisuals.push(sceneVisual);
        }

        logDebugConsole(
            'debug',
            '[getSceneVisualsInScene] [END] building scene visuals. {visuals}',
            sceneVisuals
        );
        return sceneVisuals;
    }
}

export default ViewerConfigUtility;
