import { InterfaceInfo } from 'azure-iot-dtdl-parser/dist/parser/interfaceInfo';
import { ModelDict } from 'azure-iot-dtdl-parser/dist/parser/modelDict';
import { useEffect, useState } from 'react';
import { IModelledPropertyBuilderAdapter } from '../../../../Models/Constants/Interfaces';
import {
    addInterface,
    flattenModelledProperties
} from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.model';
import { PropertyValueType } from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

interface IUseFlattenedPropertiesParams {
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

const groupFlattenedProperties = (flattenedProperties) => {
    const groupedProperties = {};
    Object.keys(flattenedProperties).map((key: string) => {
        flattenedProperties[key].map((property) => {
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

    const flattenedPropertiesObject = flattenModelledProperties(
        modelledProperties['properties']
    );

    const groupedFlattenedProperties = groupFlattenedProperties(
        flattenedPropertiesObject
    );

    return groupedFlattenedProperties;
};

const buildFlattenedProperties = async (
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

export const useFlattenedProperties = ({
    adapter,
    allowedPropertyValueTypes
}: IUseFlattenedPropertiesParams) => {
    const [isLoading, setIsLoading] = useState(true);
    const [flattenedProperties, setFlattenedProperties] = useState(null);

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

    return { isLoading, flattenedProperties };
};
