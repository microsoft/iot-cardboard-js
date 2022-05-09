import produce, { setAutoFreeze } from 'immer';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from './OATEditorPage.types';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_ELEMENTS_HANDLER,
    SET_OAT_SELECTED_MODEL_ID,
    SET_OAT_DELETED_MODEL_ID,
    SET_OAT_EDITED_MODEL_NAME,
    SET_OAT_EDITED_MODEL_ID,
    SET_OAT_TEMPLATES_ACTIVE,
    SET_OAT_IMPORT_MODELS,
    SET_OAT_IS_JSON_UPLOADER_OPEN
} from '../../Models/Constants/ActionTypes';
setAutoFreeze(false);

export const defaultOATEditorState: IOATEditorState = {
    model: null,
    elementHandler: [],
    deletedModelId: '',
    selectedModelId: '',
    editedModelName: '',
    editedModelId: '',
    templatesActive: false,
    importModels: [],
    isJsonUploaderOpen: false
};

export const OATEditorPageReducer = produce((state, action: IAction) => {
    const payload = action.payload;

    switch (action.type) {
        case SET_OAT_PROPERTY_EDITOR_MODEL:
            return { ...state, model: payload };
        case SET_OAT_ELEMENTS_HANDLER:
            return { ...state, elementHandler: payload };
        case SET_OAT_DELETED_MODEL_ID:
            return { ...state, deletedModelId: payload };
        case SET_OAT_SELECTED_MODEL_ID:
            return { ...state, selectedModelId: payload };
        case SET_OAT_EDITED_MODEL_NAME:
            return { ...state, editedModelName: payload };
        case SET_OAT_EDITED_MODEL_ID:
            return { ...state, editedModelId: payload };
        case SET_OAT_TEMPLATES_ACTIVE:
            return { ...state, templatesActive: payload };
        case SET_OAT_IMPORT_MODELS:
            return { ...state, importModels: payload };
        case SET_OAT_IS_JSON_UPLOADER_OPEN:
            return { ...state, isJsonUploaderOpen: payload };
    }
});
