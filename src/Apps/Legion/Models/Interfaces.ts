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
