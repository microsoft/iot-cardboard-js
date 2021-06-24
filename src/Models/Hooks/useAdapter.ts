import produce from 'immer';
import { useEffect, useMemo, useReducer, useRef } from 'react';
import AdapterResult from '../Classes/AdapterResult';
import { CancelledPromiseError } from '../Classes/Errors';
import {
    SET_ADAPTER_RESULT,
    SET_IS_LOADING,
    SET_IS_LONG_POLLING,
    SET_IS_INITIAL_CALL
} from '../Constants/ActionTypes';
import { IAction, IAdapterData, IUseAdapter } from '../Constants/Interfaces';
import {
    AdapterReturnType,
    AdapterState,
    AdapterMethodParams
} from '../Constants/Types';
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
            case SET_IS_INITIAL_CALL:
                draft.isInitialCall = payload;
                return;
            default:
                return;
        }
    }
);

interface Params<T extends IAdapterData> {
    /** Callback which triggers adapter data fetch */
    adapterMethod: (params?: AdapterMethodParams) => AdapterReturnType<T>;

    /** Not to execute the adapter method when we use the useAdapter hook in first render */
    isAdapterCalledOnMount?: boolean;

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
    pulseTimeoutMillis,
    isAdapterCalledOnMount = true
}: Params<T>): IUseAdapter<T> => {
    const defaultCardState: AdapterState<T> = useMemo(
        () => ({
            adapterResult: new AdapterResult<T>({
                result: null,
                errorInfo: null
            }),
            isLoading: false,
            isLongPolling,
            isInitialCall: true
        }),
        [isLongPolling]
    );

    const mountedRef = useRef(null);

    const [state, dispatch] = useReducer(cardStateReducer, defaultCardState);
    const { cancellablePromise, cancel } = useCancellablePromise();

    const setIsLoading = (isLoading: boolean) => {
        dispatch({ type: SET_IS_LOADING, payload: isLoading });
    };

    const setAdapterResult = (adapterResult: AdapterResult<T>) => {
        if (!adapterResult) {
            adapterResult = new AdapterResult<T>({
                result: null,
                errorInfo: null
            });
        }
        dispatch({ type: SET_ADAPTER_RESULT, payload: adapterResult });
    };

    const callAdapter = async (params?: AdapterMethodParams) => {
        setIsLoading(true);
        try {
            const adapterResult = await cancellablePromise(
                adapterMethod(params)
            );
            if (mountedRef.current) {
                setAdapterResult(adapterResult);
                setIsLoading(false);
            }
        } catch (err) {
            if (!(err instanceof CancelledPromiseError)) {
                console.error('Unexpected promise error', err); // log unexpected errors
                if (mountedRef.current) {
                    setIsLoading(false); // Toggle off loading state if component is still mounted
                }
            }
        }
    };

    const cancelAdapter = (shouldPreserveResult?: boolean) => {
        cancel(); // Cancel outstanding promises
        if (mountedRef.current) {
            if (!shouldPreserveResult) {
                setAdapterResult(null);
            }
            setIsLoading(false);
        }
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
        if (state.isInitialCall) {
            if (isAdapterCalledOnMount) {
                cancelAdapter();
                callAdapter();
            }
            dispatch({
                type: SET_IS_INITIAL_CALL,
                payload: false
            });
        } else {
            cancelAdapter();
            callAdapter();
        }
    }, [...refetchDependencies]);

    useEffect(() => {
        mountedRef.current = true; // Use ref to indicate mounted state
        return () => {
            mountedRef.current = false;
            cancelAdapter();
        };
    }, []);

    return {
        isLoading: state.isLoading,
        adapterResult: state.adapterResult as AdapterResult<T>,
        callAdapter,
        cancelAdapter,
        setIsLongPolling,
        isLongPolling: state.isLongPolling,
        pulse: longPoll.pulse
    };
};

export default useAdapter;
