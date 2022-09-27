import {
    ADT3DScenePageModes,
    DtdlInterface,
    DtdlProperty
} from '../../Constants';
import queryString from 'query-string';
import {
    IOATSelection,
    IOATError,
    IOATModelPosition,
    IOATConfirmDelete,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';

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
    adtUrl: string;
    selection?: IOATSelection;
    models?: DtdlInterface[];
    templatesActive?: boolean;
    importModels?: [];
    isJsonUploaderOpen?: boolean;
    templates?: DtdlProperty[];
    projectName?: string;
    modified?: boolean;
    error?: IOATError;
    modelPositions: IOATModelPosition[];
    namespace?: string;
    confirmDeleteOpen?: IOATConfirmDelete;
    modelsMetadata?: IOATModelsMetadata[];
}

/**
 * The actions to update the state
 */
export enum OatPageContextActionType {
    SET_ADT_URL = 'SET_ADT_URL'
}

/** The actions to update the state */
export type OatPageContextAction = {
    type: OatPageContextActionType.SET_ADT_URL;
    payload: { url: string };
};
