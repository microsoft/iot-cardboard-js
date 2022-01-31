import { IScenesConfig, IBehavior, IScene, DatasourceType } from './3DVConfig';

/** Static utilty methods for operations on the ViewerConfiguration file. */
abstract class ViewerConfigUtility {
    /** Add new scene to config file */
    static addScene(config: IScenesConfig, scene: IScene) {
        const updatedConfig = { ...config };
        updatedConfig.viewerConfiguration.scenes.push(scene);
        return updatedConfig;
    }

    /** Update scene with matching ID */
    static editScene(config: IScenesConfig, sceneId: string, scene: IScene) {
        const sceneIndex: number = config.viewerConfiguration.scenes.findIndex(
            (s) => s.id === sceneId
        );
        const updatedConfig = { ...config };
        updatedConfig.viewerConfiguration.scenes[sceneIndex] = scene;

        return updatedConfig;
    }

    /** Delete scene with matching ID */
    static deleteScene(config: IScenesConfig, sceneId: string) {
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
    ) {
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
    ) {
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

    /** Delete behavior.
     * Options for deletion from current scebe, or ALL scenes.
     * TODO: clean up datasources when removing behavior from scene reference only*/
    static deleteBehavior(
        config: IScenesConfig,
        sceneId: string,
        behaviorId: string,
        removeFromAllScenes?: boolean
    ) {
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

    static getBehaviorsSegmentedByPresenceOnSceneElements(
        config: IScenesConfig,
        sceneId: string,
        behaviors: Array<IBehavior>
    ): [Array<IBehavior>, Array<IBehavior>] {
        // Build up dictionary of all active element IDs on current scene
        const scene = config.viewerConfiguration.scenes?.find(
            (s) => s.id === sceneId
        );
        const elementIdMap = {};

        scene?.twinToObjectMappings?.forEach((ttom) => {
            if (!(ttom.id in elementIdMap)) elementIdMap[ttom.id] = true;
        });

        const behaviorsAttachedToElements = [];
        const behaviorsNotOnElements = [];

        behaviors.forEach((behavior) => {
            const behaviorMappingIds = behavior?.datasources?.find(
                (ds) => ds.type === DatasourceType.TwinToObjectMapping
            );
            if (
                behaviorMappingIds?.mappingIDs?.some(
                    (mId) => mId in elementIdMap
                )
            ) {
                behaviorsAttachedToElements.push(behavior);
            } else {
                behaviorsNotOnElements.push(behavior);
            }
        });

        // Sanity check to ensure all behaviors have been segmented
        if (
            behaviorsAttachedToElements.length +
                behaviorsNotOnElements.length ===
            behaviors.length
        ) {
            return [behaviorsAttachedToElements, behaviorsNotOnElements];
        } else {
            return [[], behaviors];
        }
    }
}

export default ViewerConfigUtility;
