import { IOATNodeElement } from '../../Constants/Interfaces';

export interface IOatGraphContextProviderProps {
    initialState?: Partial<IOatGraphContextState>;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IOatGraphContext {
    oatGraphState: IOatGraphContextState;
    oatGraphDispatch: React.Dispatch<OatGraphContextAction>;
}

/**
 * The state of the context
 */
export interface IOatGraphContextState {
    showRelationships: boolean;
    showInheritances: boolean;
    showComponents: boolean;
}

/**
 * The actions to update the state
 */
export enum OatGraphContextActionType {
    SHOW_COMPONENTS_TOGGLE = 'SHOW_COMPONENTS_SET',
    SHOW_INHERITANCES_TOGGLE = 'SHOW_INHERITANCES_SET',
    SHOW_RELATIONSHIPS_TOGGLE = 'SHOW_RELATIONSHIPS_SET'
}

/** The actions to update the state */
export type OatGraphContextAction =
    | {
          type: OatGraphContextActionType.SHOW_RELATIONSHIPS_TOGGLE;
          /** optional payload to force a specific value */
          payload?: { enabled: boolean };
      }
    | {
          type: OatGraphContextActionType.SHOW_COMPONENTS_TOGGLE;
          /** optional payload to force a specific value */
          payload?: { enabled: boolean };
      }
    | {
          type: OatGraphContextActionType.SHOW_INHERITANCES_TOGGLE;
          /** optional payload to force a specific value */
          payload?: { enabled: boolean };
      };
