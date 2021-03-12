import produce from 'immer';
import { useEffect, useMemo, useReducer } from 'react';
import AdapterResult from '../Classes/AdapterResult';
import { CancelledPromiseError } from '../Classes/Errors';
import {
    SET_ADAPTER_RESULT,
    SET_IS_LOADING,
    SET_IS_LONG_POLLING
} from '../Constants/ActionTypes';
import { IAction, IAdapterData, IUseAdapter } from '../Constants/Interfaces';
import { AdapterReturnType, AdapterState } from '../Constants/Types';
import useCancellablePromise from './useCancellablePromise';
import useLongPoll from './useLongPoll';

// Sets up reducer with 'curried producer' - https://immerjs.github.io/immer/docs/curried-produce
// Draft state can be directly modified.  Draft does not need to be explicitly returned.
const cardStateReducer = produce(
    <T extends IAdapterData>(draft: AdapterState<T>, action: IAction) => {
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
    pollingIntervalMillis?: number;

    /** Interval at which 'pulse' state is toggled for UI. */
    pulseTimeoutMillis?: number;
}

/** Wraps adapter data fetching, loading, long polling, and promise cancelling logic */
const useAdapter = <T extends IAdapterData>({
    adapterMethod,
    refetchDependencies,
    isLongPolling = false,
    pollingIntervalMillis,
    pulseTimeoutMillis
}: Params<T>): IUseAdapter<T> => {
    const defaultCardState: AdapterState<T> = useMemo(
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
            adapterResult = new AdapterResult<T>({
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
                console.error('Unexpected promise error', err);
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
        pollingIntervalMillis: !state.isLongPolling
            ? null
            : pollingIntervalMillis,
        ...(pulseTimeoutMillis && { pulseTimeoutMillis })
    });

    useEffect(() => {
        cancel(); // Cancel outstanding promises on refetch
        setIsLoading(true);
        setAdapterResult(null);
        callAdapter();
    }, [...refetchDependencies]);

    return {
        isLoading: state.isLoading,
        adapterResult: state.adapterResult as AdapterResult<T>,
        callAdapter,
        setIsLongPolling,
        pulse: longPoll.pulse
    };
};

export default useAdapter;
