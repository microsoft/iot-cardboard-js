import { AdapterReturnType } from '../../../../../../Models/Constants/Types';
import { IBaseAdapter } from '../../../../Models/Interfaces';
import { DataManagementAdapterData } from './DataManagementAdapter.data';

export interface IDataManagementAdapter extends IBaseAdapter {
    /** ambigious connection source; can be either a string or an object type or totally different structure, e.g. Kusto cluster url */
    connectionSource: any;
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
        tableName: string
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

export interface ITable {
    Columns: Array<string>;
    Rows: Array<Array<any>>;
}

export interface IIngestRow {
    [key: string]: any;
}
