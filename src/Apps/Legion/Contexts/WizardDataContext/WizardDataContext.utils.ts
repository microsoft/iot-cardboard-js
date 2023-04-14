import { IDbEntity, IDbRelationship, IDbType } from '../../Models';
import { removeItemById } from '../../Services/Utils';

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
    state: { properties: IDbRelationship[] }
): boolean {
    return removeItemById(id, state.properties);
}

// #endregion
