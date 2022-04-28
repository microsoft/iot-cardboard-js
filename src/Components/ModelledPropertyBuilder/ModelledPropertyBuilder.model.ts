import { linkedTwinName } from '../../Models/Constants/Constants';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants/Interfaces';
import {
    AllowedComplexType,
    PrimitiveType
} from './ModelledPropertyBuilder.types';

interface IBuildModelledPropertiesParams {
    adapter: IModelledPropertyBuilderAdapter;
    primaryTwinIds: string[];
    aliasedTwinMap?: Record<string, string>;
    allowedPrimitiveTypes: Array<PrimitiveType>;
    allowedComplexTypes: Array<AllowedComplexType>;
}

/**
 * Builds internal data representation for modelled properties
 * @param adapter network interface capable of resolving twins
 * @param primaryTwinIds Array of twin Ids to find modelelled properties for
 * @param primaryTwinTag tag for the primary twin
 * @param aliasedTwinMap Optional map of alias to twinIds mappings.
 * @param allowedPrimitiveTypes List of allowed DTDL primitive types to build value properties for
 * @param allowedComplexTypes List of allowed DTDL complex types to build value properties for
 * @returns nested data structure keyed by primary & alias twin tags at the top level, then nested property names
 * for each tag.  Each value property has an key which represents its path on the twin & a the model for that property.
 */
export const buildModelledProperties = async ({
    adapter,
    primaryTwinIds,
    aliasedTwinMap,
    allowedPrimitiveTypes,
    allowedComplexTypes
}: IBuildModelledPropertiesParams) => {
    // Wait for models to be fetched -- calling subsequent times has no effect (models on fetched once)
    await adapter.fetchCacheAndParseAllADTModels();

    // Merge primary & aliased tags (if enabled) and map twin Ids to model Ids for each twin
    // Update model Id mapping if primary or aliased twins Ids change
    const tagModelMap = await mergeTagsAndMapTwinIdsToModelIds(
        adapter,
        primaryTwinIds,
        aliasedTwinMap
    );

    console.log('Parsed models: ', adapter.parsedModels);
    console.log('Tag model map: ', tagModelMap);

    return null;
};

/**Merges primary & aliased tags then maps model Ids onto twin Ids
 * by resolving twins from network & using model Id form $metadata.
 * This function includes caching logic to only resolve a twins model once
 * in the lifetime of the adapter interface
 * @param adapter network interface capable of resolving twins
 * @param primaryTwinIds list of primary twin Ids
 * @param aliasedTwinMap additional optional tag:twinId mapping
 * @returns tags mapped to model Ids where the primary tags (LinkedTwin) is a list
 * ```
 * {
 *	  LinkedTwin: ['dtmi:assetGen:SaltMachine;1', 'dtmi:assetGen:PasteurizationMachine;1'],
 *	  ElectricityTag: 'dtmi:assetGen:SaltMachineElectric;1',
 *	  TemperatureTag: 'dtmi:assetGen:SaltMachineTemperature;1'
 * }
 * ```
 */
export const mergeTagsAndMapTwinIdsToModelIds = async (
    adapter: IModelledPropertyBuilderAdapter,
    primaryTwinIds: string[],
    aliasedTwinMap?: Record<string, string>
) => {
    // Merge LinkedTwin & aliased twins (if present) into tag: id mapping.
    const tagModelMap = {};

    // Use twin Id -> model Id cache to resolve model Ids that are already saved
    const primaryTwinIdsWithUnknownModel = primaryTwinIds.filter(
        (ptId) => !adapter.cachedTwinModelMap.has(ptId)
    );
    const cachedPrimaryModels = primaryTwinIds
        .filter((ptId) => adapter.cachedTwinModelMap.has(ptId))
        .map((ptId) => adapter.cachedTwinModelMap.get(ptId));

    // Fetch the twin data for each $dtId, and use $metadata to create tag: rootModelId mapping.
    const primaryTwinModels = (
        await Promise.all(
            primaryTwinIdsWithUnknownModel.map((primaryTwinId) =>
                adapter.getADTTwin(primaryTwinId)
            )
        )
    )
        .filter((twinResult) => !twinResult.hasNoData())
        .map((twinResult) => {
            const twinId = twinResult.result.data.$dtId;
            const modelId = twinResult.result.data.$metadata.$model;
            // Cache twin Id -> model Id mapping to prevent unecessary twin fetches just to match model
            adapter.cachedTwinModelMap.set(twinId, modelId);
            return modelId;
        });

    if (primaryTwinModels?.length > 0) {
        tagModelMap[linkedTwinName] = Array.from(
            new Set([...cachedPrimaryModels, ...primaryTwinModels]).keys()
        ); // ensure uniqueness (drop duplicate model Ids)
    }

    if (aliasedTwinMap) {
        for (const [aliasTag, aliasTwinId] of Object.entries(aliasedTwinMap)) {
            // If model Id already cached for aliasTwinId, skip network
            if (adapter.cachedTwinModelMap.has(aliasTwinId)) {
                tagModelMap[aliasTag] = adapter.cachedTwinModelMap.get(
                    aliasTwinId
                );
            } else {
                const aliasedTwinResult = await adapter.getADTTwin(aliasTwinId);
                if (!aliasedTwinResult.hasNoData()) {
                    const modelId =
                        aliasedTwinResult.result.data.$metadata.$model;
                    // Cache twin Id -> model Id mapping to prevent unecessary twin fetches just to match model
                    adapter.cachedTwinModelMap.set(aliasTwinId, modelId);
                    tagModelMap[aliasTag] = modelId;
                }
            }
        }
    }

    return tagModelMap;
};
