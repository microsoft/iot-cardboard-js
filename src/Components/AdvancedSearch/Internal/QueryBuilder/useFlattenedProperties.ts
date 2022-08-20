import { EntityKinds } from 'azure-iot-dtdl-parser/dist/parser/entityKinds';
import { InterfaceInfo } from 'azure-iot-dtdl-parser/dist/parser/interfaceInfo';
import { ModelDict } from 'azure-iot-dtdl-parser/dist/parser/modelDict';
import { ObjectInfo } from 'azure-iot-dtdl-parser/dist/parser/objectInfo';
import { useEffect, useState } from 'react';
import { IModelledPropertyBuilderAdapter } from '../../../../Models/Constants/Interfaces';
import {
    defaultAllowedPropertyValueTypes,
    PropertyValueType
} from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

interface IUseFlattenedPropertiesParams {
    /** Network interface with cached DTDL models & ability to resolve twins by Id */
    adapter: IModelledPropertyBuilderAdapter;

    /** List of allowed DTDL primitive types to build value properties for */
    allowedPropertyValueTypes: PropertyValueType[];
}

// TODO: Comment how this is different from Cory's methods
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

const addInterface = (
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

const expandModelIds = (
    modelDict: ModelDict,
    allowedPropertyValueTypes: Array<PropertyValueType>
): any[] => {
    const flattenedPropertiesArray = [];
    let flattenedPropertiesObject = {};
    const modelledProperties = {};
    const filteredModels = {};

    for (const key in modelDict) {
        if (modelDict[key].entityKind === 'interface') {
            filteredModels[key] = modelDict[key];
        }
    }

    for (const key in filteredModels) {
        addInterface(
            modelledProperties,
            filteredModels[key] as InterfaceInfo,
            key,
            allowedPropertyValueTypes
        );
    }

    flattenedPropertiesObject = flattenModelledProperties(
        modelledProperties['properties']
    );
    console.log('other props', flattenedPropertiesObject);

    Object.keys(flattenedPropertiesObject).map((key: string) => {
        flattenedPropertiesObject[key].map((property) => {
            flattenedPropertiesArray.push({
                key: property.key,
                name: property.name,
                propertyType: property.propertyType
            });
        });
    });

    return flattenedPropertiesArray;
};

const buildFlattenedProperties = async (adapter, allowedPropertyValueTypes) => {
    const modelDict = (await adapter.getAllAdtModels()).getData().parsedModels;
    const expandedModelIds = expandModelIds(
        modelDict,
        allowedPropertyValueTypes
    );
    return expandedModelIds;
};

export const useFlattenedProperties = ({
    adapter,
    allowedPropertyValueTypes
}: IUseFlattenedPropertiesParams) => {
    const [isLoading, setIsLoading] = useState(true);
    const [flattenedProperties, setFlattenedProperties] = useState<any[]>(null);

    useEffect(() => {
        let isMounted = true;

        const updateModelProperties = async () => {
            setIsLoading(true);
            const newFlattenedProperties = await buildFlattenedProperties(
                adapter,
                allowedPropertyValueTypes
            );
            if (isMounted) {
                setFlattenedProperties(newFlattenedProperties);
                setIsLoading(false);
            }
        };
        updateModelProperties();

        // Safely unmount (don't update state post async action)
        return () => {
            isMounted = false;
        };
    }, []);

    console.log(flattenedProperties);

    return { isLoading, flattenedProperties };
};
