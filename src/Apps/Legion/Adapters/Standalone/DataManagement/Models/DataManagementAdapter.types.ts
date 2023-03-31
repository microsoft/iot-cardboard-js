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
        columns: Array<ITableColumn>
    ) => AdapterReturnType<DataManagementAdapterData<boolean>>;
    upsertTable: (
        databaseName: string,
        tableName: string,
        data: Array<IIngestRow>
    ) => AdapterReturnType<DataManagementAdapterData<boolean>>;
    getTable: (
        databaseName: string,
        tableName: string
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
    Columns: Array<string>;
    Rows: Array<Array<any>>;
}

export interface ITableColumn {
    column: string;
    dataType: any;
}

export interface ITableIngestionMapping {
    column: string;
    path: string; // in "$.{key}" form, e.g, "$.id"
}

export interface IIngestRow {
    [key: string]: any;
}

export const TIMESTAMP_COLUMN_NAME = 'Timestamp';
export const INGESTION_MAPPING_NAME = 'DataPusherMapping';
