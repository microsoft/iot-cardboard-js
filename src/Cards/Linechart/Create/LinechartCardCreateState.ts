import { Action } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_CHART_PROPERTIES,
    SET_SELECTED_PROPERTIES,
    SET_TITLE
} from '../../../Models/Constants/ActionTypes';
import { LinechartCardCreateState } from './LinechartCardCreate.types';

export const defaultLinechartCardCreateState: LinechartCardCreateState = {
    selectedPropertyNames: [],
    chartPropertyNames: [],
    title: ''
};

// Using immer immutability helper: https://github.com/immerjs/immer
export const LinechartCardCreateReducer = produce(
    (draft: LinechartCardCreateState, action: Action) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_SELECTED_PROPERTIES:
                draft.selectedPropertyNames = payload;
                return;
            case SET_CHART_PROPERTIES:
                draft.chartPropertyNames = payload;
                return;
            case SET_TITLE:
                draft.title = payload;
                return;
            default:
                return;
        }
    },
    defaultLinechartCardCreateState
);
