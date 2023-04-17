import {
    IDbEntity,
    IDbProperty,
    IDbRelationship,
    IDbRelationshipType,
    IDbType,
    IViewEntity,
    IViewProperty,
    IViewRelationship,
    IViewRelationshipType,
    IViewType
} from '../Models';

// #region Base

function getBase(args: {
    id: string;
    isNew: boolean;
    isDeleted: boolean;
}): { id: string; isNew: boolean; isDeleted: boolean } {
    return {
        id: args?.id,
        isDeleted: args?.isDeleted ?? false,
        isNew: args?.isNew ?? false
    };
}

// #endregion

// #region Entities
export function convertViewEntityToDb(viewModel: IViewEntity): IDbEntity {
    return {
        ...getBase(viewModel),
        friendlyName: viewModel.friendlyName,
        sourceConnectionString: viewModel.sourceConnectionString,
        sourceEntityId: viewModel.sourceEntityId,
        values: viewModel.values, // TODO: do we need to serialize each property value into a string?
        typeId: viewModel.type.id
    };
}

export function convertDbEntityToView(
    dbModel: IDbEntity,
    state: {
        types: IDbType[];
        properties: IDbProperty[];
    }
): IViewEntity {
    const type = state.types.find((x) => x.id === dbModel.typeId);
    return {
        ...getBase(dbModel),
        friendlyName: dbModel.friendlyName,
        sourceConnectionString: dbModel.sourceConnectionString,
        sourceEntityId: dbModel.sourceEntityId,
        values: dbModel.values, // TODO: deserialize if we had serialized in the other direction
        type: convertDbTypeToView(type, state)
    };
}
// #endregion

// #region Types

export function convertViewTypeToDb(viewModel: IViewType): IDbType {
    return {
        ...getBase(viewModel),
        friendlyName: viewModel.friendlyName,
        color: viewModel.color,
        icon: viewModel.icon,
        kind: viewModel.kind,
        propertyIds: viewModel.properties.map((x) => x.id)
    };
}

export function convertDbTypeToView(
    dbType: IDbType,
    state: {
        properties: IDbProperty[];
    }
): IViewType {
    const properties: IViewProperty[] = [];
    dbType.propertyIds.forEach((id) => {
        const property = state.properties.find((x) => x.id === id);
        property && properties.push(convertDbPropertyToView(property));
    });
    return {
        ...getBase(dbType),
        friendlyName: dbType.friendlyName,
        color: dbType.color,
        icon: dbType.icon,
        kind: dbType.kind,
        properties: properties
    };
}
// #endregion

// #region Relationships

export function convertViewRelationshipToDb(
    viewModel: IViewRelationship
): IDbRelationship {
    return {
        ...getBase(viewModel),
        sourceEntityId: viewModel.sourceEntity.id,
        targetEntityId: viewModel.targetEntity.id,
        typeId: viewModel.type.id
    };
}

export function convertDbRelationshipToView(
    dbModel: IDbRelationship,
    state: {
        entities: IDbEntity[];
        relationshipTypes: IDbRelationshipType[];
        properties: IDbProperty[];
        types: IDbType[];
    }
): IViewRelationship {
    const sourceEntity = state.entities.find(
        (x) => x.id === dbModel.sourceEntityId
    );
    const targetEntity = state.entities.find(
        (x) => x.id === dbModel.targetEntityId
    );
    const relationshipType = state.relationshipTypes.find(
        (x) => x.id === dbModel.id
    );
    return {
        ...getBase(dbModel),
        type: convertDbRelationshipTypeToView(relationshipType),
        sourceEntity: convertDbEntityToView(sourceEntity, {
            types: state.types,
            properties: state.properties
        }),
        targetEntity: convertDbEntityToView(targetEntity, {
            types: state.types,
            properties: state.properties
        })
    };
}
// #endregion

// #region Relationship Type

export function convertViewRelationshipTypeToDb(
    viewModel: IViewRelationshipType
): IDbRelationshipType {
    return {
        ...getBase(viewModel),
        name: viewModel.name
    };
}

export function convertDbRelationshipTypeToView(
    dbModel: IDbRelationshipType
): IViewRelationshipType {
    return {
        ...getBase(dbModel),
        name: dbModel.name
    };
}
// #endregion

// #region Properties

export function convertViewPropertyToDb(viewModel: IViewProperty): IDbProperty {
    return {
        ...getBase(viewModel),
        friendlyName: viewModel.friendlyName,
        sourcePropId: viewModel.sourcePropId
    };
}

export function convertDbPropertyToView(dbModel: IDbProperty): IViewProperty {
    return {
        ...getBase(dbModel),
        friendlyName: dbModel.friendlyName,
        sourcePropId: dbModel.sourcePropId
    };
}

// #endregion
