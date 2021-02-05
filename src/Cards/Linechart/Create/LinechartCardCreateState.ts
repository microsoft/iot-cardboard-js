import { Action } from '../../../Constants/Interfaces';
import update from 'immutability-helper';
import {
    SET_CHART_PROPERTIES,
    SET_SELECTED_PROPERTIES
} from '../../../Constants/ActionTypes';
import { LinechartCardCreateState } from './LinechartCardCreate.types';

export const defaultLinechartCardCreateState: LinechartCardCreateState = {
    selectedPropertyNames: [],
    chartPropertyNames: []
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
        default:
            return state;
    }
};
