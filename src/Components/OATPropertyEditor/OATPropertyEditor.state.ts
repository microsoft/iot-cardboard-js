import produce, { setAutoFreeze } from 'immer';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES_ACTIVE,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
setAutoFreeze(false);

export const defaultOATEditorState: IOATEditorState = {
    model: null,
    templatesActive: false,
    templates: null
};

export const OATPropertyEditorReducer = produce(
    (state: IOATEditorState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_OAT_PROPERTY_EDITOR_MODEL:
                return { ...state, model: payload };
            case SET_OAT_TEMPLATES_ACTIVE:
                return { ...state, templatesActive: payload };
            case SET_OAT_TEMPLATES:
                return { ...state, templates: payload };
        }
    }
);
