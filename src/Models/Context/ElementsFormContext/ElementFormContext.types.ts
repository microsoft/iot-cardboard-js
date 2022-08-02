import { ITwinToObjectMapping } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IElementFormContextProviderProps {
    elementToEdit: ITwinToObjectMapping;
    linkedBehaviorIds: string[];
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
    linkedBehaviorIds: string[];
    isDirty: boolean;
}

/**
 * The actions to update the state
 */
export enum ElementFormContextActionType {
    /** adds the element to a behavior */
    FORM_ELEMENT_BEHAVIOR_LINK_ADD = 'FORM_ELEMENT_BEHAVIOR_LINK_ADD',
    /** removes the element from a behavior */
    FORM_ELEMENT_BEHAVIOR_LINK_REMOVE = 'FORM_ELEMENT_BEHAVIOR_LINK_REMOVE',
    /** set the element name */
    FORM_ELEMENT_DISPLAY_NAME_SET = 'FORM_ELEMENT_DISPLAY_NAME_SET',
    /** Sets the primary twin id */
    FORM_ELEMENT_TWIN_ID_SET = 'FORM_ELEMENT_TWIN_ID_SET',

    /** set the list of mesh ids for the element */
    FORM_ELEMENT_SET_MESH_IDS = 'FORM_ELEMENT_SET_MESH_IDS',

    /** adds a twin alias to the element */
    FORM_ELEMENT_TWIN_ALIAS_ADD = 'FORM_ELEMENT_TWIN_ALIAS_ADD',
    /** removes a twin alias from the element */
    FORM_ELEMENT_TWIN_ALIAS_REMOVE = 'FORM_ELEMENT_TWIN_ALIAS_REMOVE'
}

/** The actions to update the state */
export type ElementFormContextAction =
    // BEHAVIORS
    | {
          type: ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_ADD;
          payload: { id: string };
      }
    | {
          type: ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_REMOVE;
          payload: { id: string };
      }
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
      };
