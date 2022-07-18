import produce from 'immer';
import { IAction } from '../../Models/Constants/Interfaces';
import {
    SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
    SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
    SET_OAT_PROPERTY_EDITOR_DRAGGING_TEMPLATE,
    SET_OAT_PROPERTY_EDITOR_DRAGGING_PROPERTY,
    SET_OAT_PROPERTY_MODAL_OPEN,
    SET_OAT_PROPERTY_MODAL_BODY
} from '../../Models/Constants/ActionTypes';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';

export const defaultOATPropertyEditorState: IOATPropertyEditorState = {
    currentPropertyIndex: null,
    currentNestedPropertyIndex: null,
    draggingTemplate: false,
    draggingProperty: false,
    modalOpen: false,
    modalBody: null
};

export const OATPropertyEditorReducer = produce(
    (state: IOATPropertyEditorState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX:
                state.currentPropertyIndex = payload;
                return;
            case SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX:
                state.currentNestedPropertyIndex = payload;
                return;
            case SET_OAT_PROPERTY_EDITOR_DRAGGING_TEMPLATE:
                state.draggingTemplate = payload;
                return;
            case SET_OAT_PROPERTY_EDITOR_DRAGGING_PROPERTY:
                state.draggingProperty = payload;
                return;
            case SET_OAT_PROPERTY_MODAL_OPEN:
                state.modalOpen = payload;
                return;
            case SET_OAT_PROPERTY_MODAL_BODY:
                state.modalBody = payload;
                return;
        }
    }
);
