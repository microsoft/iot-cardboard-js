import {
    IDbEntity,
    IDbProperty,
    IDbRelationship,
    IDbType,
    IViewEntity,
    IViewProperty,
    IViewRelationship,
    IViewType
} from '../Models';

// #region Entities
export function convertEntityToDb(viewModel: IViewEntity): IDbEntity {
    return {
        friendlyName: viewModel.friendlyName,
        id: viewModel.id,
        sourceConnectionString: viewModel.sourceConnectionString,
        sourceEntityId: viewModel.sourceEntityId,
        values: viewModel.values, // TODO: do we need to serialize each property value into a string?
        typeId: viewModel.type.id
    };
}

export function convertEntityToView(
    dbModel: IDbEntity,
    state: {
        types: IDbType[];
        properties: IDbProperty[];
    }
): IViewEntity {
    const type = state.types.find((x) => x.id === dbModel.typeId);
    return {
        friendlyName: dbModel.friendlyName,
        id: dbModel.id,
        sourceConnectionString: dbModel.sourceConnectionString,
        sourceEntityId: dbModel.sourceEntityId,
        values: dbModel.values, // TODO: deserialize if we had serialized in the other direction
        type: convertTypeToView(type, state)
    };
}
// #endregion

// #region Types

export function convertTypeToDb(viewModel: IViewType): IDbType {
    return {
        friendlyName: viewModel.friendlyName,
        id: viewModel.id,
        color: viewModel.color,
        icon: viewModel.icon,
        kind: viewModel.kind,
        propertyIds: viewModel.properties.map((x) => x.id)
    };
}

export function convertTypeToView(
    dbModel: IDbType,
    state: {
        properties: IDbProperty[];
    }
): IViewType {
    const properties: IViewProperty[] = [];
    dbModel.propertyIds.forEach((id) => {
        const property = state.properties.find((x) => x.id === id);
        property && properties.push(convertPropertyToView(property));
    });
    return {
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

export function convertRelationshipToDb(
    viewModel: IViewRelationship
): IDbRelationship {
    return {
        friendlyName: viewModel.friendlyName,
        id: viewModel.id,
        sourceEntityId: viewModel.sourceEntity.id,
        targetEntityId: viewModel.targetEntity.id
    };
}

export function convertRelationshipToView(
    dbModel: IDbRelationship,
    state: {
        entities: IDbEntity[];
        types: IDbType[];
        properties: IDbProperty[];
    }
): IViewRelationship {
    const sourceEntity = state.entities.find(
        (x) => x.id === dbModel.sourceEntityId
    );
    const targetEntity = state.entities.find(
        (x) => x.id === dbModel.targetEntityId
    );
    return {
        friendlyName: dbModel.friendlyName,
        id: dbModel.id,
        sourceEntity: convertEntityToView(sourceEntity, {
            types: state.types,
            properties: state.properties
        }),
        targetEntity: convertEntityToView(targetEntity, {
            types: state.types,
            properties: state.properties
        })
    };
}
// #endregion

// #region Properties

export function convertPropertyToDb(viewModel: IViewProperty): IDbProperty {
    return {
        friendlyName: viewModel.friendlyName,
        id: viewModel.id,
        sourcePropId: viewModel.sourcePropId
    };
}

export function convertPropertyToView(dbModel: IDbProperty): IDbProperty {
    return {
        friendlyName: dbModel.friendlyName,
        id: dbModel.id,
        sourcePropId: dbModel.sourcePropId
    };
}

// #endregion
