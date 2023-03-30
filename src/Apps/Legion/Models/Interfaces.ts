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

/** to be used after cooking is done from Source table to pass Step-2&Step-3 */
export interface ICookAssets {
    models: Array<IModel>;
    properties: Array<IModelProperty>;
    twins: Array<ITwin>;
}

/** to be used for Step-4 and final object to be used to upsert to Target database */
export interface ITwinGraph extends ICookAssets {
    relationshipModels: Array<IRelationshipModel>;
    relationships: Array<IRelationship>;
}
