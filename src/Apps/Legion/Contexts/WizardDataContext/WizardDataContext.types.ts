import { IDbEntity, IDbProperty, IDbRelationship, IDbType } from '../../Models';

export interface IWizardDataContextProviderProps<N> {
    initialState?: Partial<IWizardDataContextState>;
}

/**
 * A context used for capturing the current data in the app
 */
export interface IWizardDataContext {
    wizardDataState: IWizardDataContextState;
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
    /** all `Property` items in the graph */
    properties: IDbProperty[];
}

/**
 * The actions to update the state
 */
export enum WizardDataContextActionType {
    SET_ENTITIES = 'SET_ENTITIES',
    SET_TYPES = 'SET_TYPES',
    SET_RELATIONSHIPS = 'SET_RELATIONSHIPS'
}

/** The actions to update the state */
export type WizardDataContextAction =
    | {
          type: WizardDataContextActionType.SET_ENTITIES;
          payload: {
              entities: IDbEntity[];
          };
      }
    | {
          type: WizardDataContextActionType.SET_RELATIONSHIPS;
          payload: {
              relationships: IDbRelationship[];
          };
      }
    | {
          type: WizardDataContextActionType.SET_TYPES;
          payload: {
              types: IDbType[];
          };
      };
