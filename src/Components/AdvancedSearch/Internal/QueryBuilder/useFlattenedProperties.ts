import { EntityKinds } from 'azure-iot-dtdl-parser/dist/parser/entityKinds';
import { InterfaceInfo } from 'azure-iot-dtdl-parser/dist/parser/interfaceInfo';
import { ModelDict } from 'azure-iot-dtdl-parser/dist/parser/modelDict';
import { ObjectInfo } from 'azure-iot-dtdl-parser/dist/parser/objectInfo';
import { useEffect, useState } from 'react';
import { IModelledPropertyBuilderAdapter } from '../../../../Models/Constants/Interfaces';
import {
    addInterface,
    flattenModelledProperties
} from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.model';
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

const getPropertyModel = (propertyId: string) => {
    return '';
};

const filterModelledProperties = (
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

    Object.keys(flattenedPropertiesObject).map((key: string) => {
        flattenedPropertiesObject[key].map((property) => {
            flattenedPropertiesArray.push({
                key: property.key,
                name: property.name,
                propertyType: property.propertyType,
                localPath: property.localPath,
                model: getPropertyModel(property.id)
            });
        });
    });

    return flattenedPropertiesArray;
};

const buildFlattenedProperties = async (adapter, allowedPropertyValueTypes) => {
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

    return { isLoading, flattenedProperties };
};
