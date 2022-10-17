import { DtdlInterface, DtdlInterfaceContent } from '../../Constants';
import {
    IOATSelection,
    IOATError,
    IOATModelPosition,
    IOATConfirmDelete,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLProperty } from '../../Classes/DTDL';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';

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
    error?: IOATError;
    modelsToImport?: any[];
    modelsToAdd: DtdlInterface[];
    isJsonUploaderOpen?: boolean;
    modified?: boolean;
    ontologyFiles: IOATFile[];
    selectedModelTarget: DtdlInterface | DtdlInterfaceContent;
    selection?: IOATSelection;
    templatesActive?: boolean;
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
    DUPLICATE_PROJECT = 'DUPLICATE_PROJECT',
    SWITCH_CURRENT_PROJECT = 'SWITCH_PROJECT',
    SET_CURRENT_MODELS = 'SET_CURRENT_MODELS',
    SET_CURRENT_MODELS_METADATA = 'SET_CURRENT_MODELS_METADATA',
    SET_CURRENT_MODELS_POSITIONS = 'SET_CURRENT_MODELS_POSITIONS',
    SET_CURRENT_NAMESPACE = 'SET_CURRENT_NAMESPACE',
    SET_CURRENT_PROJECT_NAME = 'SET_CURRENT_PROJECT_NAME',
    SET_CURRENT_TEMPLATES = 'SET_CURRENT_TEMPLATES',

    SET_CURRENT_PROJECT = 'SET_OAT_PROJECT',
    /** models that should get added to the graph */
    SET_OAT_MODELS_TO_ADD = 'SET_OAT__MODELS_TO_ADD',
    /** clear out the models that were added to the graph */
    CLEAR_OAT_MODELS_TO_ADD = 'CLEAR_OAT__MODELS_TO_ADD',
    SET_OAT_MODIFIED = 'SET_OAT_MODIFIED',
    SET_OAT_SELECTED_MODEL = 'SET_OAT_SELECTED_MODEL',
    SET_OAT_TEMPLATES_ACTIVE = 'SET_OAT_TEMPLATES_ACTIVE',
    SET_OAT_DELETE_PROJECT = 'SET_OAT_DELETE_PROJECT',
    SET_OAT_ERROR = 'SET_OAT_ERROR',
    SET_OAT_IMPORT_MODELS = 'SET_OAT_IMPORT_MODELS',
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
          type: OatPageContextActionType.SET_OAT_DELETE_PROJECT;
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
          payload: ProjectData;
      }
    | {
          type: OatPageContextActionType.SET_OAT_MODELS_TO_ADD;
          payload: {
              models: DtdlInterface[];
          };
      }
    | {
          type: OatPageContextActionType.CLEAR_OAT_MODELS_TO_ADD;
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
          type: OatPageContextActionType.SET_OAT_IMPORT_MODELS;
          payload: {
              models: any[];
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
      };