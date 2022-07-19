import {
    IOATNodeElement,
    IOATNodePosition,
    IOATRelationshipElement
} from '../../Models/Constants';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlProperty,
    DtdlRelationship
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

export interface IModelPosition {
    '@id': string;
    position: IOATNodePosition;
}

export interface IModelsMetadata {
    '@id': string;
    fileName?: string;
    directoryPath?: string;
}

export interface IOATEditorState {
    model?: DtdlInterface | DtdlRelationship | DtdlInterfaceContent;
    models?: DtdlInterface[];
    templatesActive?: boolean;
    importModels?: [];
    isJsonUploaderOpen?: boolean;
    templates?: DtdlProperty[];
    projectName?: string;
    modified?: boolean;
    error?: IOATError;
    modelPositions: IModelPosition[];
    namespace?: string;
    confirmDeleteOpen?: IOATConfirmDelete;
    modelsMetadata?: IModelsMetadata[];
}
