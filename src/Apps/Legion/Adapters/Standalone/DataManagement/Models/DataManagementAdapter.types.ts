import { AdapterReturnType } from '../../../../../../Models/Constants/Types';
import { IBaseAdapter } from '../../../../Models/Interfaces';
import { DataManagementAdapterData } from './DataManagementAdapter.data';

export interface IDataManagementAdapter extends IBaseAdapter {
    connectionString: string;
    getDatabases: (
        args: IGetDatabaseArgs
    ) => AdapterReturnType<DataManagementAdapterData<IGetDatabaseResponse[]>>;

    createDatabase: (
        databaseName: string
    ) => AdapterReturnType<DataManagementAdapterData<boolean>>;
    getTables: (
        databaseName: string
    ) => AdapterReturnType<DataManagementAdapterData<Array<string>>>;
    createTable: (
        databaseName: string,
        tableName: string,
        columns: Array<ITableColumn>,
        ingestionMappingName: string,
        ingestionMapping?: Array<ITableIngestionMapping>
    ) => AdapterReturnType<DataManagementAdapterData<boolean>>;
    upsertTable: (
        databaseName: string,
        tableName: string,
        data: Array<IIngestRow>,
        ingestionMappingName: string
    ) => AdapterReturnType<DataManagementAdapterData<boolean>>;
    getTable: (
        databaseName: string,
        tableName: string,
        orderByColumn?: string
    ) => AdapterReturnType<DataManagementAdapterData<ITable>>;
}

/** arguments for the GetDatabase adapter method */
export interface IGetDatabaseArgs {
    clusterUrl: string;
}

/** response payload for the GetDatabase adapter method */
export interface IGetDatabaseResponse {
    id: string;
    name: string;
}

export interface ICreateDatabaseAdapterParams {
    databaseName: string;
}

export interface IGetTablesAdapterParams {
    databaseName: string;
}

export interface ICreateTableAdapterParams {
    databaseName: string;
    tableName: string;
}

export interface IGetTableAdapterParams {
    databaseName: string;
    tableName: string;
}

export interface ICreateTableAdapterParams {
    databaseName: string;
    tableName: string;
    columns: Array<ITableColumn>;
}

export interface IUpsertTableAdapterParams {
    databaseName: string;
    tableName: string;
    rows: Array<IIngestRow>;
}

export interface ITable {
    Columns: Array<ITableColumn>;
    Rows: Array<Array<any>>;
}

export interface ITableColumn {
    columnName: string;
    columnDataType:
        | 'bool'
        | 'datetime'
        | 'dynamic'
        | 'guid'
        | 'int'
        | 'long'
        | 'real'
        | 'string'
        | 'timespan'
        | 'decimal';
}

export interface ITableIngestionMapping {
    column: string;
    path: string; // in "$.{key}" form, e.g, "$.id"
}

export interface IIngestRow {
    [key: string]: any;
}
