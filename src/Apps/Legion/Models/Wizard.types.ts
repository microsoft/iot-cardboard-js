/**
 * This file is for containing the top level types for use across the entire app. It should not contain any types specific to particular components or segments of the app.
 */
export enum Kind {
    UserDefined = 'UserDefined',
    PID = 'PID',
    TimeSeries = 'TimeSeries',
    Asset = 'Asset'
}

/** the base class for all models */
export interface IBase {
    /** a system generated unique identifier for the property. Should be globally unique. */

    id: string;
    /** is the item newly discovered */
    isNew: boolean;
    /** is the item marked for deletion */
    isDeleted: boolean;
}

// #region Entities
/** the base attributes common to all representations of a property for an `Entity` */
interface IBaseEntity extends IBase {
    /** the display friendly name of the property. Uniqueness is not required. */
    friendlyName: string;
    /** string representing the source of the data. ex: a connection string for Time Series or a URL to a P&ID diagram */
    sourceConnectionString: string;
    /** the id of the entity in the source system */
    sourceEntityId: string;
    /**
     * a property bag of the values that correspond to the properties on the `Type`.
     * Note: the names of the properties here should match the names of the properties on the `Type`.
     */
    values: Record<string, string>;
}
/** The database representation of an item in the graph */
export interface IDbEntity extends IBaseEntity {
    /** the foreign key of the `Type` the entity has */
    typeId: string;
}
/** The view model representation of an item in the graph */
export interface IViewEntity extends IBaseEntity {
    /** the resolved view model of the `Type` the entity has */
    type: IViewType;
}

export interface IGenericCounters {
    created: number;
    existing: number;
    deleted: number;
}
// #endregion

// #region Types
/** the base attributes common to all representations of a property for a `Type` */
interface IBaseType extends IBase {
    /** the color code to use for the model in visuals */
    color: string;
    /** the display friendly name of the property. Uniqueness is not required. */
    friendlyName: string;
    /** The name of an icon representing the model in visuals */
    icon: string;
    /** the 'Kind' of type this is. Ex: system defined, user defined, time series, P&ID */
    kind: Kind;
}
/** The database representation of a 'type' of `Entity` */
export interface IDbType extends IBaseType {
    propertyIds: string[];
}
/** The view model representation of a 'type' of `Entity` */
export interface IViewType extends IBaseType {
    properties: IViewProperty[];
}
// #endregion

// #region Properties
/** the base attributes common to all representations of a property for a `Property` */
interface IBaseProperty extends IBase {
    /** the display friendly name of the property. Uniqueness is not required. */
    friendlyName: string;
    /** the name of the property in the source system. Uniqueness is not guaranteed */
    sourcePropName: string;
}

/** The database representation of a property for a `Type` */
export type IDbProperty = IBaseProperty;
/** The view model representation of a property for a `Type` */
export type IViewProperty = IBaseProperty;

// #endregion

// #region Relationships
/** the base attributes common to all representations of a `Relationship` for a `Type` */
type IBaseRelationship = IBase;

/** The database representation of a property of a `Relationship` */
export interface IDbRelationship extends IBaseRelationship {
    /**
     * unique identifier for the type of the relationship.
     * Foreign Key to the `RelationshipType` table
     * */
    typeId: string;
    /**
     * the unique identifier of the source entity.
     * Foreign Key to the `Entity` table.
     * */
    sourceEntityId: string;
    /**
     * the unique identifier of the target (arrow end) entity.
     * Foreign Key to the `Entity` table
     */
    targetEntityId: string;
}
/** The view model representation of a property of a `Relationship` */
export interface IViewRelationship extends IBaseRelationship {
    type: IViewRelationshipType;
    sourceEntity: IViewEntity;
    targetEntity: IViewEntity;
}

/** the base attributes common to all representations of a `RelationshipType` */
interface IBaseRelationshipType extends IBase {
    /** the display friendly name of the property. Uniqueness is not required. */
    name: string;
}

/** The database representation of a property of a `RelationshipType` */
export type { IBaseRelationshipType as IDbRelationshipType };
/** The view model representation of a property of a `RelationshipType` */
export type IViewRelationshipType = IBaseRelationshipType;
// #endregion
