import { createGUID } from '../../../Models/Services/Utils';
import { getHighChartColorByIdx } from '../../../Models/SharedUtils/DataHistoryUtils';
import { ITable } from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import {
    PROPERTY_COLUMN_NAME,
    TableTypes,
    TIMESTAMP_COLUMN_NAME,
    VALUE_COLUMN_NAME
} from '../Components/DataPusher/DataPusher.types';
import {
    IModelExtended,
    ITwinExtended
} from '../Components/WizardShell/Internal/TwinVerificationStep/TwinVerificationStep.types';
import { IAppData, IModel, IModelProperty, ITwin } from '../Models/Interfaces';
import { ICookProperty } from '../Models/Types';

/**
 * This generates the unique twin to property mapping and then extracting naive model information from those and returning cooked models and twins
 * @param table the source table to cook
 * @param twinIdPropertyColumn the twin id property column
 * @param tableType table schema type, e.g., wide, narrow
 * @returns IAppData which includes models, properties and twins objects
 */
export const cookSourceTable = (
    sourceConnectionString: string,
    table: ITable,
    twinIdPropertyColumn: string,
    tableType: TableTypes
): IAppData => {
    const idxOfTwinIdColumn = table.Columns.findIndex(
        (c) => c.columnName === twinIdPropertyColumn
    );

    //trace the rows to exteact unique twin id to properties dictionary
    let twinIdToPropertiesMapping: Record<string, Array<ICookProperty>> = {};
    table.Rows.forEach((r) => {
        const twinId = r[idxOfTwinIdColumn];
        if (!twinIdToPropertiesMapping?.[twinId]) {
            twinIdToPropertiesMapping = {
                ...twinIdToPropertiesMapping,
                [twinId]: []
            };
        }
        switch (tableType) {
            case TableTypes.Wide:
                {
                    const nonNullPropertiesInRow = table.Columns.filter(
                        (c, idx) =>
                            c.columnName !== twinIdPropertyColumn &&
                            c.columnName !== TIMESTAMP_COLUMN_NAME &&
                            r[idx] !== null // filter non-null columns
                    );
                    nonNullPropertiesInRow.forEach((newProp) => {
                        // append non null property to existing property bag
                        if (
                            twinIdToPropertiesMapping[twinId].findIndex(
                                (prop) => prop.name === newProp.columnName
                            ) === -1
                        ) {
                            twinIdToPropertiesMapping[twinId].push({
                                name: newProp.columnName,
                                dataType: newProp.columnDataType
                            });
                        }
                    });
                }
                break;
            case TableTypes.Narrow:
                {
                    const idxOfValueColumn = table.Columns.findIndex(
                        (c) => c.columnName === VALUE_COLUMN_NAME
                    );
                    const idxOfPropertyColumn = table.Columns.findIndex(
                        (c) => c.columnName === PROPERTY_COLUMN_NAME
                    );
                    if (r[idxOfValueColumn] !== null) {
                        // append non null property to existing property bag
                        if (
                            twinIdToPropertiesMapping[twinId].findIndex(
                                (prop) => prop.name === r[idxOfPropertyColumn]
                            ) === -1
                        ) {
                            twinIdToPropertiesMapping[twinId].push({
                                name: r[idxOfPropertyColumn],
                                dataType: table.Columns.find(
                                    (c) => c.columnName === PROPERTY_COLUMN_NAME
                                ).columnDataType
                            });
                        }
                    }
                }
                break;

            case TableTypes.Tags:
                break;

            default:
                break;
        }
    });

    const models: Array<IModel> = [];
    const twins: Array<ITwin> = [];
    const properties: Array<IModelProperty> = [];

    const uniquePropertySets: Array<Array<ICookProperty>> = []; // property sets for potential models
    const propertySets = Object.values(twinIdToPropertiesMapping); // collected property sets for each twin
    Object.keys(twinIdToPropertiesMapping).forEach((twinId, idx) => {
        // loop through unique twin ids and check its property bags to extract models and propperties and twins
        let modelId;
        const modelIdx = uniquePropertySets.findIndex((existing) =>
            isSameSet(
                existing.map((e) => e.name),
                propertySets[idx].map((e) => e.name)
            )
        );
        if (modelIdx === -1) {
            // it means this propertySets is potentially new model
            uniquePropertySets.push(propertySets[idx]);
            const modelPropertyIds = [];
            propertySets[idx].forEach((prop) => {
                // trace properties and create one if not exists
                const modelProperty = properties.find(
                    (mP) => prop.name === mP.sourcePropName
                );
                if (!modelProperty) {
                    // create model properties if not exists
                    const newPropertyId = createGUID();
                    const modelProperty: IModelProperty = {
                        id: newPropertyId,
                        name: prop.name,
                        sourcePropName: prop.name,
                        dataType: prop.dataType
                    };
                    properties.push(modelProperty);
                    modelPropertyIds.push(newPropertyId);
                } else {
                    modelPropertyIds.push(modelProperty.id);
                }
            });
            modelId = createGUID();
            const model: IModel = {
                id: modelId,
                name: `Model-${models.length + 1}`,
                propertyIds: modelPropertyIds
            };
            models.push(model);
        } else {
            modelId = models[modelIdx].id;
        }
        const twin: ITwin = {
            id: twinId,
            name: twinId,
            modelId: modelId,
            sourceConnectionString: sourceConnectionString
        };
        twins.push(twin);
    });

    return {
        models,
        twins,
        properties,
        relationshipModels: [],
        relationships: []
    };
};

/**
 * Returns true if two arrays of properties have the same elements
 * @param array1
 * @param array2
 */
export const isSameSet = (array1: Array<string>, array2: Array<string>) =>
    array1.length === array2.length &&
    array1.every((e1) => array2.includes(e1));

export const getViewModelsFromCookedAssets = (
    models: Array<IModel>
): Array<IModelExtended> => {
    const viewModels: Array<IModelExtended> = models.map((m, idx) => ({
        id: m.id,
        name: m.name,
        color: getHighChartColorByIdx(idx),
        propertyIds: m.propertyIds,
        selectedPropertyIds: m.propertyIds
    }));
    return viewModels;
};

export const getViewTwinsFromCookedAssets = (
    twins: Array<ITwin>,
    viewModels: Array<IModelExtended>
): Array<ITwinExtended> => {
    const viewTwins: Array<ITwinExtended> = twins.map((t) => ({
        ...t,
        model: viewModels.find((vM) => vM.id === t.modelId),
        isSelected: true
    }));
    return viewTwins;
};
