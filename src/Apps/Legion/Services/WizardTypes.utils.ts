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

function initializeViewBase(): { isNew: boolean; isDeleted: boolean } {
    return {
        isDeleted: false,
        isNew: false
    };
}

// #endregion

// #region Entities
export function convertViewEntityToDb(viewModel: IViewEntity): IDbEntity {
    return {
        friendlyName: viewModel.friendlyName,
        id: viewModel.id,
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
        ...initializeViewBase(),
        friendlyName: dbModel.friendlyName,
        id: dbModel.id,
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
        friendlyName: viewModel.friendlyName,
        id: viewModel.id,
        color: viewModel.color,
        icon: viewModel.icon,
        kind: viewModel.kind,
        propertyIds: viewModel.properties.map((x) => x.id)
    };
}

export function convertDbTypeToView(
    dbModel: IDbType,
    state: {
        properties: IDbProperty[];
    }
): IViewType {
    const properties: IViewProperty[] = [];
    dbModel.propertyIds.forEach((id) => {
        const property = state.properties.find((x) => x.id === id);
        property && properties.push(convertDbPropertyToView(property));
    });
    return {
        ...initializeViewBase(),
        friendlyName: dbModel.friendlyName,
        id: dbModel.id,
        color: dbModel.color,
        icon: dbModel.icon,
        kind: dbModel.kind,
        properties: properties
    };
}
// #endregion

// #region Relationships

export function convertViewRelationshipToDb(
    viewModel: IViewRelationship
): IDbRelationship {
    return {
        id: viewModel.id,
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
        ...initializeViewBase(),
        id: dbModel.id,
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
        id: viewModel.id,
        name: viewModel.name
    };
}

export function convertDbRelationshipTypeToView(
    dbModel: IDbRelationshipType
): IViewRelationshipType {
    return {
        ...initializeViewBase(),
        id: dbModel.id,
        name: dbModel.name
    };
}
// #endregion

// #region Properties

export function convertViewPropertyToDb(viewModel: IViewProperty): IDbProperty {
    return {
        friendlyName: viewModel.friendlyName,
        id: viewModel.id,
        sourcePropId: viewModel.sourcePropId
    };
}

export function convertDbPropertyToView(dbModel: IDbProperty): IViewProperty {
    return {
        ...initializeViewBase(),
        friendlyName: dbModel.friendlyName,
        id: dbModel.id,
        sourcePropId: dbModel.sourcePropId
    };
}

// #endregion
