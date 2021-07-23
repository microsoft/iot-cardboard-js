import { IAction } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_ADT_HIERARCHY_NODES,
    SET_ADT_HIERARCHY_NODE_PROPERTIES,
    SET_ADT_HIERARCHY_SEARCH
} from '../../../Models/Constants/ActionTypes';
import { ADTModelListCardConsumeState } from './ADTModelListCard.types';

export const defaultADTModelListCardState: ADTModelListCardConsumeState = {
    nodes: {},
    selectedModelId: null,
    searchTerm: ''
};

export const ADTModelListCardConsumeReducer = produce(
    (draft: ADTModelListCardConsumeState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_ADT_HIERARCHY_NODES:
                draft.nodes = payload;
                break;
            case SET_ADT_HIERARCHY_NODE_PROPERTIES:
                if (payload.modelId && draft.nodes[payload.modelId]) {
                    Object.keys(payload.properties).forEach((propKey) => {
                        if (propKey === 'isSelected' && draft.selectedModelId) {
                            draft.nodes[
                                draft.selectedModelId
                            ].isSelected = false;
                        }
                        draft.selectedModelId = payload.modelId;
                        draft.nodes[payload.modelId][propKey] =
                            payload.properties[propKey];
                    });
                }
                break;
            case SET_ADT_HIERARCHY_SEARCH:
                draft.searchTerm = payload;
                draft.nodes = {};
                break;
        }
    },
    defaultADTModelListCardState
);
