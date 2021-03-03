import produce from 'immer';
import { useReducer } from 'react';
import AdapterResult from '../Classes/AdapterResult';
import { SET_ADAPTER_RESULT, SET_IS_LOADING } from '../Constants/ActionTypes';
import { Action } from '../Constants/Interfaces';
import { CardState } from '../Constants/Types';

const defaultCardState: CardState = {
    adapterResult: null,
    isLoading: false
};

const cardStateReducer = produce((draft: CardState, action: Action) => {
    const payload = action.payload;
    switch (action.type) {
        case SET_IS_LOADING:
            draft.isLoading = payload;
            return;
        case SET_ADAPTER_RESULT:
            draft.adapterResult = payload;
            return;
        default:
            return;
    }
}, defaultCardState);

const useCardState = () => {
    const [state, dispatch] = useReducer(cardStateReducer, defaultCardState);

    // Helper methods which wrap dispatch logic
    const setIsLoading = (isLoading: boolean) => {
        dispatch({ type: SET_IS_LOADING, payload: isLoading });
    };

    const setAdapterResult = (adapterResult: AdapterResult<any>) => {
        dispatch({ type: SET_ADAPTER_RESULT, payload: adapterResult });
    };

    return {
        ...state,
        dispatch,
        setIsLoading,
        setAdapterResult
    };
};

export default useCardState;
