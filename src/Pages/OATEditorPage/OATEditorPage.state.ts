import produce from 'immer';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from './OATEditorPage.types';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_ELEMENTS,
    SET_OAT_SELECTED_MODEL_ID,
    SET_OAT_DELETED_MODEL_ID,
    SET_OAT_EDITED_MODEL_NAME,
    SET_OAT_EDITED_MODEL_ID,
    SET_OAT_TEMPLATES_ACTIVE,
    SET_OAT_IMPORT_MODELS,
    SET_OAT_IS_JSON_UPLOADER_OPEN,
    SET_OAT_TEMPLATES,
    SET_OAT_PROJECT
} from '../../Models/Constants/ActionTypes';

export const defaultOATEditorState: IOATEditorState = {
    model: null,
    elements: [],
    deletedModelId: '',
    selectedModelId: '',
    editedModelName: '',
    editedModelId: '',
    templatesActive: false,
    importModels: [],
    isJsonUploaderOpen: false,
    templates: null,
    project: null
};

export const OATEditorPageReducer = produce(
    (state: IOATEditorState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_OAT_PROPERTY_EDITOR_MODEL:
                state.model = payload;
                return;
            case SET_OAT_ELEMENTS:
                state.elements = payload;
                return;
            case SET_OAT_DELETED_MODEL_ID:
                state.deletedModelId = payload;
                return;
            case SET_OAT_SELECTED_MODEL_ID:
                state.selectedModelId = payload;
                return;
            case SET_OAT_EDITED_MODEL_NAME:
                state.editedModelName = payload;
                return;
            case SET_OAT_EDITED_MODEL_ID:
                state.editedModelId = payload;
                return;
            case SET_OAT_TEMPLATES_ACTIVE:
                state.templatesActive = payload;
                return;
            case SET_OAT_IMPORT_MODELS:
                state.importModels = payload;
                return;
            case SET_OAT_IS_JSON_UPLOADER_OPEN:
                state.isJsonUploaderOpen = payload;
                return;
            case SET_OAT_TEMPLATES:
                state.templates = payload;
                return;
            case SET_OAT_PROJECT:
                state.project = payload;
                return;
        }
    }
);
