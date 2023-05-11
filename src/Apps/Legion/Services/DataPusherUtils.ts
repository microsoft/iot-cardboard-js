import { createGUID } from '../../../Models/Services/Utils';
import { ITable } from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import {
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
    IPIDDocument
} from '../Models/Interfaces';
import { ICookProperty, ICookSource } from '../Models/Types';
import CoffeeRoasteryPIDData from '../Adapters/__mockData__/PID/CoffeeRoastery.json';
import WasteWaterPIDData from '../Adapters/__mockData__/PID/WasteWater.json';
import { getColorByIdx } from './Utils';
import { IDbEntity, IDbProperty, IDbType, Kind } from '../Models';
import { PID_EXTRACTED_PROPERTIES } from '../Models/Constants';

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
 * @returns ICookedSource which includes properties, types and entities objects
 */
export const cookSource = (
    sourceType: SourceType,
    source: ICookSource
): ICookedSource => {
    switch (sourceType) {
        case SourceType.Timeseries: {
            return cookTimeSeries(source);
        }
        case SourceType.Diagram: {
            return cookDiagram(source);
        }
        default:
            return null;
    }
};

const cookTimeSeries = (source: ICookSource): ICookedSource => {
    const sourceToCook: IADXConnection = source as IADXConnection;
    const tableData: ITable = sourceToCook.tableData;
    const twinIdPropertyColumn = sourceToCook.twinIdColumn;
    const tableSchema = getTableSchemaTypeFromTable(tableData);

    const idxOfTwinIdColumn = tableData.Columns.findIndex(
        (c) => c.columnName === sourceToCook.twinIdColumn
    );

    //trace the rows to extract unique twin id to properties dictionary
    let twinIdToPropertiesMapping: Record<string, Array<ICookProperty>> = {};
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
                                    prop.sourcePropName === newProp.columnName
                            ) === -1
                        ) {
                            twinIdToPropertiesMapping[twinId].push({
                                sourcePropName: newProp.columnName,
                                lastKnownValue:
                                    r[
                                        tableData.Columns.findIndex(
                                            (c) =>
                                                c.columnName ===
                                                newProp.columnName
                                        )
                                    ]
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
                                    prop.sourcePropName ===
                                    r[idxOfPropertyColumn]
                            ) === -1
                        ) {
                            twinIdToPropertiesMapping[twinId].push({
                                sourcePropName: r[idxOfPropertyColumn],
                                lastKnownValue: r[idxOfValueColumn]
                            });
                        }
                    }
                }
                break;

            case TableTypes.Tags:
                {
                    const idxOfValueColumn = tableData.Columns.findIndex(
                        (c) => c.columnName === VALUE_COLUMN_NAME
                    );
                    if (r[idxOfValueColumn] !== null) {
                        // append non null property to existing property bag
                        twinIdToPropertiesMapping[twinId].push({
                            sourcePropName: '',
                            lastKnownValue: r[idxOfValueColumn]
                        });
                    }
                }
                break;

            default:
                break;
        }
    });

    const properties: Array<IDbProperty> = [];
    const types: Array<IDbType> = [];
    const entities: Array<IDbEntity> = [];

    const uniquePropertySets: Array<Array<ICookProperty>> = []; // property sets for potential models
    const propertySets = Object.values(twinIdToPropertiesMapping); // collected property sets for each twin
    Object.keys(twinIdToPropertiesMapping).forEach((twinId, idx) => {
        // loop through unique twin ids and check its property bags to extract models and propperties and twins
        let modelId;
        const modelIdx = uniquePropertySets.findIndex((existing) =>
            isSameSet(
                existing.map((e) => e.sourcePropName),
                propertySets[idx].map((e) => e.sourcePropName)
            )
        );
        if (modelIdx === -1) {
            // it means this propertySets is potentially new model
            uniquePropertySets.push(propertySets[idx]);
            const modelPropertyIds = [];
            propertySets[idx].forEach((prop) => {
                // trace properties and create one if not exists
                const modelProperty = properties.find(
                    (mP) => prop.sourcePropName === mP.sourcePropName
                );
                if (!modelProperty) {
                    // create model properties if not exists
                    const newPropertyId = createGUID();
                    const modelProperty: IDbProperty = {
                        id: newPropertyId,
                        sourcePropName: prop.sourcePropName,
                        friendlyName: prop.sourcePropName,
                        isDeleted: false,
                        isNew: true
                    };
                    properties.push(modelProperty);
                    modelPropertyIds.push(newPropertyId);
                } else {
                    modelPropertyIds.push(modelProperty.id);
                }
            });
            modelId = createGUID();
            const model: IDbType = {
                id: modelId,
                friendlyName: `Model-${types.length + 1}`,
                propertyIds: modelPropertyIds,
                color: getColorByIdx(types.length),
                icon: 'LineChart',
                kind: Kind.TimeSeries,
                isNew: true,
                isDeleted: false
            };
            types.push(model);
        } else {
            modelId = types[modelIdx].id;
        }
        const twin: IDbEntity = {
            id: createGUID(),
            friendlyName: twinId,
            sourceEntityId: twinId,
            isDeleted: false,
            isNew: true,
            typeId: modelId,
            sourceConnectionString: `${sourceToCook.cluster}/${sourceToCook.database}/${sourceToCook.table}`,
            values: twinIdToPropertiesMapping[twinId].reduce((acc, curr) => {
                acc[curr.sourcePropName] = curr.lastKnownValue;
                return acc;
            }, {})
        };
        entities.push(twin);
    });

    return {
        properties,
        types,
        entities
    };
};

const cookDiagram = (source: ICookSource): ICookedSource => {
    const sourceToCook: IPIDDocument = source as IPIDDocument;
    const properties: Array<IDbProperty> = [
        {
            id: createGUID(),
            friendlyName: 'X',
            sourcePropName: 'X',
            isDeleted: false,
            isNew: true
        },
        {
            id: createGUID(),
            friendlyName: 'Y',
            sourcePropName: 'Y',
            isDeleted: false,
            isNew: true
        },
        {
            id: createGUID(),
            friendlyName: 'Width',
            sourcePropName: 'Width',
            isDeleted: false,
            isNew: true
        },
        {
            id: createGUID(),
            friendlyName: 'Height',
            sourcePropName: 'Height',
            isDeleted: false,
            isNew: true
        }
    ];

    const typeId = createGUID();
    const types: Array<IDbType> = [
        {
            id: typeId,
            friendlyName: 'PIDModel',
            kind: Kind.PID,
            propertyIds: [
                properties[0].id,
                properties[1].id,
                properties[2].id,
                properties[3].id
            ],
            color: getColorByIdx(0),
            icon: 'SplitObject',
            isDeleted: false,
            isNew: true
        }
    ];

    const entities: Array<IDbEntity> = (sourceToCook.pidUrl ===
    PIDSourceUrls.CoffeeRoastery
        ? CoffeeRoasteryPIDData
        : WasteWaterPIDData
    ).map((item) => ({
        id: createGUID(),
        friendlyName: item[PID_EXTRACTED_PROPERTIES.DetectedText],
        sourceEntityId: item[PID_EXTRACTED_PROPERTIES.DetectedText],
        typeId: types[0].id,
        sourceConnectionString: sourceToCook.pidUrl,
        isDeleted: false,
        isNew: true,
        values: {
            X: item[PID_EXTRACTED_PROPERTIES.X],
            Y: item[PID_EXTRACTED_PROPERTIES.Y],
            Confidence: item[PID_EXTRACTED_PROPERTIES.Confidence]
        }
    }));

    return {
        properties,
        types,
        entities
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
