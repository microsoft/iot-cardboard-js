import { IDbEntity, IDbProperty, IDbRelationship, IDbType } from '../../Models';
import { createGuid, findIndexById, findItemById } from '../../Services/Utils';

export function initializeId<T extends { id: string }>(item: T): T {
    if (!item.id) {
        item.id = createGuid();
    }
    return item;
}

/** takes a collection and id and marks the first element in that collection with the matching id */
export function deleteItemById<T extends { id: string; isDeleted: boolean }>(
    id: string,
    collection: T[]
): boolean {
    let success = false;
    const index = findIndexById(id, collection);
    if (index > -1) {
        collection[index].isDeleted = true;
        success = true;
    }

    return success;
}

// #region Entities

/** removes a relationship from state */
export function removeEntityById(
    id: string,
    state: { entities: IDbEntity[]; relationships: IDbRelationship[] }
): boolean {
    return (
        deleteItemById(id, state.entities) &&
        deleteRelationshipsByEntityId(id, state)
    );
}

// #endregion

// #region Types

/** removes a relationship from state */
export function deleteTypeById(
    id: string,
    state: { types: IDbType[]; properties: IDbProperty[] }
): boolean {
    return (
        deleteItemById(id, state.types) && deletePropertiesByTypeId(id, state)
    );
}

// #endregion

// #region Relationships

/** removes a relationship from state */
export function deleteRelationshipById(
    id: string,
    state: { relationships: IDbRelationship[] }
): boolean {
    return deleteItemById(id, state.relationships);
}
/** removes all relationships either starting or ending at the provided entity id */
export function deleteRelationshipsByEntityId(
    id: string,
    state: { relationships: IDbRelationship[] }
): boolean {
    state.relationships = state.relationships.filter(
        (x) => x.sourceEntityId !== id && x.targetEntityId !== id
    );
    return true;
}

// #endregion

// #region RelationshipTypes

// #endregion

// #region Properties

/** removes a relationship from state */
export function deletePropertyById(
    id: string,
    state: { properties: IDbProperty[] }
): boolean {
    return deleteItemById(id, state.properties);
}
/** removes all the properties associated with a type from state */
export function deletePropertiesByTypeId(
    typeId: string,
    state: { types: IDbType[]; properties: IDbProperty[] }
): boolean {
    let success = false;
    const type = findItemById(typeId, state.types);
    if (!type) {
        return success;
    }
    type.propertyIds.forEach((x) => {
        success = success && deletePropertyById(x, state);
    });

    return success;
}

// #endregion
