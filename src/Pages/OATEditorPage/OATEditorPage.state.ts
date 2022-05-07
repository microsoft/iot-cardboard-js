import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from './OATEditorPage.types';
import { UPDATE_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';

export const defaultOATEditorState: IOATEditorState = {
    model: null
};

export const OATEditorPageReducer = (
    state: IOATEditorState,
    action: IAction
) => {
    const payload = action.payload;

    switch (action.type) {
        case UPDATE_OAT_PROPERTY_EDITOR_MODEL:
            return { ...state, model: payload };
    }
};
