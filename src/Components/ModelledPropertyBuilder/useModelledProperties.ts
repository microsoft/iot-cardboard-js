import { useMemo } from 'react';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import {
    IModelledPropertyBuilderAdapter,
    linkedTwinName
} from '../../Models/Constants';
import {
    IBehavior,
    I3DScenesConfig
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    PrimitiveType,
    AllowedComplexType
} from './ModelledPropertyBuilder.types';

interface IUseModelledPropertiesParams {
    /** Network interface with cached DTDL models & ability to resolve twins by Id */
    adapter: IModelledPropertyBuilderAdapter;
    /** The behavior to derive primary & aliased Ids from */
    behavior: IBehavior;
    /** The 3D scenes configuration files for accessing elements linked & aliased twins */
    config: I3DScenesConfig;
    /** Active scene context -- used to limit the element matching to the current scene */
    sceneId: string;
    /** List of allowed DTDL primitive types to build value properties for */
    allowedPrimitiveTypes: Array<PrimitiveType>;
    /** List of allowed DTDL complex types to build value properties for */
    allowedComplexTypes: Array<AllowedComplexType>;
    /** List of allowed DTDL complex types to build value properties for */
    disableAliasedTwins: boolean;
}

/**React hook responsible for constructing internal data representation of modelled properties.
 * These modelled properties will update when critical dependencies change.
 * @param IUseModelledPropertiesParams hook parameters
 * @returns nested data structure keyed by primary & alias twin tags at the top level, then nested property names
 * for each tag.  Each value property has an key which represents its path on the twin & a the model for that property.
 */
export const useModelledProperties = ({
    adapter,
    behavior,
    config,
    sceneId,
    allowedPrimitiveTypes,
    allowedComplexTypes,
    disableAliasedTwins
}: IUseModelledPropertiesParams) => {
    // Gets both primary & aliased twin Ids for a behavior in the context of the current scene.
    const { primaryTwinIds, aliasedTwinMap } = useMemo(
        () =>
            ViewerConfigUtility.getTwinIdsForBehaviorInScene(
                behavior,
                config,
                sceneId
            ),
        [behavior, config, sceneId]
    );

    // Merge primary & aliased tags (if enabled) and map twin Ids to model Ids for each twin
    // Refetch twins if primary or aliased twins change
    const tagModelMap = mergeTagsAndMapTwinIdsToModelIds(
        adapter,
        primaryTwinIds,
        aliasedTwinMap
    );
    return null;
};

const mergeTagsAndMapTwinIdsToModelIds = async (
    adapter: IModelledPropertyBuilderAdapter,
    primaryTwinIds: string[],
    aliasedTwinMap?: Record<string, string>
) => {
    // Merge LinkedTwin & aliased twins (if present) into tag: id mapping.
    const tagTwinIdMap = {};

    // Fetch the twin data for each $dtId, and use $metadata to create tag: rootModelId mapping.
    const primaryTwinModels = (
        await Promise.all(
            primaryTwinIds.map((primaryTwinId) =>
                adapter.getADTTwin(primaryTwinId)
            )
        )
    )
        .filter((twinResult) => !twinResult.hasNoData())
        .map((twinResult) => twinResult.result.data.$metadata.$model);

    if (primaryTwinModels?.length > 0) {
        tagTwinIdMap[linkedTwinName] = Array.from(
            new Set(primaryTwinModels).keys()
        ); // ensure uniqueness (drop duplicate model Ids)
    }

    if (aliasedTwinMap) {
        for (const [aliasTag, aliasTwinId] of Object.entries(aliasedTwinMap)) {
            const aliasedTwinResult = await adapter.getADTTwin(aliasTwinId);
            if (!aliasedTwinResult.hasNoData()) {
                tagTwinIdMap[aliasTag] =
                    aliasedTwinResult.result.data.$metadata.$model;
            }
        }
    }

    console.log(tagTwinIdMap);

    return tagTwinIdMap;
};
