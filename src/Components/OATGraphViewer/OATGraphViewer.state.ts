import produce from 'immer';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    SET_OAT_SELECTED_MODEL,
    SET_OAT_MODELS,
    SET_OAT_TEMPLATES_ACTIVE,
    SET_OAT_IMPORT_MODELS,
    SET_OAT_IS_JSON_UPLOADER_OPEN,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';

export const OATGraphViewerReducer = produce(
    (state: IOATEditorState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_OAT_SELECTED_MODEL:
                state.model = payload;
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
        }
    }
);
