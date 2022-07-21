import { IOATNodePosition } from '../../Models/Constants';
import {
    DtdlInterface,
    DtdlProperty
} from '../../Models/Constants/dtdlInterfaces';

export interface IOATError {
    callback?: () => void;
    message?: string;
    title?: string;
    type?: string;
}

export interface IOATConfirmDelete {
    open: boolean;
    callback?: () => void;
}

export interface IOATModelPosition {
    '@id': string;
    position: IOATNodePosition;
}

export interface IOATModelsMetadata {
    '@id': string;
    fileName?: string;
    directoryPath?: string;
}

export interface IOATSelection {
    modelId: string;
    contentId?: string;
}

export interface IOATEditorState {
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
