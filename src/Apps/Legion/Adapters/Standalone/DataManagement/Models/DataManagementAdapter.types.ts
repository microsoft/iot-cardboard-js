import { AdapterReturnType } from '../../../../../../Models/Constants/Types';
import { IBaseAdapter } from '../../../../Models/Interfaces';
import { DataManagementAdapterData } from './DataManagementAdapter.data';

export interface IDataManagementAdapter extends IBaseAdapter {
    connectionString: string;
    getDatabases: () => AdapterReturnType<
        DataManagementAdapterData<Array<string>>
    >;
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
    columnDataType: any;
}

export interface ITableIngestionMapping {
    column: string;
    path: string; // in "$.{key}" form, e.g, "$.id"
}

export interface IIngestRow {
    [key: string]: any;
}