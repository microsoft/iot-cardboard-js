import {
    DTDLProperty,
    IOATTwinModelNodes
} from '../../Models/Constants/Interfaces';
import { ProjectData } from './Internal/Classes';

export interface IOATError {
    callback?: () => void;
    message?: string;
    title?: string;
    type?: string;
}

export interface IOATEditorState {
    model?: IOATTwinModelNodes;
    models?: any[];
    deletedModelId?: string;
    selectedModelId?: string;
    editedModelName?: string;
    editedModelId?: string;
    templatesActive?: boolean;
    importModels?: [];
    isJsonUploaderOpen?: boolean;
    templates?: DTDLProperty[];
    projectName?: string;
    error?: IOATError;
    modelPositions: any;
}
