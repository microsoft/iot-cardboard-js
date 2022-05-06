import { IAction } from '../../Models/Constants/Interfaces';
import produce from 'immer';
import // SET_ADT_HIERARCHY_NODES,
// SET_ADT_HIERARCHY_NODE_PROPERTIES,
// SET_ADT_HIERARCHY_SEARCH,
// SET_ADT_HIERARCHY_SELECTED_TWIN_ID,
// SET_TWIN_LOOKUP_STATUS
'../../Models/Constants/ActionTypes';
import { ADTHierarchyCardConsumeState } from './ADTHierarchyCard.types';
import { TwinLookupStatus } from '../../Models/Constants';
import { UPDATE_MODEL, UPDATE_TEMPLATES } from './Actions';

export const defaultOATEditorState = {
    templates: null
};

// Using immer immutability helper: https://github.com/immerjs/immer
export const OATEditorPageReducer = (state, action) => {
    console.log('STATE: ', state);
    const payload = action.payload;

    switch (action.type) {
        case UPDATE_MODEL:
            return { ...state, action };
        case UPDATE_TEMPLATES:
            console.log('UPDATE_TEMPLATES', payload);
            return { ...state, templates: payload };
    }
};
