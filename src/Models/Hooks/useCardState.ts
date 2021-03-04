import produce from 'immer';
import { useReducer } from 'react';
import AdapterResult from '../Classes/AdapterResult';
import { SET_ADAPTER_RESULT, SET_IS_LOADING } from '../Constants/ActionTypes';
import { Action, IAdapterData } from '../Constants/Interfaces';
import { CardState } from '../Constants/Types';

// Sets up reducer with 'curried producer' - https://immerjs.github.io/immer/docs/curried-produce
// Draft state can be directly modified.  Draft does not need to be explicitly returned.
const cardStateReducer = produce(
    <T extends IAdapterData>(draft: CardState<T>, action: Action) => {
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
    }
);

// Hook which accepts generic IAdapterData type and exposes card state
const useCardState = <T extends IAdapterData>() => {
    const defaultCardState: CardState<T> = {
        adapterResult: new AdapterResult<any>({ result: null, error: null }),
        isLoading: false
    };

    const [state, dispatch] = useReducer(cardStateReducer, defaultCardState);

    // Helper methods which wrap dispatch logic
    const setIsLoading = (isLoading: boolean) => {
        dispatch({ type: SET_IS_LOADING, payload: isLoading });
    };

    const setAdapterResult = (adapterResult: AdapterResult<T>) => {
        if (!adapterResult) {
            adapterResult = new AdapterResult<any>({
                result: null,
                error: null
            });
        }
        dispatch({ type: SET_ADAPTER_RESULT, payload: adapterResult });
    };

    // State is spread onto the object returned by the hook allowing for direct state access.
    // such as --> cardState.isLoading
    return {
        ...state,
        dispatch,
        setIsLoading,
        setAdapterResult
    };
};

export default useCardState;
