import { IDbEntity, IDbProperty, IDbRelationship, IDbType } from '../../Models';
import { findItemById, removeItemById } from '../../Services/Utils';

// #region Entities

/** removes a relationship from state */
export function removeEntityById(
    id: string,
    state: { entities: IDbEntity[] }
): boolean {
    return removeItemById(id, state.entities);
}

// #endregion

// #region Types

/** removes a relationship from state */
export function removeTypeById(
    id: string,
    state: { types: IDbType[] }
): boolean {
    return removeItemById(id, state.types);
}

// #endregion

// #region Relationships

/** removes a relationship from state */
export function removeRelationshipById(
    id: string,
    state: { relationships: IDbRelationship[] }
): boolean {
    return removeItemById(id, state.relationships);
}
/** removes all relationships either starting or ending at the provided entity id */
export function removeRelationshipsByEntityId(
    id: string,
    state: { relationships: IDbRelationship[] }
): boolean {
    state.relationships = state.relationships.filter(
        (x) => x.sourceEntityId !== id && x.targetEntityId !== id
    );
    return true;
}

// #endregion

// #region Properties

/** removes a relationship from state */
export function removePropertyById(
    id: string,
    state: { properties: IDbProperty[] }
): boolean {
    return removeItemById(id, state.properties);
}
/** removes all the properties associated with a type from state */
export function removePropertiesByTypeId(
    typeId: string,
    state: { types: IDbType[]; properties: IDbProperty[] }
): boolean {
    let success = false;
    const type = findItemById(typeId, state.types);
    if (!type) {
        return success;
    }
    type.propertyIds.forEach((x) => {
        success = success && removePropertyById(x, state);
    });

    return success;
}

// #endregion
