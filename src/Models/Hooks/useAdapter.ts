import produce from 'immer';
import { useEffect, useMemo, useReducer } from 'react';
import AdapterResult from '../Classes/AdapterResult';
import { CancelledPromiseError } from '../Classes/Errors';
import {
    SET_ADAPTER_RESULT,
    SET_IS_LOADING,
    SET_IS_LONG_POLLING
} from '../Constants/ActionTypes';
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
            case SET_IS_LONG_POLLING:
                draft.isLongPolling = payload;
                return;
            default:
                return;
        }
    }
);

interface Params<T extends IAdapterData> {
    /** Callback which triggers adapter data fetch */
    adapterMethod: () => AdapterReturnType<T>;

    /** Array of dependencies that, when changed, should cancel the data fetch, nullify the data, and trigger a refetch.   */
    refetchDependencies: any[];

    /** Whether or not the adapterMethod is long polling */
    isLongPolling?: boolean;

    /** Long polling interval */
    pollInterval?: number;

    /** Interval at which 'pulse' state is toggled for UI.  Defaults to 1/2 pollInterval */
    pulseInterval?: number;
}

/** Wraps adapter data fetching, loading, long polling, and promise cancelling logic */
const useAdapter = <T extends IAdapterData>({
    adapterMethod,
    refetchDependencies,
    isLongPolling = false,
    pollInterval,
    pulseInterval
}: Params<T>) => {
    const defaultCardState: CardState<T> = useMemo(
        () => ({
            adapterResult: new AdapterResult<T>({ result: null, error: null }),
            isLoading: false,
            isLongPolling
        }),
        [isLongPolling]
    );

    const [state, dispatch] = useReducer(cardStateReducer, defaultCardState);
    const { cancellablePromise, cancel } = useCancellablePromise();

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
        try {
            const adapterResult = await cancellablePromise(adapterMethod());
            setAdapterResult(adapterResult);
        } catch (err) {
            if (err instanceof CancelledPromiseError) {
                console.log(err.message);
            } else {
                console.log(err);
            }
        }
        setIsLoading(false);
    };

    const setIsLongPolling = (isLongPolling: boolean) => {
        dispatch({
            type: SET_IS_LONG_POLLING,
            payload: isLongPolling
        });
    };

    const longPoll = useLongPoll({
        callback: callAdapter,
        pollInterval: !state.isLongPolling ? null : pollInterval,
        ...(pulseInterval && { pulseInterval })
    });

    useEffect(() => {
        cancel(); // Cancel outstanding promises on refetch
        setIsLoading(true);
        setAdapterResult(null);
        callAdapter();
    }, [...refetchDependencies]);

    return {
        /** Adapter data fetch loading state */
        isLoading: state.isLoading,

        /** Result of adapter method call */
        adapterResult: state.adapterResult,

        /** Calls adapter method (safe on unmount) and updates adapter result */
        callAdapter,

        /** Toggles on/off long poll */
        setIsLongPolling,

        /** Long polling pulse state for UI */
        pulse: longPoll.pulse
    };
};

export default useAdapter;
