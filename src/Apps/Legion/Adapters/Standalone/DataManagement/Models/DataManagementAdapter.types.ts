import { AdapterReturnType } from '../../../../../../Models/Constants/Types';
import { IBaseAdapter } from '../../../../Models/Interfaces';
import { DataManagementAdapterData } from './DataManagementAdapter.data';

export interface IDataManagementAdapter extends IBaseAdapter {
    /** ambigious connection source; can be either a string or an object type or totally different structure, e.g. Kusto cluster url */
    connectionSource: any;
    /** ambigious get data method; can have very custom implementation through params passed, e.g. getting Kusto tables using database name */
    getData: (
        params?: any
    ) => AdapterReturnType<DataManagementAdapterData<any>>;
    /** ambigious push data method; can have very custom implementation through params passed, e.g. putting tables into a Kusto database using database name or putting rows into a Kusto table using database name and table name */
    pushData: (
        data: any,
        params?: any
    ) => AdapterReturnType<DataManagementAdapterData<any>>;

    /**
     * Or, methods can be more granular like the following if we are sure there is going to be "databases" or "tables" in the storage:
    listDatabases: () => Promise<AdapterResult<IDataManagementAdapterData>>;
    createDatabase: (databaseName: string) => void;
    listTables: () => Promise<AdapterResult<IDataManagementAdapterData>>;
    createTable: (tableName: string) => void;
    sendDataToTable: (tableName: string, data: any) => void
     */
}

export interface IGetDataAdapterParams {
    databaseName?: string;
    tableName?: string;
}

export interface IPushDataAdapterParams {
    databaseName?: string;
    tableName?: string;
    data?: string | Array<string | number | null>;
}
