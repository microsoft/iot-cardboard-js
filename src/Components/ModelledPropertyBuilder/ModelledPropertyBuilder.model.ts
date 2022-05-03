import {
    InterfaceInfo,
    ModelDict,
    EntityKinds,
    ObjectInfo
} from 'temporary-js-dtdl-parser';
import { linkedTwinName } from '../../Models/Constants/Constants';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants/Interfaces';
import {
    PropertyValueType,
    ITagModelMap,
    IModelledProperties
} from './ModelledPropertyBuilder.types';

interface IBuildModelledPropertiesParams {
    adapter: IModelledPropertyBuilderAdapter;
    primaryTwinIds: string[];
    aliasedTwinMap?: Record<string, string>;
    allowedPropertyValueTypes: Array<PropertyValueType>;
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
    allowedPropertyValueTypes
}: IBuildModelledPropertiesParams): Promise<IModelledProperties> => {
    const modelledProperties = {
        nestedFormat: {},
        flattenedFormat: {}
    };

    try {
        // Wait for models to be fetched -- calling subsequent times has no effect (models on fetched once)
        await adapter.fetchCacheAndParseAllADTModels();

        // Merge primary & aliased tags (if enabled) and map twin Ids to model Ids for each twin
        // Update model Id mapping if primary or aliased twins Ids change
        const tagModelMap = await mergeTagsAndMapTwinIdsToModelIds(
            adapter,
            primaryTwinIds,
            aliasedTwinMap
        );

        // Expand each model ID into DTDL property array
        modelledProperties.nestedFormat = expandModelIds(
            adapter.parsedModels,
            tagModelMap,
            allowedPropertyValueTypes
        );

        // Flatten properties into list representation
        modelledProperties.flattenedFormat = flattenModelledProperties(
            modelledProperties.nestedFormat
        );
    } catch (err) {
        console.error(err);
    }
    return modelledProperties;
};

/** Flattens modelled properties into '.' separated path keys to be used in dropdown representations */
const flattenModelledProperties = (
    nestedModelledProperties: Record<string, any>
) => {
    const flattenedProperties = {};

    const addProperty = (propertyList, item) => {
        if (item.properties) {
            for (const nestedPropertyKey of Object.keys(item.properties)) {
                addProperty(propertyList, item.properties[nestedPropertyKey]);
            }
        } else {
            propertyList.push(item);
        }
    };

    for (const key of Object.keys(nestedModelledProperties)) {
        flattenedProperties[key] = [];
        addProperty(flattenedProperties[key], nestedModelledProperties[key]);
    }

    return flattenedProperties;
};

/**Transforms primary & aliased tag -> model mappings into nested modelled properties
 * @param modelDict Set of all parsed DTDL models
 * @param tagModelMap Map of primary & aliased tags associated model IDs
 * @param allowedPropertyValueTypes Set of property types to include as property value leaves
 */
const expandModelIds = (
    modelDict: ModelDict,
    tagModelMap: ITagModelMap,
    allowedPropertyValueTypes: Array<PropertyValueType>
): Record<string, any> => {
    const modelledProperties = {};

    // Add primary twin's modelled properties
    for (const modelId of tagModelMap.LinkedTwin) {
        if (modelDict[modelId]?.entityKind === 'interface') {
            if (!(linkedTwinName in modelledProperties)) {
                // Add primary tag to root object
                modelledProperties[linkedTwinName] = {};
            }
            addInterface(
                modelledProperties[linkedTwinName],
                modelDict[modelId] as InterfaceInfo,
                linkedTwinName,
                allowedPropertyValueTypes
            );
        }
    }

    // Add aliased twin modelled properties
    if (tagModelMap.aliasTags) {
        for (const [aliasTag, aliasModelId] of Object.entries(
            tagModelMap.aliasTags
        )) {
            if (modelDict[aliasModelId]?.entityKind === 'interface') {
                // Add alias tag to root object
                modelledProperties[aliasTag] = {};

                addInterface(
                    modelledProperties[aliasTag],
                    modelDict[aliasModelId] as InterfaceInfo,
                    aliasTag,
                    allowedPropertyValueTypes
                );
            }
        }
    }

    return modelledProperties;
};

