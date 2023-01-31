import {
    DtdlInterface,
    DtdlInterfaceContent,
    IOATNodePosition,
    OatGraphReferenceType,
    OatReferenceType
} from '../../Constants';
import {
    IOATSelection,
    IOATError,
    IOATModelPosition,
    IOATConfirmDelete,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLProperty } from '../../Classes/DTDL';
import { IOatProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import {
    IOATFile,
    IOatPropertyEditorTabKey
} from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { IDropdownOption } from '@fluentui/react';

export interface IOatPageContextProviderProps {
    initialState?: Partial<IOatPageContextState>;
    /**
     * disables use of local storage by the context
     * NOTE: Should ONLY be used in tests, not intended for production use.
     */
    disableLocalStorage?: boolean;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IOatPageContext {
    oatPageState: IOatPageContextState;
    oatPageDispatch: React.Dispatch<OatPageContextAction>;
}

type GraphUpdatePayload =
    | GraphUpdateNonePayload
    | GraphUpdateAddPayload
    | GraphUpdateUpdatePayload
    | GraphUpdateDeletePayload;
type GraphUpdateNonePayload = {
    actionType: 'None';
};
type GraphUpdateAddPayload = {
    actionType: 'Add';
    models: DtdlInterface[];
};
type GraphUpdateUpdatePayload = {
    actionType: 'Update';
    models: {
        oldId: string;
        newModel: DtdlInterface;
    }[];
};
type GraphUpdateDeletePayload = {
    actionType: 'Delete';
    models: DtdlInterface[];
};

/**
 * The state of the context
 */
export interface IOatPageContextState {
    confirmDeleteOpen?: IOATConfirmDelete;
    currentOntologyId: string;
    currentOntologyModelMetadata: IOATModelsMetadata[];
    currentOntologyModelPositions: IOATModelPosition[];
    currentOntologyModels: DtdlInterface[];
    currentOntologyNamespace: string;
    currentOntologyProjectName: string;
    currentOntologyTemplates: DTDLProperty[];
    languageOptions: IDropdownOption[];
    triggerGraphLayout: boolean;
    error?: IOATError;
    graphUpdatesToSync: GraphUpdatePayload;
    isJsonUploaderOpen?: boolean;
    modified?: boolean;
    ontologyFiles: IOATFile[];
    selection?: IOATSelection;
    templatesActive?: boolean;
    selectedPropertyEditorTab: IOatPropertyEditorTabKey;
}

/**
 * The actions to update the state
 */
export enum OatPageContextActionType {
    SET_OAT_CONFIRM_DELETE_OPEN = 'SET_OAT_CONFIRM_DELETE_OPEN',
    /** creates a new project, switches to that project */
    CREATE_PROJECT = 'CREATE_PROJECT',
    /** updates properties of an existing project */
    EDIT_PROJECT = 'EDIT_PROJECT',
    /** creates a copy of the current project with a new id and switches to it */
    DUPLICATE_PROJECT = 'DUPLICATE_PROJECT',
    /** Saves the current state and then sets the current active project to the given project id */
    SWITCH_CURRENT_PROJECT = 'SWITCH_PROJECT',
    /** removes the model and all references to that model from the state */
    DELETE_MODEL = 'DELETE_MODEL',
    /** removes the reference betwseen  */
    DELETE_REFERENCE = 'DELETE_REFERENCE',
    /** reverts the Models, positions & selection to the provided value */
    GENERAL_UNDO = 'GENERAL_UNDO',
    /** replaces the models data in the current project with the provided value */
    SET_CURRENT_MODELS = 'SET_CURRENT_MODELS',
    /** replaces the metadata data in the current project with the provided value */
    SET_CURRENT_MODELS_METADATA = 'SET_CURRENT_MODELS_METADATA',
    /** replaces the position data in the current project with the provided value */
    SET_CURRENT_MODELS_POSITIONS = 'SET_CURRENT_MODELS_POSITIONS',
    /** updates the current project to use the updated namespace value */
    SET_CURRENT_NAMESPACE = 'SET_CURRENT_NAMESPACE',
    /** updates the name on the current project to the given value */
    SET_CURRENT_PROJECT_NAME = 'SET_CURRENT_PROJECT_NAME',
    SET_CURRENT_TEMPLATES = 'SET_CURRENT_TEMPLATES',
    /** Replace the details of an existing Model with a complete copy of updated data on the state. A model with the same ID must already exist on the state */
    UPDATE_MODEL = 'UPDATE_MODEL',
    /** Replace the details of a Relationship or Component with a complete copy of data on a given model id */
    UPDATE_REFERENCE = 'UPDATE_REFERENCE',
    /** updates all references to the old id to the new id */
    UPDATE_MODEL_ID = 'UPDATE_MODEL_ID',
    /** updates the model positions for the given models */
    UPDATE_MODEL_POSTIONS = 'UPDATE_MODEL_POSTIONS',
    IMPORT_MODELS = 'IMPORT_MODELS',
    ADD_NEW_MODEL = 'ADD_NEW_MODEL',
    ADD_NEW_RELATIONSHIP = 'ADD_NEW_RELATIONSHIP',
    ADD_NEW_MODEL_WITH_RELATIONSHIP = 'ADD_NEW_MODEL_WITH_RELATIONSHIP',

    CLEAR_GRAPH_LAYOUT = 'CLEAR_GRAPH_LAYOUT',
    SET_CURRENT_PROJECT = 'SET_OAT_PROJECT',
    SET_SELECTED_PROPERTY_EDITOR_TAB = 'SET_SELECTED_PROPERTY_EDITOR_TAB',
    /** models that should get changed on the graph */
    GRAPH_SET_MODELS_TO_SYNC = 'GRAPH_SET_MODELS_TO_SYNC',
    /** clear out the models that need to be reflected on the graph */
    GRAPH_CLEAR_MODELS_TO_SYNC = 'GRAPH_CLEAR_MODELS_TO_SYNC',
    SET_OAT_MODIFIED = 'SET_OAT_MODIFIED',
    SET_OAT_SELECTED_MODEL = 'SET_OAT_SELECTED_MODEL',
    SET_OAT_TEMPLATES_ACTIVE = 'SET_OAT_TEMPLATES_ACTIVE',
    DELETE_PROJECT = 'SET_OAT_DELETE_PROJECT',
    SET_OAT_ERROR = 'SET_OAT_ERROR',
    SET_OAT_IS_JSON_UPLOADER_OPEN = 'SET_OAT_IS_JSON_UPLOADER_OPEN'
}

/** The actions to update the state */
export type OatPageContextAction =
    | {
          type: OatPageContextActionType.CREATE_PROJECT;
          payload: { name: string; namespace: string };
      }
    | {
          type: OatPageContextActionType.EDIT_PROJECT;
          payload: { name: string; namespace: string };
      }
    | {
          type: OatPageContextActionType.DUPLICATE_PROJECT;
      }
    | {
          type: OatPageContextActionType.DELETE_PROJECT;
          payload: { id: string };
      }
    | {
          type: OatPageContextActionType.SWITCH_CURRENT_PROJECT;
          payload: {
              projectId: string;
          };
      }
    | {
          type: OatPageContextActionType.SET_CURRENT_MODELS;
          payload: {
              models: DtdlInterface[];
          };
      }
    | {
          type: OatPageContextActionType.DELETE_MODEL;
          payload: {
              id: string;
          };
      }
    | {
          type: OatPageContextActionType.DELETE_REFERENCE;
          payload: {
              modelId: string;
              referenceType: OatGraphReferenceType;
              nameOrTarget: string;
          };
      }
    | {
          type: OatPageContextActionType.GENERAL_UNDO;
          payload: {
              models: DtdlInterface[];
              positions: IOATModelPosition[];
              selection: IOATSelection;
          };
      }
    | {
          type: OatPageContextActionType.SET_CURRENT_MODELS_METADATA;
          payload: {
              metadata: IOATModelsMetadata[];
          };
      }
    | {
          type: OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS;
          payload: {
              positions: IOATModelPosition[];
          };
      }
    | {
          type: OatPageContextActionType.SET_CURRENT_NAMESPACE;
          payload: {
              namespace: string;
          };
      }
    | {
          type: OatPageContextActionType.SET_CURRENT_PROJECT_NAME;
          payload: {
              name: string;
          };
      }
    | {
          type: OatPageContextActionType.SET_CURRENT_PROJECT;
          payload: IOatProjectData;
      }
    | {
          type: OatPageContextActionType.CLEAR_GRAPH_LAYOUT;
      }
    | {
          type: OatPageContextActionType.GRAPH_SET_MODELS_TO_SYNC;
          payload: GraphUpdatePayload;
      }
    | {
          type: OatPageContextActionType.GRAPH_CLEAR_MODELS_TO_SYNC;
      }
    | {
          type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN;
          payload: IOATConfirmDelete;
      }
    | {
          type: OatPageContextActionType.SET_OAT_ERROR;
          payload: IOATError;
      }
    | {
          type: OatPageContextActionType.IMPORT_MODELS;
          payload: {
              models: DtdlInterface[];
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_IS_JSON_UPLOADER_OPEN;
          payload: {
              isOpen: boolean;
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_MODIFIED;
          payload: {
              isModified: boolean;
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_SELECTED_MODEL;
          payload: {
              selection: IOATSelection;
          };
      }
    | {
          type: OatPageContextActionType.SET_CURRENT_TEMPLATES;
          payload: {
              templates: DTDLProperty[];
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_TEMPLATES_ACTIVE;
          payload: {
              isActive: boolean;
          };
      }
    | {
          type: OatPageContextActionType.UPDATE_MODEL_ID;
          payload: {
              existingId: string;
              newId: string;
          };
      }
    | {
          type: OatPageContextActionType.UPDATE_MODEL;
          payload: {
              model: DtdlInterface;
          };
      }
    | {
          type: OatPageContextActionType.UPDATE_REFERENCE;
          payload: {
              modelId: string;
              reference: DtdlInterfaceContent;
          };
      }
    | {
          type: OatPageContextActionType.ADD_NEW_MODEL;
          payload?: {
              position: IOATNodePosition;
          };
      }
    | {
          type: OatPageContextActionType.ADD_NEW_RELATIONSHIP;
          payload:
              | {
                    type: 'Targeted';
                    sourceModelId: string;
                    targetModelId: string;
                    relationshipType: OatReferenceType;
                }
              | {
                    type: 'Untargeted';
                    sourceModelId: string;
                    position: IOATNodePosition;
                };
      }
    | {
          type: OatPageContextActionType.ADD_NEW_MODEL_WITH_RELATIONSHIP;
          payload: {
              position: IOATNodePosition;
              sourceModelId: string;
              relationshipType: OatReferenceType;
          };
      }
    | {
          type: OatPageContextActionType.UPDATE_MODEL_POSTIONS;
          payload: { models: IOATModelPosition[] };
      }
    | {
          type: OatPageContextActionType.SET_SELECTED_PROPERTY_EDITOR_TAB;
          payload: {
              selectedTabKey: IOatPropertyEditorTabKey;
          };
      };
