import produce from 'immer';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from './OATEditorPage.types';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_MODELS,
    SET_OAT_SELECTED_MODEL_ID,
    SET_OAT_DELETED_MODEL_ID,
    SET_OAT_EDITED_MODEL_NAME,
    SET_OAT_EDITED_MODEL_ID,
    SET_OAT_TEMPLATES_ACTIVE,
    SET_OAT_IMPORT_MODELS,
    SET_OAT_IS_JSON_UPLOADER_OPEN,
    SET_OAT_TEMPLATES,
    SET_OAT_PROJECT,
    SET_OAT_PROJECT_NAME,
    SET_OAT_ERROR,
    SET_OAT_MODELS_POSITIONS
} from '../../Models/Constants/ActionTypes';
import {
    getStoredEditorModelPositionsData,
    getStoredEditorModelsData,
    getStoredEditorTemplateData
} from '../../Models/Services/Utils';

export const defaultOATEditorState: IOATEditorState = {
    model: null,
    models: getStoredEditorModelsData(),
    deletedModelId: '',
    selectedModelId: '',
    editedModelName: '',
    editedModelId: '',
    templatesActive: false,
    importModels: [],
    isJsonUploaderOpen: false,
    templates: getStoredEditorTemplateData(),
    modelPositions: getStoredEditorModelPositionsData(),
    projectName: null,
    error: null
};

export const OATEditorPageReducer = produce(
    (state: IOATEditorState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_OAT_PROPERTY_EDITOR_MODEL:
                state.model = payload;
                return;
            case SET_OAT_MODELS:
                state.models = payload;
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
                state.projectName = payload.projectName;
                state.models = payload.models;
                state.modelPositions = payload.modelPositions;
                state.templates = payload.templates;
                return;
            case SET_OAT_PROJECT_NAME:
                state.projectName = payload;
                return;
            case SET_OAT_ERROR:
                state.error = payload;
                return;
            case SET_OAT_MODELS_POSITIONS:
                state.modelPositions = payload;
                return;
        }
    }
);
