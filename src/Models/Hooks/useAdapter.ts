import produce from 'immer';
import { useEffect, useReducer } from 'react';
import AdapterResult from '../Classes/AdapterResult';
import { SET_ADAPTER_RESULT, SET_IS_LOADING } from '../Constants/ActionTypes';
import { Action, IAdapterData } from '../Constants/Interfaces';
import { AdapterReturnType, CardState } from '../Constants/Types';

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

type Params = {
    adapterMethod: () => AdapterReturnType<any>;
    refetchDependencies: any[];
};

// Hook which accepts generic IAdapterData type and exposes card state
const useAdapter = <T extends IAdapterData>({
    adapterMethod,
    refetchDependencies
}: Params) => {
    const defaultCardState: CardState<T> = {
        adapterResult: new AdapterResult<T>({ result: null, error: null }),
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

    const callAdapter = async () => {
        setIsLoading(true);
        const adapterResult = await adapterMethod();
        setIsLoading(false);
        setAdapterResult(adapterResult as AdapterResult<T>);
    };

    useEffect(() => {
        callAdapter();
    }, [...refetchDependencies]);

    return {
        isLoading: state.isLoading,
        adapterResult: state.adapterResult,
        callAdapter
    };
};

export default useAdapter;
