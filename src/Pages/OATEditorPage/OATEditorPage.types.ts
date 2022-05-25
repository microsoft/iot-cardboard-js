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

export interface IOATEditorState {
    model?: IOATTwinModelNodes;
    elements?: any[];
    deletedModelId?: string;
    selectedModelId?: string;
    editedModelName?: string;
    editedModelId?: string;
    templatesActive?: boolean;
    importModels?: [];
    isJsonUploaderOpen?: boolean;
    templates?: DTDLProperty[];
    error?: IOATError;
}
