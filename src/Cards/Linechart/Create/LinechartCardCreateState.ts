import { Action } from '../../../Models/Constants/Interfaces';
import update from 'immutability-helper';
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

export const LinechartCardCreateReducer = (
    state: LinechartCardCreateState,
    action: Action
) => {
    const payload = action.payload;
    if (typeof state === 'undefined' || state === null) {
        return defaultLinechartCardCreateState;
    }

    switch (action.type) {
        case SET_SELECTED_PROPERTIES:
            return update(state, { selectedPropertyNames: { $set: payload } });
        case SET_CHART_PROPERTIES:
            return update(state, { chartPropertyNames: { $set: payload } });
        case SET_TITLE:
            return update(state, { title: { $set: payload } });
        default:
            return state;
    }
};
