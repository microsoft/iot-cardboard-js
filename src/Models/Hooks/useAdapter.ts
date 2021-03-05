import produce from 'immer';
import { useEffect, useReducer } from 'react';
import AdapterResult from '../Classes/AdapterResult';
import { SET_ADAPTER_RESULT, SET_IS_LOADING } from '../Constants/ActionTypes';
import { Action, IAdapterData } from '../Constants/Interfaces';
import { AdapterReturnType, CardState } from '../Constants/Types';
import useCancellablePromise from './useCancellablePromise';
import useLongPoll from './useLongPoll';

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
    isLongPolling?: boolean;
    pollInterval?: number;
    pulseInterval?: number;
};

// Hook which accepts generic IAdapterData type and exposes card state
const useAdapter = <T extends IAdapterData>({
    adapterMethod,
    refetchDependencies,
    isLongPolling = false,
    pollInterval,
    pulseInterval
}: Params) => {
    const defaultCardState: CardState<T> = {
        adapterResult: new AdapterResult<T>({ result: null, error: null }),
        isLoading: false
    };

    const [state, dispatch] = useReducer(cardStateReducer, defaultCardState);
    const { cancellablePromise, cancel } = useCancellablePromise();

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
        const adapterResult = await cancellablePromise(adapterMethod());
        setIsLoading(false);
        setAdapterResult(adapterResult as any);
    };

    const longPoll = useLongPoll({
        callback: callAdapter,
        pollInterval: !isLongPolling ? null : pollInterval,
        ...(pulseInterval && { pulseInterval })
    });

    useEffect(() => {
        cancel(); // Cancel outstanding promises on refetch
        setAdapterResult(null);
        callAdapter();
    }, [...refetchDependencies]);

    return {
        isLoading: state.isLoading,
        adapterResult: state.adapterResult,
        callAdapter,
        pulse: longPoll.pulse
    };
};

export default useAdapter;
