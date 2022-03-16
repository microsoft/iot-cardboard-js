import {
    I3DScenesConfig,
    IBehavior,
    IDataSource,
    IElement,
    IElementTwinToObjectMappingDataSource,
    IScene,
    IValueRange,
    ITwinToObjectMapping,
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import { DatasourceType, ElementType } from './3DVConfig';

/** Static utilty methods for operations on the configuration file. */
abstract class ViewerConfigUtility {
    /** Add new scene to config file */
    static addScene(config: I3DScenesConfig, scene: IScene): I3DScenesConfig {
        const updatedConfig = { ...config };
        updatedConfig.configuration.scenes.push(scene);
        return updatedConfig;
    }

    /** Update scene with matching ID */
    static editScene(
        config: I3DScenesConfig,
        sceneId: string,
        scene: IScene,
    ): I3DScenesConfig {
        const sceneIndex: number = config.configuration.scenes.findIndex(
            (s) => s.id === sceneId,
        );
        const updatedConfig = { ...config };
        updatedConfig.configuration.scenes[sceneIndex] = scene;

        return updatedConfig;
    }

    /** Delete scene with matching ID */
    static deleteScene(
        config: I3DScenesConfig,
        sceneId: string,
    ): I3DScenesConfig {
        const sceneIndex: number = config.configuration.scenes.findIndex(
            (s) => s.id === sceneId,
        );
        const updatedConfig = { ...config };
        updatedConfig.configuration.scenes.splice(sceneIndex, 1);
        return updatedConfig;
    }

    /** Add behavior to target scene */
    static addBehavior(
        config: I3DScenesConfig,
        sceneId: string,
        behavior: IBehavior,
    ): I3DScenesConfig {
        const updatedConfig = { ...config };
        updatedConfig.configuration.behaviors.push(behavior);
        updatedConfig.configuration.scenes
            .find((scene) => scene.id === sceneId)
            ?.behaviorIDs?.push(behavior.id);
        return updatedConfig;
    }

    /** Update behavior with matching ID.
     * Note, original behavior ID is used in case the behavior ID has been
     * changed with the update.*/
    static editBehavior(
        config: I3DScenesConfig,
        behavior: IBehavior,
    ): I3DScenesConfig {
        const updatedConfig = { ...config };

        // Update modified behavior
        const behaviorIdx = updatedConfig.configuration.behaviors.findIndex(
            (b) => b.id === behavior.id,
        );
        updatedConfig.configuration.behaviors[behaviorIdx] = behavior;

        return updatedConfig;
    }

    /** Adds existing behavior to the target scene */
    static addBehaviorToScene(
        config: I3DScenesConfig,
        sceneId: string,
        behavior: IBehavior,
    ): I3DScenesConfig {
        const updatedConfig = { ...config };
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
        removeFromAllScenes?: boolean,
    ): I3DScenesConfig {
        const updatedConfig = { ...config };

        // Remove behavior from active scene
        const activeScene = updatedConfig.configuration.scenes.find(
            (scene) => scene.id === sceneId,
        );

        const matchingBehaviorIdxInActiveScene = activeScene.behaviorIDs.indexOf(
            behaviorId,
        );

        if (matchingBehaviorIdxInActiveScene !== -1) {
            activeScene.behaviorIDs.splice(matchingBehaviorIdxInActiveScene, 1);
        }

        // Clean up behavior datasources when removing behavior from scene reference only
        const elementIdsInActiveScene = ViewerConfigUtility.getDictionaryOfElementsIdsInScene(
            config,
            sceneId,
        );

        const behavior = config.configuration.behaviors.find(
            (b) => b.id === behaviorId,
        );

        if (behavior) {
            const twinToObjectMapping = behavior.datasources.find(
                (ds) =>
                    ds.type ===
                    DatasourceType.ElementTwinToObjectMappingDataSource,
            ) as IElementTwinToObjectMappingDataSource;
            if (twinToObjectMapping) {
                twinToObjectMapping.elementIDs = twinToObjectMapping.elementIDs.filter(
                    (id) => !(id in elementIdsInActiveScene),
                );
            }
        }

        if (removeFromAllScenes) {
            // Splice behavior out of behavior list
            const behaviorIdx = updatedConfig.configuration.behaviors.findIndex(
                (b) => b.id === behaviorId,
            );

            if (behaviorIdx !== -1) {
                updatedConfig.configuration.behaviors.splice(behaviorIdx, 1);
            }

            // If matching behavior Id found in ANY scene, splice out scene's behavior Id array
            updatedConfig.configuration.scenes.forEach((scene) => {
                const matchingBehaviorIdIdx = scene.behaviorIDs.indexOf(
                    behaviorId,
                );
                if (matchingBehaviorIdIdx !== -1) {
                    scene.behaviorIDs.splice(matchingBehaviorIdIdx, 1);
                }
            });
        }
        return updatedConfig;
    }

    static getBehaviorElementIds(behavior: IBehavior): string[] {
        return (
            (behavior.datasources.find(
                (ds) =>
                    ds.type ===
                    DatasourceType.ElementTwinToObjectMappingDataSource,
            ) as IElementTwinToObjectMappingDataSource)?.elementIDs || []
        );
    }

    /** Returns information about the number of element and scene references on a behavior  */
    static getBehaviorMetaData(
        config: I3DScenesConfig,
        sceneId: string,
        behavior: IBehavior,
    ): { numElementsInActiveScene: number; numSceneRefs: number } {
        const dictionaryOfElementsIdsInScene = ViewerConfigUtility.getDictionaryOfElementsIdsInScene(
            config,
            sceneId,
        );

        let numElementsInActiveScene = 0;

        const behaviorElementIds = ViewerConfigUtility.getBehaviorElementIds(
            behavior,
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
            numSceneRefs,
        };
    }

    /** Returns information about the number of behaviors and meshes on a element  */
    static getElementMetaData(
        element: ITwinToObjectMapping,
        config: I3DScenesConfig,
    ) {
        const numBehaviors = this.getBehaviorsOnElement(
            element,
            config?.configuration?.behaviors,
        )?.length;
        return numBehaviors;
    }

    static getDictionaryOfElementsIdsInScene(
        config: I3DScenesConfig,
        sceneId: string,
    ): Record<string, any> {
        // Build up dictionary of all active element IDs on current scene
        const scene = config.configuration.scenes?.find(
            (s) => s.id === sceneId,
        );
        const elementIdMap = {};

        scene?.elements
            ?.filter(ViewerConfigUtility.isTwinToObjectMappingElement)
            .forEach((ttom) => {
                if (!(ttom.id in elementIdMap)) elementIdMap[ttom.id] = ttom;
            });

        return elementIdMap;
    }

    static isElementTwinToObjectMappingDataSource(
        dataSource: IDataSource,
    ): dataSource is IElementTwinToObjectMappingDataSource {
        return (
            dataSource.type ===
            DatasourceType.ElementTwinToObjectMappingDataSource
        );
    }

    static isTwinToObjectMappingElement(
        element: IElement,
    ): element is ITwinToObjectMapping {
        return element.type === ElementType.TwinToObjectMapping;
    }

    static getBehaviorsSegmentedByPresenceInScene(
        config: I3DScenesConfig,
        sceneId: string,
        behaviors: Array<IBehavior>,
    ): [
        behaviorsInScene: Array<IBehavior>,
        behaviorsNotInScene: Array<IBehavior>,
    ] {
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
        behaviors: Array<IBehavior>,
    ) {
        return (
            behaviors?.filter((behavior) => {
                const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
                    behavior,
                );
                return dataSources?.[0]?.elementIDs?.find(
                    (id) => id === element?.id,
                );
            }) || []
        );
    }

    static getAvailableBehaviorsForElement(
        element: ITwinToObjectMapping,
        behaviors: Array<IBehavior>,
    ) {
        return (
            behaviors.filter((behavior) => {
                const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
                    behavior,
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
        behavior: IBehavior,
    ) {
        return behavior.datasources.filter(
            ViewerConfigUtility.isElementTwinToObjectMappingDataSource,
        );
    }

    static removeBehaviorFromList(
        behaviors: Array<IBehavior>,
        behaviorToRemove: IBehavior,
    ) {
        return behaviors.filter(
            (behavior) => behavior.id !== behaviorToRemove.id,
        );
    }

    static removeElementFromBehavior(
        element: ITwinToObjectMapping,
        behavior: IBehavior,
    ) {
        const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
            behavior,
        );
        dataSources[0].elementIDs = dataSources[0].elementIDs.filter(
            (mappingId) => mappingId !== element.id,
        );
        return behavior;
    }

    static addElementToBehavior(
        element: ITwinToObjectMapping,
        behavior: IBehavior,
    ) {
        const dataSources = ViewerConfigUtility.getElementTwinToObjectMappingDataSourcesFromBehavior(
            behavior,
        );
        if (
            dataSources?.[0]?.elementIDs &&
            !dataSources[0].elementIDs.includes(element.id)
        ) {
            dataSources[0].elementIDs.push(element.id);
        } else {
            dataSources[0] = {
                type: DatasourceType.ElementTwinToObjectMappingDataSource,
                elementIDs: [element.id],
            };
        }

        return behavior;
    }

    static getColorOrNullFromStatusValueRange(
        ranges: IValueRange[],
        value: number,
    ): string | null {
        let color = null;
        for (const range of ranges) {
            if (value >= Number(range.min) && value <= Number(range.max)) {
                color = range.color;
            }
        }
        return color;
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
}

export default ViewerConfigUtility;
