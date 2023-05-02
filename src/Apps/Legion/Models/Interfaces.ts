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

export interface IRelationshipModel {
    id: string;
    name: string;
}

export interface IRelationship {
    id: string;
    relationshipModelId: string; // FK for IRelationshipModel
    sourceTwinId: string; // FK for ITwin
    targetTwinId: string; // FK for ITwin
}

// TBD on the name
export interface IAppData {
    models: Array<IModel>;
    properties: Array<IModelProperty>;
    twins: Array<ITwin>;
    relationshipModels: Array<IRelationshipModel>;
    relationships: Array<IRelationship>;
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
