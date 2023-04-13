/**
 * This file is for containing the top level types for use across the entire app. It should not contain any types specific to particular components or segments of the app.
 */
export enum Kind {
    UserDefined = 'UserDefined',
    PID = 'PID',
    TimeSeries = 'TimeSeries',
    Asset = 'Asset'
}

// #region Entities
/** the base attributes common to all representations of a property for an `Entity` */
interface IBaseEntity {
    /** the display friendly name of the property. Uniqueness is not required. */
    friendlyName: string;
    /** a system generated unique identifier for the property. Should be globally unique. */
    id: string;
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
// #endregion

// #region Types
/** the base attributes common to all representations of a property for a `Type` */
interface IBaseType {
    /** the color code to use for the model in visuals */
    color: string;
    /** the display friendly name of the property. Uniqueness is not required. */
    friendlyName: string;
    /** The name of an icon representing the model in visuals */
    icon: string;
    /** a system generated unique identifier for the property. Should be globally unique. */
    id: string;
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
interface IBaseProperty {
    /** the display friendly name of the property. Uniqueness is not required. */
    friendlyName: string;
    /** a system generated unique identifier for the property. Should be globally unique. */
    id: string;
    /** the id or name of the property in the source system. Uniqueness is not guaranteed */
    sourcePropId: string;
}

/** The database representation of a property for a `Type` */
export interface IDbProperty extends IBaseProperty {
    //
}
/** The view model representation of a property for a `Type` */
export interface IViewProperty extends IBaseProperty {
    //
}

// #endregion

// #region Relationships
/** the base attributes common to all representations of a `Relationship` for a `Type` */
interface IBaseRelationship {
    /** the display friendly name of the property. Uniqueness is not required. */
    friendlyName: string;
    /** a system generated unique identifier for the property. Should be globally unique. */
    id: string;
}

/** The database representation of a property of a `Type` */
export interface IDbRelationship extends IBaseRelationship {
    /** the unique identifier of the source entity */
    sourceEntityId: string;
    /** the unique identifier of the target (arrow end) entity */
    targetEntityId: string;
}
/** The view model representation of a property of a `Type` */
export interface IViewRelationship extends IBaseRelationship {
    sourceEntity: IViewEntity;
    targetEntity: IViewEntity;
}
// #endregion
