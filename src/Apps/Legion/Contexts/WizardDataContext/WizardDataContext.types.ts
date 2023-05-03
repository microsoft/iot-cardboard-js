import {
    IDbEntity,
    IDbProperty,
    IDbRelationship,
    IDbRelationshipType,
    IDbType
} from '../../Models';

export interface IWizardDataContextProviderProps {
    initialState?: Partial<IWizardDataContextState>;
}

/**
 * A context used for accessing the current wizard state
 */
export interface IWizardDataStateContext {
    wizardDataState: IWizardDataContextState;
}

/**
 * A context used for updating the wizard data state
 */
export interface IWizardDataDispatchContext {
    wizardDataDispatch: React.Dispatch<WizardDataContextAction>;
}

/**
 * The state of the context
 */
export interface IWizardDataContextState {
    /** all of the `Entities` in the graph */
    entities: IDbEntity[];
    /** all of `Types` in the graph */
    types: IDbType[];
    /** all `Relationships` in the graph */
    relationships: IDbRelationship[];
    /** all `RelationshipTypes` in the graph */
    relationshipTypes: IDbRelationshipType[];
    /** all `Property` items in the graph */
    properties: IDbProperty[];
}

/**
 * The state of the context
 */
export type ISourceAssets = Omit<
    IWizardDataContextState,
    'relationships' | 'relationshipTypes'
>;

/**
 * The actions to update the state
 */
export enum WizardDataContextActionType {
    ENTITY_ADD = 'ENTITY_ADD',
    ENTITY_REMOVE = 'ENTITY_REMOVE',
    ENTITY_UPDATE = 'ENTITY_UPDATE',
    TYPE_ADD = 'TYPE_ADD',
    TYPE_REMOVE = 'TYPE_REMOVE',
    TYPE_UPDATE = 'TYPE_UPDATE',
    RELATIONSHIP_ADD = 'RELATIONSHIP_ADD',
    RELATIONSHIP_REMOVE = 'RELATIONSHIP_REMOVE',
    RELATIONSHIP_UPDATE = 'RELATIONSHIP_UPDATE',
    PROPERTY_ADD = 'PROPERTY_ADD',
    PROPERTY_REMOVE = 'PROPERTY_REMOVE',
    PROPERTY_UPDATE = 'PROPERTY_UPDATE',
    ADD_SOURCE_ASSETS = 'ADD_SOURCE_ASSETS'
}

/** The actions to update the state */
export type WizardDataContextAction =
    | {
          type: WizardDataContextActionType.ADD_SOURCE_ASSETS;
          payload: {
              data: ISourceAssets;
          };
      }
    | {
          type: WizardDataContextActionType.ENTITY_ADD;
          payload: {
              entity: IDbEntity;
          };
      }
    | {
          type: WizardDataContextActionType.ENTITY_REMOVE;
          payload: {
              entityId: string;
          };
      }
    | {
          type: WizardDataContextActionType.ENTITY_UPDATE;
          payload: {
              entity: IDbEntity;
          };
      }
    | {
          type: WizardDataContextActionType.TYPE_ADD;
          payload: {
              type: IDbType;
          };
      }
    | {
          type: WizardDataContextActionType.TYPE_REMOVE;
          payload: {
              typeId: string;
          };
      }
    | {
          type: WizardDataContextActionType.TYPE_UPDATE;
          payload: {
              type: IDbType;
          };
      }
    | {
          type: WizardDataContextActionType.RELATIONSHIP_ADD;
          payload: {
              relationship: IDbRelationship;
              relationshipType: IDbRelationshipType;
          };
      }
    | {
          type: WizardDataContextActionType.RELATIONSHIP_REMOVE;
          payload: {
              relationshipId: string;
          };
      }
    | {
          type: WizardDataContextActionType.RELATIONSHIP_UPDATE;
          payload: {
              relationship: IDbRelationship;
              relationshipType: IDbRelationshipType;
          };
      }
    | {
          type: WizardDataContextActionType.PROPERTY_ADD;
          payload: {
              property: IDbProperty;
          };
      }
    | {
          type: WizardDataContextActionType.PROPERTY_REMOVE;
          payload: {
              propertyId: string;
          };
      }
    | {
          type: WizardDataContextActionType.PROPERTY_UPDATE;
          payload: {
              property: IDbProperty;
          };
      };
