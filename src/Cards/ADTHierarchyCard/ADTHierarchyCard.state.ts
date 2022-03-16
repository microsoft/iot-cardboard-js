import { IAction } from '../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_ADT_HIERARCHY_NODES,
    SET_ADT_HIERARCHY_NODE_PROPERTIES,
    SET_ADT_HIERARCHY_SEARCH,
    SET_ADT_HIERARCHY_SELECTED_TWIN_ID,
    SET_TWIN_LOOKUP_STATUS,
} from '../../Models/Constants/ActionTypes';
import { ADTHierarchyCardConsumeState } from './ADTHierarchyCard.types';
import { TwinLookupStatus } from '../../Models/Constants';

export const defaultADTHierarchyCardConsumeState: ADTHierarchyCardConsumeState = {
    hierarchyNodes: {},
    searchTerm: '',
    selectedTwin: null,
    twinLookupStatus: TwinLookupStatus.Idle,
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
                if (
                    payload.modelId &&
                    payload.twinId &&
                    draft.hierarchyNodes[payload.modelId].children[
                        payload.twinId
                    ]
                ) {
                    Object.keys(payload.properties).forEach((propKey) => {
                        draft.hierarchyNodes[payload.modelId].children[
                            payload.twinId
                        ][propKey] = payload.properties[propKey];
                    });
                } else if (
                    payload.modelId &&
                    draft.hierarchyNodes[payload.modelId]
                ) {
                    Object.keys(payload.properties).forEach((propKey) => {
                        draft.hierarchyNodes[payload.modelId][propKey] =
                            payload.properties[propKey];
                    });
                }
                break;
            case SET_ADT_HIERARCHY_SELECTED_TWIN_ID:
                if (draft.selectedTwin?.modelId && draft.selectedTwin?.twinId) {
                    draft.hierarchyNodes[draft.selectedTwin.modelId].children[
                        draft.selectedTwin.twinId
                    ].isSelected = false;
                } else if (draft.selectedTwin?.twinId) {
                    draft.hierarchyNodes[
                        draft.selectedTwin.twinId
                    ].isSelected = false;
                }

                if (payload?.modelId && payload?.twinId) {
                    draft.hierarchyNodes[payload.modelId].children[
                        payload.twinId
                    ].isSelected = true;

                    draft.selectedTwin = {
                        modelId: payload.modelId,
                        twinId: payload.twinId,
                    };
                } else if (payload?.twinId) {
                    draft.hierarchyNodes[payload.twinId].isSelected = true;

                    draft.selectedTwin = {
                        modelId: undefined,
                        twinId: payload.twinId,
                    };
                } else {
                    draft.selectedTwin = null;
                }

                break;
            case SET_ADT_HIERARCHY_SEARCH:
                draft.searchTerm = payload;
                draft.hierarchyNodes = {};
                draft.selectedTwin = null;
                break;
            case SET_TWIN_LOOKUP_STATUS:
                draft.twinLookupStatus = payload;
                break;
        }
    },
    defaultADTHierarchyCardConsumeState,
);
