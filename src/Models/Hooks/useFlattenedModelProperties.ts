import { InterfaceInfo } from 'azure-iot-dtdl-parser/dist/parser/interfaceInfo';
import { ModelDict } from 'azure-iot-dtdl-parser/dist/parser/modelDict';
import { useEffect, useState } from 'react';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants';
import {
    addInterface,
    flattenModelledProperties
} from '../../Components/ModelledPropertyBuilder/ModelledPropertyBuilder.model';
import { PropertyValueType } from '../../Components/ModelledPropertyBuilder/ModelledPropertyBuilder.types';

interface IUseFlattenedModelPropertiesParams {
    /** Network interface with cached DTDL models & ability to resolve twins by Id */
    adapter: IModelledPropertyBuilderAdapter;

    /** List of allowed DTDL primitive types to build value properties for */
    allowedPropertyValueTypes: PropertyValueType[];
}

const getPropertyModel = (propertyId: string) => {
    const afterColonSubstring = propertyId.substring(
        propertyId.lastIndexOf(':') + 1
    );
    const modelName = afterColonSubstring.split(';')[0];
    return modelName;
};

const groupFlattenedModelProperties = (flattenedModelProperties) => {
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

const filterModelledProperties = (
    modelDict: ModelDict,
    allowedPropertyValueTypes: Array<PropertyValueType>
) => {
    const modelledProperties = {};
    const filteredModels: ModelDict = {};

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

    const flattenedModelPropertiesObject = flattenModelledProperties(
        modelledProperties['properties']
    );

    const groupedFlattenedModelProperties = groupFlattenedModelProperties(
        flattenedModelPropertiesObject
    );

    return groupedFlattenedModelProperties;
};

const buildFlattenedModelProperties = async (
    adapter: IModelledPropertyBuilderAdapter,
    allowedPropertyValueTypes: PropertyValueType[]
) => {
    const modelDict = (await adapter.getAllAdtModels()).getData().parsedModels;
    const filteredProperties = filterModelledProperties(
        modelDict,
        allowedPropertyValueTypes
    );
    return filteredProperties;
};

export const useFlattenedModelProperties = ({
    adapter,
    allowedPropertyValueTypes
}: IUseFlattenedModelPropertiesParams) => {
    const [isLoading, setIsLoading] = useState(true);
    const [flattenedModelProperties, setFlattenedModelProperties] = useState(
        null
    );

    useEffect(() => {
        let isMounted = true;

        const updateModelProperties = async () => {
            const newFlattenedModelProperties = await buildFlattenedModelProperties(
                adapter,
                allowedPropertyValueTypes
            );
            if (isMounted) {
                console.log('IS MOUNTED');
                setFlattenedModelProperties(newFlattenedModelProperties);
                console.log('IS LOADING WILL BE CHANGED', isLoading);
                setIsLoading(false);
                console.log('IS LOADING HAS BEEN CHANGED', isLoading);
            }
        };
        updateModelProperties();

        // Safely unmount (don't update state post async action)
        return () => {
            isMounted = false;
        };
    }, []);

    return { isLoading, flattenedModelProperties };
};
