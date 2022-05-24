import {
    DTDLProperty,
    IOATTwinModelNodes
} from '../../Models/Constants/Interfaces';
import { ProjectData } from './Internal/Classes';

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
    project?: ProjectData;
}
