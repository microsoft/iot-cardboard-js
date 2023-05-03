import { createGUID } from '../../../Models/Services/Utils';
import { ITable } from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import {
    IModelExtended,
    ITwinExtended,
    PIDSourceUrls,
    PROPERTY_COLUMN_NAME,
    SourceType,
    TableTypes,
    TIMESTAMP_COLUMN_NAME,
    VALUE_COLUMN_NAME
} from '../Components/DataPusher/DataPusher.types';
import {
    IADXConnection,
    ICookedSource,
    IModel,
    IModelProperty,
    IPIDDocument,
    ITwin
} from '../Models/Interfaces';
import { ICookProperty, ICookSource } from '../Models/Types';
import CoffeeRoasteryPIDData from '../Adapters/__mockData__/PID/CoffeeRoastery.json';
import WasteWaterPIDData from '../Adapters/__mockData__/PID/WasteWater.json';
import { getColorByIdx } from './Utils';

/**
 * Returns the schema type of a given table
 * @param table
 * @returns table schema type (e.g., wide, narrow, tags)
 */
export const getTableSchemaTypeFromTable = (table: ITable) => {
    if (!table) return null;
    return table.Columns.findIndex(
        (c) => c.columnName === PROPERTY_COLUMN_NAME
    ) !== -1
        ? TableTypes.Narrow
        : table.Columns.findIndex((c) => c.columnName === VALUE_COLUMN_NAME) !==
          -1
        ? TableTypes.Tags
        : TableTypes.Wide;
};

/**
 * Based on source type it returns cooked models:
 * (1) if timeseries type, it generates the unique twin to property mapping and then extracting naive model information from those and returning cooked models and twins
 * (2) if diagram type, it returns the extracted texts from diagram as twin ids along with other properties like x, y and width, height.
 * @param sourceType the type of the source
 * @param source the source to be cooked
 * @returns ICookedSource which includes models, properties and twins objects
 */
