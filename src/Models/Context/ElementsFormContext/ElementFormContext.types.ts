import { ITwinToObjectMapping } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IElementFormContextProviderProps {
    elementToEdit: ITwinToObjectMapping;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IElementFormContext {
    elementFormState: IElementFormContextState;
    elementFormDispatch: React.Dispatch<ElementFormContextAction>;
}

/**
 * The state of the context
 */
export interface IElementFormContextState {
    elementToEdit: ITwinToObjectMapping | null;
    isDirty: boolean;
}

/**
 * The actions to update the state
 */
export enum ElementFormContextActionType {
    /** set the element name */
    FORM_ELEMENT_DISPLAY_NAME_SET = 'FORM_ELEMENT_DISPLAY_NAME_SET',
    /** Sets the primary twin id */
    FORM_ELEMENT_TWIN_ID_SET = 'FORM_ELEMENT_TWIN_ID_SET',

    /** set the list of mesh ids for the element */
    FORM_ELEMENT_SET_MESH_IDS = 'FORM_ELEMENT_SET_MESH_IDS',

    /** adds a twin alias to the element */
    FORM_ELEMENT_TWIN_ALIAS_ADD = 'FORM_ELEMENT_TWIN_ALIAS_ADD',
    /** removes a twin alias from the element */
    FORM_ELEMENT_TWIN_ALIAS_REMOVE = 'FORM_ELEMENT_TWIN_ALIAS_REMOVE',

    /** reverts all changes to the element back to it's initial state */
    FORM_ELEMENT_RESET = 'FORM_ELEMENT_RESET'
}

/** The actions to update the state */
export type ElementFormContextAction =
    // ELEMENT PROPERTIES
    | {
          type: ElementFormContextActionType.FORM_ELEMENT_DISPLAY_NAME_SET;
          payload: { name: string };
      }
    | {
          type: ElementFormContextActionType.FORM_ELEMENT_TWIN_ID_SET;
          payload: { twinId: string };
      }
    // ELEMENT OBJECT/MESH IDs
    | {
          type: ElementFormContextActionType.FORM_ELEMENT_SET_MESH_IDS;
          payload: {
              meshIds: string[];
          };
      }
    // ELEMENT TWIN ALIASES
    | {
          type: ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_ADD;
          payload: {
              aliasName: string;
              aliasTarget: string;
          };
      }
    | {
          type: ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_REMOVE;
          payload: {
              aliasName: string;
          };
      }
    // ELEMENT OPERATIONS
    | {
          type: ElementFormContextActionType.FORM_ELEMENT_RESET;
          payload?: {
              element?: ITwinToObjectMapping;
              layerIds?: string[];
          };
      };