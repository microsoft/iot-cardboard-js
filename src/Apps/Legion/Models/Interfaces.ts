import {
    IDataManagementAdapter,
    ITable
} from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { TableTypes } from '../Components/DataPusher/DataPusher.types';
import { IDbEntity, IDbProperty, IDbType } from './Wizard.types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBaseAdapter {}

export interface ICookedSource {
    types: Array<IDbType>;
    properties: Array<IDbProperty>;
    entities: Array<IDbEntity>;
}

/** to be used for Database ingestion flow */
export interface IADXConnection {
    cluster: string;
    database: string;
    table: string;
    twinIdColumn: string;
    tableType: TableTypes;
    tableData?: ITable;
}

export interface IPIDDocument {
    pidUrl: string;
}

/** type definition for target context parameter for useADXAdapter hook */
export interface IADXAdapterTargetContext {
    adapter: IDataManagementAdapter;
}