export const cookSource = (
    sourceType: SourceType,
    source: ICookSource
): ICookedSource => {
    switch (sourceType) {
        case SourceType.Timeseries: {
            const sourceToCook: IADXConnection = source as IADXConnection;
            const tableData: ITable = sourceToCook.tableData;
            const twinIdPropertyColumn = sourceToCook.twinIdColumn;
            const tableSchema = getTableSchemaTypeFromTable(tableData);

            const idxOfTwinIdColumn = tableData.Columns.findIndex(
                (c) => c.columnName === sourceToCook.twinIdColumn
            );

            //trace the rows to exteact unique twin id to properties dictionary
            let twinIdToPropertiesMapping: Record<
                string,
                Array<ICookProperty>
            > = {};
            tableData.Rows.forEach((r) => {
                const twinId = r[idxOfTwinIdColumn];
                if (!twinIdToPropertiesMapping?.[twinId]) {
                    twinIdToPropertiesMapping = {
                        ...twinIdToPropertiesMapping,
                        [twinId]: []
                    };
                }
                switch (tableSchema) {
                    case TableTypes.Wide:
                        {
                            const nonNullPropertiesInRow = tableData.Columns.filter(
                                (c, idx) =>
                                    c.columnName !== twinIdPropertyColumn &&
                                    c.columnName !== TIMESTAMP_COLUMN_NAME &&
                                    r[idx] !== null // filter non-null columns
                            );
                            nonNullPropertiesInRow.forEach((newProp) => {
                                // append non null property to existing property bag
                                if (
                                    twinIdToPropertiesMapping[twinId].findIndex(
                                        (prop) =>
                                            prop.name === newProp.columnName
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
                            const idxOfValueColumn = tableData.Columns.findIndex(
                                (c) => c.columnName === VALUE_COLUMN_NAME
                            );
                            const idxOfPropertyColumn = tableData.Columns.findIndex(
                                (c) => c.columnName === PROPERTY_COLUMN_NAME
                            );
                            if (r[idxOfValueColumn] !== null) {
                                // append non null property to existing property bag
                                if (
                                    twinIdToPropertiesMapping[twinId].findIndex(
                                        (prop) =>
                                            prop.name === r[idxOfPropertyColumn]
                                    ) === -1
                                ) {
                                    twinIdToPropertiesMapping[twinId].push({
                                        name: r[idxOfPropertyColumn],
                                        dataType: tableData.Columns.find(
                                            (c) =>
                                                c.columnName ===
                                                PROPERTY_COLUMN_NAME
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
                    sourceConnectionString: `${sourceToCook.cluster}/${sourceToCook.database}/${sourceToCook.table}`
                };
                twins.push(twin);
            });

            return {
                models,
                twins,
                properties
            };
        }
        case SourceType.Diagram: {
            const sourceToCook: IPIDDocument = source as IPIDDocument;
            const properties: Array<IModelProperty> = [
                {
                    id: createGUID(),
                    name: 'X',
                    dataType: 'string',
                    sourcePropName: 'X'
                },
                {
                    id: createGUID(),
                    name: 'Y',
                    dataType: 'string',
                    sourcePropName: 'Y'
                },
                {
                    id: createGUID(),
                    name: 'Width',
                    dataType: 'string',
                    sourcePropName: 'Width'
                },
                {
                    id: createGUID(),
                    name: 'Height',
                    dataType: 'string',
                    sourcePropName: 'Height'
                }
            ];

            const models: Array<IModel> = [
                {
                    id: createGUID(),
                    name: 'PIDModel',
                    propertyIds: [
                        properties[0].id,
                        properties[1].id,
                        properties[2].id,
                        properties[3].id
                    ]
                }
            ];

            const twins: Array<ITwin> = (sourceToCook.pidUrl ===
            PIDSourceUrls.CoffeeRoastery
                ? CoffeeRoasteryPIDData
                : WasteWaterPIDData
            ).reduce((acc, data) => {
                // to prevent duplicate twin ids
                if (
                    acc?.findIndex((a) => a.id === data['Detected Text']) === -1
                ) {
                    acc.push({
                        id: data['Detected Text'],
                        name: data['Detected Text'],
                        modelId: models[0].id,
                        sourceConnectionString: sourceToCook.pidUrl
                    });
                }
                return acc;
            }, []);

            return {
                models,
                twins,
                properties
            };
        }
        default:
            break;
    }
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
        color: getColorByIdx(idx),
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

export const getMockData = (
    selectedTableType: TableTypes
): Array<Record<string, any>> => {
    let mockData = [];
    switch (selectedTableType) {
        case TableTypes.Wide:
            mockData = [
                {
                    ID: 'Past_1',
                    Timestamp: new Date().toISOString(),
                    Temperature: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Past_1',
                    Timestamp: new Date().toISOString(),
                    Pressure: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Salt_1',
                    Timestamp: new Date().toISOString(),
                    FanSpeed: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Salt_1',
                    Timestamp: new Date().toISOString(),
                    FlowRate: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Past_2',
                    Timestamp: new Date().toISOString(),
                    Temperature: Math.floor(Math.random() * 100),
                    Pressure: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Dryer_1',
                    Timestamp: new Date().toISOString(),
                    Pressure: Math.floor(Math.random() * 100),
                    FanSpeed: Math.floor(Math.random() * 100)
                }
            ];
            break;
        case TableTypes.Narrow:
            mockData = [
                {
                    ID: 'Past_1',
                    Timestamp: new Date().toISOString(),
                    PropertyName: 'Temperature',
                    Value: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Salt_1',
                    Timestamp: new Date().toISOString(),
                    PropertyName: 'FanSpeed',
                    Value: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Past_1',
                    Timestamp: new Date().toISOString(),
                    PropertyName: 'Pressure',
                    Value: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Salt_1',
                    Timestamp: new Date().toISOString(),
                    PropertyName: 'FlowRate',
                    Value: Math.floor(Math.random() * 100)
                }
            ];
            break;
        case TableTypes.Tags:
            mockData = [
                {
                    ID: 'Past_1',
                    Timestamp: new Date().toISOString(),
                    Value: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Salt_1',
                    Timestamp: new Date().toISOString(),
                    Value: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Past_1',
                    Timestamp: new Date().toISOString(),
                    Value: Math.floor(Math.random() * 100)
                },
                {
                    ID: 'Salt_1',
                    Timestamp: new Date().toISOString(),
                    Value: Math.floor(Math.random() * 100)
                }
            ];
            break;
        default:
            break;
    }
    return mockData;
};
