import {
    InterfaceInfo,
    ModelDict,
    EntityKinds,
    ObjectInfo
} from 'azure-iot-dtdl-parser';
import { PRIMARY_TWIN_NAME } from '../../Models/Constants/Constants';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants/Interfaces';
import { deepCopy } from '../../Models/Services/Utils';
import {
    PropertyValueType,
    ITagModelMap,
    IModelledProperties
} from './ModelledPropertyBuilder.types';

interface IBuildModelledPropertiesParams {
    adapter: IModelledPropertyBuilderAdapter;
    primaryTwinIds: string[];
    aliasedTwinMap?: Record<string, string[]>;
    allowedPropertyValueTypes: Array<PropertyValueType>;
}

// $dtId Model
const dtIdModel = {
    fullPath: '.$dtId',
    key: '.$dtId',
    localPath: '$dtId',
    name: '$dtId',
    propertyType: 'string',
    schema: null,
    entity: null
};

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
        flattenedFormat: {},
        intellisenseFormat: {}
    };

    try {
        // Get ADT Models
        // TODO: CHECK IF THIS HAS WHAT I NEED TO FLATTEN THE PROPERTIES
        // PARSE THIS!!
        const modelDict = (await adapter.getAllAdtModels()).getData()
            .parsedModels;
        console.log('modelDict', modelDict);

        // Merge primary & aliased tags (if enabled) and map twin Ids to model Ids for each twin
        // Update model Id mapping if primary or aliased twins Ids change
        const tagModelMap = await mergeTagsAndMapTwinIdsToModelIds(
            adapter,
            primaryTwinIds,
            aliasedTwinMap
        );
        console.log('tagModelMap', tagModelMap);

        // Expand each model ID into DTDL property array
        modelledProperties.nestedFormat = expandModelIds(
            modelDict,
            tagModelMap,
            allowedPropertyValueTypes
        );
        console.log('nestedFormat', modelledProperties.nestedFormat);

        // Flatten properties into list representation
        // TODO: GET FLATTENED FORMAT IN A NEW HOOK
        modelledProperties.flattenedFormat = flattenModelledProperties(
            modelledProperties.nestedFormat
        );
        console.log('flattenedFormat', modelledProperties.flattenedFormat);

        // Create intellisense skeleton of property nesting
        modelledProperties.intellisenseFormat = generatePropertySkeleton(
            modelledProperties.nestedFormat
        );

        if (allowedPropertyValueTypes.includes('string')) {
            /** Add $dtId manually to all twins' modelled properties in all the possible formats */
            Object.keys(modelledProperties.flattenedFormat).forEach(
                (key: string) => {
                    const uniquedtIdModel = deepCopy(dtIdModel);
                    uniquedtIdModel.fullPath = key + uniquedtIdModel.fullPath;
                    uniquedtIdModel.key = key + uniquedtIdModel.key;
                    modelledProperties.flattenedFormat[key].push(
                        uniquedtIdModel
                    );
                }
            );
            Object.keys(modelledProperties.intellisenseFormat).forEach(
                (key: string) => {
                    modelledProperties.intellisenseFormat[key]['$dtId'] = {};
                }
            );
            Object.keys(modelledProperties.nestedFormat).forEach(
                (key: string) => {
                    const uniquedtIdModel = deepCopy(dtIdModel);
                    uniquedtIdModel.fullPath = key + uniquedtIdModel.fullPath;
                    uniquedtIdModel.key = key + uniquedtIdModel.key;
                    modelledProperties.nestedFormat[key]['properties'][
                        '$dtId'
                    ] = uniquedtIdModel;
                }
            );
        }
    } catch (err) {
        console.error(err);
    }
    return modelledProperties;
};

/** Creates skeleton of property names only for intellisense purposes */
const generatePropertySkeleton = (
    nestedModelledProperties: Record<string, any>
) => {
    const propertySkeleton = {};

    const addProperty = (rootObj, item) => {
        if (item.properties) {
            for (const nestedPropertyKey of Object.keys(item.properties)) {
                rootObj[nestedPropertyKey] = {};
                addProperty(
                    rootObj[nestedPropertyKey],
                    item.properties[nestedPropertyKey]
                );
            }
        }
    };

    for (const key of Object.keys(nestedModelledProperties)) {
        propertySkeleton[key] = {};
        addProperty(propertySkeleton[key], nestedModelledProperties[key]);
    }

    return propertySkeleton;
};

/** Flattens modelled properties into '.' separated path keys to be used in dropdown representations */
export const flattenModelledProperties = (
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

    const addModels = (alias: string, modelIds: string[]) => {
        for (const modelId of modelIds) {
            if (modelDict[modelId]?.entityKind === 'interface') {
                if (!(alias in modelledProperties)) {
                    // Add alias tag to root object
                    modelledProperties[alias] = {};
                }
                console.log('alias modelled props', modelledProperties[alias]);
                addInterface(
                    modelledProperties[alias],
                    modelDict[modelId] as InterfaceInfo,
                    alias,
                    allowedPropertyValueTypes
                );
            }
        }
    };

    // Add primary twin's modelled properties
    addModels(PRIMARY_TWIN_NAME, tagModelMap.PrimaryTwin);

    // Add aliased twin modelled properties
    if (tagModelMap.aliasTags) {
        for (const [aliasTag, aliasModelIds] of Object.entries(
            tagModelMap.aliasTags
        )) {
            addModels(aliasTag, aliasModelIds);
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
export const addInterface = (
    root: Record<string, any>,
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
    root: Record<string, any>,
    entity: Record<string, any>,
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
            path + '.' + entity.name,
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
 * @returns tags mapped to model Ids where the primary tags (PrimaryTwin) is a list
 * @example
 * ```
 * {
 *	  PrimaryTwin: ['dtmi:assetGen:SaltMachine;1', 'dtmi:assetGen:PasteurizationMachine;1'],
 *	  ElectricityTag: 'dtmi:assetGen:SaltMachineElectric;1',
 *	  TemperatureTag: 'dtmi:assetGen:SaltMachineTemperature;1'
 * }
 * ```
 */
export const mergeTagsAndMapTwinIdsToModelIds = async (
    adapter: IModelledPropertyBuilderAdapter,
    primaryTwinIds: string[],
    aliasedTwinMap?: Record<string, string[]>
): Promise<ITagModelMap> => {
    const tagModelMap: ITagModelMap = {
        PrimaryTwin: []
    };

    const addLinkedTwinIdsIntoModelIds = async (
        root: ITagModelMap | Record<string, string[]>,
        alias: string,
        twinIds: string[]
    ) => {
        const modelIds = (
            await Promise.all(
                twinIds.map((twinId) => adapter.getModelIdFromTwinId(twinId))
            )
        )
            .filter((twinResult) => !twinResult.hasNoData())
            .map((result) => result.getData().modelId);

        if (modelIds?.length > 0) {
            root[alias] = Array.from(new Set([...modelIds]).keys()); // ensure uniqueness (drop duplicate model Ids)
        }
    };

    // Add primary twin model Ids
    await addLinkedTwinIdsIntoModelIds(
        tagModelMap,
        PRIMARY_TWIN_NAME,
        primaryTwinIds
    );

    // Add aliased twin model Ids
    if (aliasedTwinMap) {
        tagModelMap.aliasTags = {};
        for (const [aliasTag, aliasTwinIds] of Object.entries(aliasedTwinMap)) {
            await addLinkedTwinIdsIntoModelIds(
                tagModelMap.aliasTags,
                aliasTag,
                aliasTwinIds
            );
        }
    }

    return tagModelMap;
};
