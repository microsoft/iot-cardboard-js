import {
    IScenesConfig,
    IBehavior,
    IScene,
    DatasourceType,
    ITwinToObjectMapping
} from './3DVConfig';

/** Static utilty methods for operations on the ViewerConfiguration file. */
abstract class ViewerConfigUtility {
    /** Add new scene to config file */
    static addScene(config: IScenesConfig, scene: IScene): IScenesConfig {
        const updatedConfig = { ...config };
        updatedConfig.viewerConfiguration.scenes.push(scene);
        return updatedConfig;
    }

    /** Update scene with matching ID */
    static editScene(
        config: IScenesConfig,
        sceneId: string,
        scene: IScene
    ): IScenesConfig {
        const sceneIndex: number = config.viewerConfiguration.scenes.findIndex(
            (s) => s.id === sceneId
        );
        const updatedConfig = { ...config };
        updatedConfig.viewerConfiguration.scenes[sceneIndex] = scene;

        return updatedConfig;
    }

    /** Delete scene with matching ID */
    static deleteScene(config: IScenesConfig, sceneId: string): IScenesConfig {
        const sceneIndex: number = config.viewerConfiguration.scenes.findIndex(
            (s) => s.id === sceneId
        );
        const updatedConfig = { ...config };
        updatedConfig.viewerConfiguration.scenes.splice(sceneIndex, 1);
        return updatedConfig;
    }

    /** Add behavior to target scene */
    static addBehavior(
        config: IScenesConfig,
        sceneId: string,
        behavior: IBehavior
    ): IScenesConfig {
        const updatedConfig = { ...config };
        updatedConfig.viewerConfiguration.behaviors.push(behavior);
        updatedConfig.viewerConfiguration.scenes
            .find((scene) => scene.id === sceneId)
            ?.behaviors?.push(behavior.id);
        return updatedConfig;
    }

    /** Update behavior with matching ID.
     * Note, original behavior ID is used in case the behavior ID has been
     * changed with the update.*/
    static editBehavior(
        config: IScenesConfig,
        behavior: IBehavior,
        originalBehaviorId: string
    ): IScenesConfig {
        const updatedConfig = { ...config };

        // Update modified behavior
        const behaviorIdx = updatedConfig.viewerConfiguration.behaviors.findIndex(
            (b) => b.id === originalBehaviorId
        );
        updatedConfig.viewerConfiguration.behaviors[behaviorIdx] = behavior;

        // If behavior ID changed, update matching scene behavior Ids with updated Id
        if (behavior.id !== originalBehaviorId) {
            updatedConfig.viewerConfiguration.scenes.forEach((scene) => {
                const behaviorIdIdxInSceneBehaviors = scene?.behaviors?.indexOf(
                    originalBehaviorId
                );
                if (behaviorIdIdxInSceneBehaviors !== -1) {
                    scene.behaviors[behaviorIdIdxInSceneBehaviors] =
                        behavior.id;
                }
            });
        }

        return updatedConfig;
    }

    /** Adds existing behavior to the target scene */
    static addBehaviorToScene(
        config: IScenesConfig,
        sceneId: string,
        behavior: IBehavior
    ): IScenesConfig {
        const updatedConfig = { ...config };
        updatedConfig.viewerConfiguration.scenes
            .find((scene) => scene.id === sceneId)
            ?.behaviors?.push(behavior.id);
        return updatedConfig;
    }

