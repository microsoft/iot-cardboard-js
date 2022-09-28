import { DtdlInterface, DtdlInterfaceContent } from '../../Constants';
import {
    IOATSelection,
    IOATError,
    IOATModelPosition,
    IOATConfirmDelete,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLProperty } from '../../Classes/DTDL';

export interface IOatPageContextProviderProps {
    initialState?: Partial<IOatPageContextState>;
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
    error?: IOATError;
    importModels?: any[];
    isJsonUploaderOpen?: boolean;
    modelPositions: IOATModelPosition[];
    models?: DtdlInterface[];
    modelsMetadata?: IOATModelsMetadata[];
    modified?: boolean;
    namespace?: string;
    projectName?: string;
    selection?: IOATSelection;
    selectedModelTarget: DtdlInterface | DtdlInterfaceContent;
    templates?: DTDLProperty[];
    templatesActive?: boolean;
}

/**
 * The actions to update the state
 */
export enum OatPageContextActionType {
    SET_OAT_CONFIRM_DELETE_OPEN = 'SET_OAT_CONFIRM_DELETE_OPEN',
    SET_OAT_ERROR = 'SET_OAT_ERROR',
    SET_OAT_IMPORT_MODELS = 'SET_OAT_IMPORT_MODELS',
    SET_OAT_IS_JSON_UPLOADER_OPEN = 'SET_OAT_IS_JSON_UPLOADER_OPEN',
    SET_OAT_MODELS = 'SET_OAT_MODELS',
    SET_OAT_MODELS_METADATA = 'SET_OAT_MODELS_METADATA',
    SET_OAT_MODELS_POSITIONS = 'SET_OAT_MODELS_POSITIONS',
    SET_OAT_MODIFIED = 'SET_OAT_MODIFIED',
    SET_OAT_NAMESPACE = 'SET_OAT_NAMESPACE',
    SET_OAT_PROJECT = 'SET_OAT_PROJECT',
    SET_OAT_PROJECT_NAME = 'SET_OAT_PROJECT_NAME',
    SET_OAT_SELECTED_MODEL = 'SET_OAT_SELECTED_MODEL',
    SET_OAT_TEMPLATES = 'SET_OAT_TEMPLATES',
    SET_OAT_TEMPLATES_ACTIVE = 'SET_OAT_TEMPLATES_ACTIVE'
}

/** The actions to update the state */
export type OatPageContextAction =
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
          type: OatPageContextActionType.SET_OAT_MODELS;
          payload: {
              models: DtdlInterface[];
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_MODELS_METADATA;
          payload: {
              metadata: IOATModelsMetadata[];
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_MODELS_POSITIONS;
          payload: {
              positions: IOATModelPosition[];
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_MODIFIED;
          payload: {
              isModified: boolean;
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_NAMESPACE;
          payload: {
              namespace: string;
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_PROJECT;
          payload: {
              projectName: string;
              models: DtdlInterface[];
              modelsMetadata: IOATModelsMetadata[];
              modelPositions: IOATModelPosition[];
              templates: DTDLProperty[];
              namespace: string;
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_PROJECT_NAME;
          payload: {
              name: string;
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_SELECTED_MODEL;
          payload: {
              selection: IOATSelection;
          };
      }
    | {
          type: OatPageContextActionType.SET_OAT_TEMPLATES;
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
