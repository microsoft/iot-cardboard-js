import { IAction } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_ADT_HIERARCHY_NODES,
    SET_ADT_HIERARCHY_NODE_PROPERTIES,
    SET_ADT_HIERARCHY_SEARCH,
    SET_ADT_HIERARCHY_SELECTED_TWIN_ID
} from '../../../Models/Constants/ActionTypes';
import { ADTHierarchyCardConsumeState } from './ADTHierarchyCard.types';

export const defaultADTHierarchyCardConsumeState: ADTHierarchyCardConsumeState = {
    hierarchyNodes: {},
    searchTerm: ''
};

// Using immer immutability helper: https://github.com/immerjs/immer
export const ADTHierarchyCardConsumeReducer = produce(
    (draft: ADTHierarchyCardConsumeState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_ADT_HIERARCHY_NODES:
                draft.hierarchyNodes = payload;
                break;
            case SET_ADT_HIERARCHY_NODE_PROPERTIES:
                if (payload.modelId && payload.twinId) {
                    Object.keys(payload.properties).forEach((propKey) => {
                        draft.hierarchyNodes[payload.modelId].children[
                            payload.twinId
                        ][propKey] = payload.properties[propKey];
                    });
                } else if (payload.modelId) {
                    Object.keys(payload.properties).forEach((propKey) => {
                        draft.hierarchyNodes[payload.modelId][propKey] =
                            payload.properties[propKey];
                    });
                }
                break;
            case SET_ADT_HIERARCHY_SELECTED_TWIN_ID:
                if (
                    payload.previouslySelectedTwin.modelId &&
                    payload.previouslySelectedTwin.twinId
                ) {
                    draft.hierarchyNodes[
                        payload.previouslySelectedTwin.modelId
                    ].children[
                        payload.previouslySelectedTwin.twinId
                    ].isSelected = false;
                }
                draft.hierarchyNodes[payload.modelId].children[
                    payload.twinId
                ].isSelected = true;
                break;
            case SET_ADT_HIERARCHY_SEARCH:
                draft.searchTerm = payload;
                draft.hierarchyNodes = {};
                break;
        }
    },
    defaultADTHierarchyCardConsumeState
);
