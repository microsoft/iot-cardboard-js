import produce from 'immer';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from './OATEditorPage.types';
import {
    getStoredEditorModelMetadata,
    getStoredEditorModelPositionsData,
    getStoredEditorModelsData,
    getStoredEditorNamespaceData,
    getStoredEditorTemplateData
} from '../../Models/Services/OatUtils';

export const defaultOATEditorState: IOATEditorState = {
    selection: null,
    models: getStoredEditorModelsData(),
    templatesActive: false,
    importModels: [],
    isJsonUploaderOpen: false,
    templates: getStoredEditorTemplateData(),
    modelPositions: getStoredEditorModelPositionsData(),
    projectName: null,
    modified: false,
    error: null,
    namespace: getStoredEditorNamespaceData(),
    confirmDeleteOpen: { open: false },
    modelsMetadata: getStoredEditorModelMetadata()
};

export const OATEditorPageReducer = produce(
    (state: IOATEditorState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_OAT_SELECTED_MODEL:
                state.selection = payload;
                return;
            case SET_OAT_MODELS:
                state.models = payload;
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
            case SET_OAT_MODIFIED:
                state.modified = payload;
                return;
            case SET_OAT_PROJECT:
                state.projectName = payload.projectName;
                state.models = payload.models;
                state.modelPositions = payload.modelPositions;
                state.templates = payload.templates;
                state.namespace = payload.namespace;
                state.modelsMetadata = payload.modelsMetadata;
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
            case SET_OAT_NAMESPACE:
                state.namespace = payload;
                return;
            case SET_OAT_CONFIRM_DELETE_OPEN:
                state.confirmDeleteOpen = payload;
                return;
            case SET_OAT_MODELS_METADATA:
                state.modelsMetadata = payload;
                return;
        }
    }
);
