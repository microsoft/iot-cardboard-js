import { InterfaceInfo } from 'azure-iot-dtdl-parser/dist/parser/interfaceInfo';
import { ModelDict } from 'azure-iot-dtdl-parser/dist/parser/modelDict';
import { useEffect, useState } from 'react';
import {
    IModelledPropertyBuilderAdapter,
    PropertyValueType
} from '../../Models/Constants';
import {
    addInterface,
    flattenModelledProperties
} from '../../Components/ModelledPropertyBuilder/ModelledPropertyBuilder.model';
import { IFlattenedModelledPropertiesFormat } from '../../Components/ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { IGroupedModelledPropertiesFormat } from '../../Components/AdvancedSearch/Internal/QueryBuilder/QueryBuilder.types';

interface IUseFlattenedModelPropertiesParams {
    /** Network interface with cached DTDL models & ability to resolve twins by Id */
    adapter: IModelledPropertyBuilderAdapter;

    /** List of allowed DTDL primitive types to build value properties for */
    allowedPropertyValueTypes: PropertyValueType[];
}

/**
 * Helper function responsible for removing prefix and suffix values from property id
 * to get the model name.
 * @param propertyId string containing model name
 * @returns Model name
 */
const getPropertyModel = (propertyId: string) => {
    const afterColonSubstring = propertyId.substring(
        propertyId.lastIndexOf(':') + 1
    );
    const modelName = afterColonSubstring.split(';')[0];
    return modelName;
};

/**
 * Helper function that parses through flattened format list of properties and returns
 * them grouped by model name. See types for each format's data structure.
 * @param flattenedModelProperties List of properties in a flattened format
 * @returns List of same properties in a new format, grouped
 */
const groupFlattenedModelProperties = (
    flattenedModelProperties: IFlattenedModelledPropertiesFormat
): IGroupedModelledPropertiesFormat => {
    const groupedProperties = {};
    Object.keys(flattenedModelProperties).map((key: string) => {
        flattenedModelProperties[key].map((property) => {
            const modelName = getPropertyModel(property.key);
            if (!groupedProperties[modelName]) {
                groupedProperties[modelName] = [];
            }
            groupedProperties[modelName].push(property);
        });
    });
    return groupedProperties;
};

/**
 * Function that filters model dictionary data to obtain modelled properties grouped by model name.
 * @param modelDict Set of all parsed DTDL models
 * @param allowedPropertyValueTypes Set of property types to include as property value leaves
 * @returns grouped modelled properties
 */
const filterAndGroupModelledProperties = (
    modelDict: ModelDict,
    allowedPropertyValueTypes: Array<PropertyValueType>
) => {
    const modelledProperties: Record<string, any> = {};
    const filteredModels: ModelDict = {};

    // Filter out all non-interface values of model data
    for (const key in modelDict) {
        if (modelDict[key].entityKind === 'interface') {
            filteredModels[key] = modelDict[key];
        }
    }

    // Populate modelled properties object recursively from filtered values
    // of the model dictionary
    for (const key in filteredModels) {
        addInterface(
            modelledProperties,
            filteredModels[key] as InterfaceInfo,
            key,
            allowedPropertyValueTypes
        );
    }

    // Flattens modelled properties into '.' separated path keys to be used in dropdown representations
    const flattenedModelPropertiesObject: IFlattenedModelledPropertiesFormat = flattenModelledProperties(
        modelledProperties['properties']
    );

    // Groups modelled properties by model name for grouped dropdown representations
    const groupedFlattenedModelProperties = groupFlattenedModelProperties(
        flattenedModelPropertiesObject
    );

    return groupedFlattenedModelProperties;
};

/**
 * Function that fetches and calls helpers to process modelled properties
 * @param adapter Helper used to fetch data
 * @param allowedPropertyValueTypes
 * @returns
 */
const fetchFlattenedModelProperties = async (
    adapter: IModelledPropertyBuilderAdapter,
    allowedPropertyValueTypes: PropertyValueType[]
) => {
    const modelDict = (await adapter.getAllAdtModels()).getData().parsedModels;
    const groupedProperties = filterAndGroupModelledProperties(
        modelDict,
        allowedPropertyValueTypes
    );
    return groupedProperties;
};

/**
 * React hook responsible for fetching and constructing grouped data of modelled properties
 * @param adapter Helper used to fetch data
 * @param allowedPropertyValueTypes Set of property types to include as property value leaves
 * @returns load state and grouped properties after fetching and constructed
 */
export const useFlattenedModelProperties = ({
    adapter,
    allowedPropertyValueTypes
}: IUseFlattenedModelPropertiesParams): {
    isLoading: boolean;
    flattenedModelProperties: IGroupedModelledPropertiesFormat;
} => {
    const [isLoading, setIsLoading] = useState(true);
    const [flattenedModelProperties, setFlattenedModelProperties] = useState(
        null
    );

    useEffect(() => {
        let isMounted = true;

        const updateModelProperties = async () => {
            const newFlattenedModelProperties = await fetchFlattenedModelProperties(
                adapter,
                allowedPropertyValueTypes
            );
            if (isMounted) {
                setFlattenedModelProperties(newFlattenedModelProperties);
                setIsLoading(false);
            }
        };
        updateModelProperties();

        // Safely unmount (don't update state post async action)
        return () => {
            isMounted = false;
        };
    }, [adapter, allowedPropertyValueTypes]);

    return { isLoading, flattenedModelProperties };
};