/**Adds interface to modelled property object. This includes both the root
 * model interface & component interfaces
 * @param root The object to attach interface contents to
 * @param parsedInterface The parsed interface object
 * @param path Base path which represents the nesting level of the root object.  This is used in recursion as keys for each property value.
 * @param allowedPropertyValueTypes Set of property types to include as property value leaves
 * */
const addInterface = (
    root: any,
    parsedInterface: InterfaceInfo,
    path: string,
    allowedPropertyValueTypes: Array<PropertyValueType>
) => {
    const propertyContents =
        Object.values(parsedInterface.contents).filter(
            (contentInfo) =>
                contentInfo.entityKind === 'component' ||
                contentInfo.entityKind === 'property'
        ) || [];

    // Add properties key -- contains modelled properties
    if (!('properties' in root)) {
        root['properties'] = {};
    }

    for (const item of propertyContents) {
        addEntity(root, item, path, allowedPropertyValueTypes);
    }
};

/**Adds property & component entities to root object recursively.
 * Value properties (leaf nodes) will be directly attached.
 * Object properties will recursively add nested fields.
 * Components will be handed over to the addInterface function
 * @param root The root object to attach properties to
 * @param entity The component or property to attach
 * @param path Base path which represents the nesting level of the root object.  This is used in recursion as keys for each property value.
 * @param allowedPropertyValueTypes Set of property types to include as property value leaves
 */
const addEntity = (
    root: any,
    entity: any,
    path: string,
    allowedPropertyValueTypes: Array<PropertyValueType>
) => {
    // If schema is object property type recurse for each field
    if ((entity.schema?.entityKind as EntityKinds) === 'object') {
        const objectSchema = entity.schema as ObjectInfo;

        // Create object entry in root
        const objectEntry = (root.properties[entity.name] = {
            properties: {}
        });

        // Recursively add fields of object to root
        for (const field of objectSchema.fields) {
            addEntity(
                objectEntry,
                field,
                path + '.' + entity.name,
                allowedPropertyValueTypes
            );
        }
    } else if ((entity.entityKind as EntityKinds) === 'component') {
        // Create component entry in root
        const componentEntry = (root.properties[entity.name] = {
            properties: {}
        });

        addInterface(
            componentEntry,
            entity.schema,
            path,
            allowedPropertyValueTypes
        );
    }
    // If schema is value property type (string, float, datetime, etc), add leaf to root
    else if (allowedPropertyValueTypes.includes(entity?.schema?.entityKind)) {
        const fullPath = path + '.' + entity.name;

        root.properties[entity.name] = {
            name: entity.name,
            key: path + '.' + entity.name,
            fullPath,
            localPath: fullPath.slice(fullPath.indexOf('.') + 1),
            schema: entity.schema,
            entity: entity,
            propertyType: entity.schema.entityKind
        };
    }
};

/**Merges primary & aliased tags then maps model Ids onto twin Ids
 * by resolving twins from network & using model Id form $metadata.
 * This function includes caching logic to only resolve a twins model once
 * in the lifetime of the adapter interface
 * @param adapter network interface capable of resolving twins
 * @param primaryTwinIds list of primary twin Ids
 * @param aliasedTwinMap additional optional tag:twinId mapping
 * @returns tags mapped to model Ids where the primary tags (LinkedTwin) is a list
 * @example
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
): Promise<ITagModelMap> => {
    const tagModelMap: ITagModelMap = {
        LinkedTwin: []
    };

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
        tagModelMap.aliasTags = {};
        for (const [aliasTag, aliasTwinId] of Object.entries(aliasedTwinMap)) {
            // If model Id already cached for aliasTwinId, skip network
            if (adapter.cachedTwinModelMap.has(aliasTwinId)) {
                tagModelMap.aliasTags[
                    aliasTag
                ] = adapter.cachedTwinModelMap.get(aliasTwinId);
            } else {
                const aliasedTwinResult = await adapter.getADTTwin(aliasTwinId);
                if (!aliasedTwinResult.hasNoData()) {
                    const modelId =
                        aliasedTwinResult.result.data.$metadata.$model;
                    // Cache twin Id -> model Id mapping to prevent unecessary twin fetches just to match model
                    adapter.cachedTwinModelMap.set(aliasTwinId, modelId);
                    tagModelMap.aliasTags[aliasTag] = modelId;
                }
            }
        }
    }

    return tagModelMap;
};
