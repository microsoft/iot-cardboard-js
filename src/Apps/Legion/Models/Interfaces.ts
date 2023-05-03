import {
    IDataManagementAdapter,
    ITable
} from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { TableTypes } from '../Components/DataPusher/DataPusher.types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBaseAdapter {}

export interface IModel {
    id: string;
    name: string;
    propertyIds: Array<string>; // FKs for IModelProperty
}

export interface IModelProperty {
    id: string;
    name: string;
    sourcePropName: string;
    /** scalar data types in KQL */
    dataType:
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

export interface ITwin {
    id: string;
    name: string;
    modelId: string; // FK for IModel
    sourceConnectionString: string;
}

// TBD on the name
export interface ICookedSource {
    models: Array<IModel>;
    properties: Array<IModelProperty>;
    twins: Array<ITwin>;
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