    /** Delete behavior.
     * Options for deletion from current scene, or ALL scenes.
     */
    static deleteBehavior(
        config: IScenesConfig,
        sceneId: string,
        behaviorId: string,
        removeFromAllScenes?: boolean
    ): IScenesConfig {
        const updatedConfig = { ...config };

        // Remove behavior from active scene
        const activeScene = updatedConfig.viewerConfiguration.scenes.find(
            (scene) => scene.id === sceneId
        );

        const matchingBehaviorIdxInActiveScene = activeScene.behaviors.indexOf(
            behaviorId
        );

        if (matchingBehaviorIdxInActiveScene !== -1) {
            activeScene.behaviors.splice(matchingBehaviorIdxInActiveScene, 1);
        }

        // Clean up behavior datasources when removing behavior from scene reference only
        const elementIdsInActiveScene = ViewerConfigUtility.getDictionaryOfElementsIdsInScene(
            config,
            sceneId
        );

        const behavior = config.viewerConfiguration.behaviors.find(
            (b) => b.id === behaviorId
        );

        if (behavior) {
            const twinToObjectMapping = behavior.datasources.find(
                (ds) => ds.type === DatasourceType.TwinToObjectMapping
            );
            if (twinToObjectMapping) {
                twinToObjectMapping.mappingIDs = twinToObjectMapping.mappingIDs.filter(
                    (id) => !(id in elementIdsInActiveScene)
                );
            }
        }

        if (removeFromAllScenes) {
            // Splice behavior out of behavior list
            const behaviorIdx = updatedConfig.viewerConfiguration.behaviors.findIndex(
                (b) => b.id === behaviorId
            );

            if (behaviorIdx !== -1) {
                updatedConfig.viewerConfiguration.behaviors.splice(
                    behaviorIdx,
                    1
                );
            }

            // If matching behavior Id found in ANY scene, splice out scene's behavior Id array
            updatedConfig.viewerConfiguration.scenes.forEach((scene) => {
                const matchingBehaviorIdIdx = scene.behaviors.indexOf(
                    behaviorId
                );
                if (matchingBehaviorIdIdx !== -1) {
                    scene.behaviors.splice(matchingBehaviorIdIdx, 1);
                }
            });
        }
        return updatedConfig;
    }

    static getBehaviorElementIds(behavior: IBehavior) {
        return (
            behavior.datasources.find(
                (ds) => ds.type === DatasourceType.TwinToObjectMapping
            )?.mappingIDs || []
        );
    }

    /** Returns information about the number of element and scene references on a behavior  */
    static getBehaviorMetaData(
        config: IScenesConfig,
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

        config.viewerConfiguration.scenes.forEach((s) => {
            if (s.behaviors.includes(behavior.id)) {
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
        config: IScenesConfig
    ): { numBehaviors: number; numMeshes: number } {
        const numMeshes = element.meshIDs?.length;
        const numBehaviors = this.getBehaviorsOnElement(
            element,
            config?.viewerConfiguration?.behaviors
        )?.length;
        return {
            numBehaviors,
            numMeshes
        };
    }

    static getDictionaryOfElementsIdsInScene(
        config: IScenesConfig,
        sceneId: string
    ): Record<string, any> {
        // Build up dictionary of all active element IDs on current scene
        const scene = config.viewerConfiguration.scenes?.find(
            (s) => s.id === sceneId
        );
        const elementIdMap = {};

        scene?.twinToObjectMappings?.forEach((ttom) => {
            if (!(ttom.id in elementIdMap)) elementIdMap[ttom.id] = ttom;
        });

        return elementIdMap;
    }

    static getBehaviorsSegmentedByPresenceInScene(
        config: IScenesConfig,
        sceneId: string,
        behaviors: Array<IBehavior>
    ): [
        behaviorsInScene: Array<IBehavior>,
        behaviorsNotInScene: Array<IBehavior>
    ] {
        const behaviorsInScene = [];
        const behaviorsNotInScene = [];

        const scene = config.viewerConfiguration.scenes.find(
            (s) => s.id === sceneId
        );

        const behaviorIdsInActiveScene = scene?.behaviors;

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
            behaviors?.filter((behavior) =>
                behavior.datasources?.[0]?.mappingIDs?.find(
                    (id) => id === element?.id
                )
            ) || []
        );
    }

    static getMappingIdsForBehavior(behavior: IBehavior) {
        const mappingIds: string[] = [];
        // cycle through the datasources of behavior
        for (const dataSource of behavior.datasources) {
            // if its a TwinToObjectMappingDatasource get the mapping id
            if (dataSource.type === DatasourceType.TwinToObjectMapping) {
                dataSource.mappingIDs.forEach((mappingId) => {
                    mappingIds.push(mappingId);
                });
            }
        }

        return mappingIds;
    }
}

export default ViewerConfigUtility;
