import { getDebugLogger } from '../../../Models/Services/Utils';
import {
    IBase,
    IDbEntity,
    IDbProperty,
    IDbRelationship,
    IDbRelationshipType,
    IDbType,
    IViewEntity,
    IViewProperty,
    IViewRelationship,
    IViewRelationshipType,
    IViewType,
    Kind
} from '../Models';

const debugLogging = true;
export const logDebugConsole = getDebugLogger('WizardTypeUtils', debugLogging);

// #region Base

function getBase(args: IBase): IBase {
    return {
        id: args?.id,
        isDeleted: args?.isDeleted ?? false,
        isNew: args?.isNew ?? false
    };
}

// #endregion

// #region Entities
export function getNewViewEntity(
    viewModel: {
        friendlyName: string;
        type: IViewType;
    } & Partial<IViewEntity>
): IViewEntity {
    return {
        id: '',
        isDeleted: false,
        isNew: true,
        sourceConnectionString: '',
        sourceEntityId: '',
        values: {},
        ...viewModel
    };
}

export function convertViewEntityToDb(viewModel: IViewEntity): IDbEntity {
    logDebugConsole(
        'debug',
        `Converting view entity (${viewModel?.friendlyName}) to db. {model}`,
        viewModel
    );
    if (!viewModel) {
        logDebugConsole(
            'warn',
            'Unable to convert entity because it is undefined'
        );
        return undefined;
    }
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
    logDebugConsole(
        'debug',
        `Converting db entity (${dbModel?.friendlyName}) to view. {model}`,
        dbModel
    );
    if (!dbModel) {
        logDebugConsole(
            'warn',
            'Unable to convert entity because it is undefined'
        );
        return undefined;
    }
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
export function getNewViewType(
    viewModel: {
        friendlyName: string;
        color: string;
        icon: string;
        kind: Kind;
    } & Partial<IViewType>
): IViewType {
    return {
        id: '',
        isDeleted: false,
        isNew: true,
        properties: [],
        ...viewModel
    };
}

export function convertViewTypeToDb(viewModel: IViewType): IDbType {
    logDebugConsole(
        'debug',
        `Converting view type (${viewModel?.friendlyName}) to db. {model}`,
        viewModel
    );
    if (!viewModel) {
        logDebugConsole(
            'warn',
            'Unable to convert type because it is undefined'
        );
        return undefined;
    }
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
    dbModel: IDbType,
    state: {
        properties: IDbProperty[];
    }
): IViewType {
    logDebugConsole(
        'debug',
        `Converting db type (${dbModel?.friendlyName}) to view. {model}`,
        dbModel
    );
    if (!dbModel) {
        logDebugConsole(
            'warn',
            'Unable to convert type because it is undefined'
        );
        return undefined;
    }
    const properties: IViewProperty[] = [];
    dbModel.propertyIds.forEach((id) => {
        const property = state.properties.find((x) => x.id === id);
        property && properties.push(convertDbPropertyToView(property));
    });
    return {
        ...getBase(dbModel),
        friendlyName: dbModel.friendlyName,
        color: dbModel.color,
        icon: dbModel.icon,
        kind: dbModel.kind,
        properties: properties
    };
}
// #endregion

// #region Relationships
export function getNewViewRelationship(
    viewModel: {
        type: IViewRelationshipType;
        sourceEntity: IViewEntity;
        targetEntity: IViewEntity;
    } & Partial<IViewRelationship>
): IViewRelationship {
    return {
        id: '',
        isDeleted: false,
        isNew: true,
        ...viewModel
    };
}

export function convertViewRelationshipToDb(
    viewModel: IViewRelationship
): IDbRelationship {
    logDebugConsole(
        'debug',
        `Converting view relationship (${viewModel?.id}) to db. {model}`,
        viewModel
    );
    if (
        !viewModel ||
        !viewModel.targetEntity ||
        !viewModel.sourceEntity ||
        !viewModel.type
    ) {
        logDebugConsole(
            'warn',
            'Unable to convert relationship because a required field is undefined'
        );
        return undefined;
    }
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
    logDebugConsole(
        'debug',
        `Converting db relationship (${dbModel?.id}) to view. {model}`,
        dbModel
    );
    if (
        !dbModel ||
        !dbModel.sourceEntityId ||
        !dbModel.targetEntityId ||
        !dbModel.typeId
    ) {
        logDebugConsole(
            'warn',
            'Unable to convert relationship because a required field is undefined'
        );
        return undefined;
    }
    const sourceEntity = state.entities.find(
        (x) => x.id === dbModel.sourceEntityId
    );
    const targetEntity = state.entities.find(
        (x) => x.id === dbModel.targetEntityId
    );
    const relationshipType = state.relationshipTypes.find(
        (x) => x.id === dbModel.typeId
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
export function getNewViewRelationshipType(
    viewModel: {
        name: string;
    } & Partial<IViewRelationshipType>
): IViewRelationshipType {
    logDebugConsole(
        'debug',
        `Converting db relationship type (${viewModel?.name}) to view. {model}`,
        viewModel
    );
    return {
        id: '',
        isDeleted: false,
        isNew: true,
        ...viewModel
    };
}

export function convertViewRelationshipTypeToDb(
    viewModel: IViewRelationshipType
): IDbRelationshipType {
    logDebugConsole(
        'debug',
        `Converting view relationship type (${viewModel?.name}) to view. {model}`,
        viewModel
    );
    if (!viewModel) {
        logDebugConsole(
            'warn',
            'Unable to convert relationship type because it is undefined'
        );
        return undefined;
    }
    return {
        ...getBase(viewModel),
        name: viewModel.name
    };
}

export function convertDbRelationshipTypeToView(
    dbModel: IDbRelationshipType
): IViewRelationshipType {
    logDebugConsole(
        'debug',
        `Converting db relationship type (${dbModel?.name}) to view. {model}`,
        dbModel
    );
    if (!dbModel) {
        logDebugConsole(
            'warn',
            'Unable to convert relationship type because it is undefined'
        );
        return undefined;
    }
    return {
        ...getBase(dbModel),
        name: dbModel.name
    };
}
// #endregion

// #region Properties
export function getNewViewProperty(
    viewModel: {
        friendlyName: string;
        sourcePropId: string;
    } & Partial<IViewProperty>
): IViewProperty {
    return {
        id: '',
        isDeleted: false,
        isNew: true,
        ...viewModel
    };
}

export function convertViewPropertyToDb(viewModel: IViewProperty): IDbProperty {
    logDebugConsole(
        'debug',
        `Converting view property (${viewModel?.friendlyName}) to db. {model}`,
        viewModel
    );
    if (!viewModel) {
        logDebugConsole(
            'warn',
            'Unable to convert property because it is undefined'
        );
        return undefined;
    }
    return {
        ...getBase(viewModel),
        friendlyName: viewModel.friendlyName,
        sourcePropId: viewModel.sourcePropId
    };
}

export function convertDbPropertyToView(dbModel: IDbProperty): IViewProperty {
    logDebugConsole(
        'debug',
        `Converting db property (${dbModel?.friendlyName}) to view. {model}`,
        dbModel
    );
    if (!dbModel) {
        logDebugConsole(
            'warn',
            'Unable to convert property because it is undefined'
        );
        return undefined;
    }
    return {
        ...getBase(dbModel),
        friendlyName: dbModel.friendlyName,
        sourcePropId: dbModel.sourcePropId
    };
}

// #endregion
