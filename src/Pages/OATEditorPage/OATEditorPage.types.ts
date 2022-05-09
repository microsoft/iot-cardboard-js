import { IOATTwinModelNodes } from '../../Models/Constants/Interfaces';

export interface IOATEditorState {
    model?: IOATTwinModelNodes;
    elementHandler?: any[];
    deletedModelId?: string;
    selectedModelId?: string;
    editedModelName?: string;
    editedModelId?: string;
    templatesActive?: boolean;
    importModels?: [];
    isJsonUploaderOpen?: boolean;
}
