import {
    DTDLProperty,
    IOATTwinModelNodes
} from '../../Models/Constants/Interfaces';

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
export interface IModelsMetadata {
    '@id': string;
    fileName?: string;
    directoryPath?: string;
}

export interface IOATEditorState {
    model?: IOATTwinModelNodes;
    models?: any[];
    templatesActive?: boolean;
    importModels?: [];
    isJsonUploaderOpen?: boolean;
    templates?: DTDLProperty[];
    projectName?: string;
    modified?: boolean;
    error?: IOATError;
    modelPositions: any;
    namespace?: string;
    confirmDeleteOpen?: IOATConfirmDelete;
    modelsMetadata?: IModelsMetadata[];
}
