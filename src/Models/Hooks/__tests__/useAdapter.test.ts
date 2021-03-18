import {
    renderHook,
    act,
    RenderHookResult,
    cleanup
} from '@testing-library/react-hooks';
import useAdapter from '../useAdapter';
import { MockAdapter } from '../../../Adapters';
import { AdapterResult, KeyValuePairAdapterData } from '../../Classes';
import { IUseAdapter } from '../../Constants';

const networkTimeoutMillis = 100;
const pulseMillis = 50;

let adapterInfo;
let renderedHook: RenderHookResult<any, IUseAdapter<KeyValuePairAdapterData>>;

beforeEach(() => {
    adapterInfo = {
        adapter: new MockAdapter(undefined, networkTimeoutMillis), // Explicitly set network timeout period
        id: 'test',
        properties: ['temp', 'speed', 'pressure']
    };
});

afterEach(() => {
    cleanup();
});

describe('Basic useAdapter tests', () => {
    // Call hook with minimal props
    beforeEach(() => {
        act(() => {
            renderedHook = renderHook(() =>
                useAdapter<KeyValuePairAdapterData>({
                    adapterMethod: () =>
                        adapterInfo.adapter.getKeyValuePairs(
                            adapterInfo.id,
                            adapterInfo.properties
                        ),
                    refetchDependencies: adapterInfo.properties
                })
            );
        });
    });

    test('useAdapter return type is correct on initial call', () => {
        const {
            result: { current }
        } = renderedHook;
        expect(current.adapterResult).toEqual(
            new AdapterResult<KeyValuePairAdapterData>({
                result: null,
                errorInfo: null
            })
        );
        expect(current.isLoading).toBe(true);
        expect(current.pulse).toBe(false);
    });

    test('loading state is truthy while loading, then false once data loaded', async () => {
        expect(renderedHook.result.current.isLoading).toBe(true);
        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.adapterResult
        );
        expect(renderedHook.result.current.isLoading).toBe(false);
    });

    test('rendered component with useAdapter hook can safely unmount during adapter data fetch', async () => {
        renderedHook.unmount();
    });

    test('manual adapter data refetch', async () => {
        // Wait for initial data fetch to complete
        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.isLoading
        );

        expect(renderedHook.result.current.isLoading).toBe(false);

        // Save intial data fetched
        const dataFetched =
            renderedHook.result.current.adapterResult.result.data;

        // Trigger manual adapter call
        act(() => {
            renderedHook.result.current.callAdapter();
        });

        expect(renderedHook.result.current.isLoading).toBe(true);

        // Wait for manual data fetch (callAdapter) to complete
        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.isLoading
        );

        // Verify new data is present
        expect(renderedHook.result.current.isLoading).toBe(false);
        expect(
            renderedHook.result.current.adapterResult.result.data
        ).not.toEqual(dataFetched);
    });
});

describe('Long polling useAdapter tests', () => {
    // Call hook with long polling props
    beforeEach(() => {
        act(() => {
            renderedHook = renderHook(() =>
                useAdapter<KeyValuePairAdapterData>({
                    adapterMethod: () =>
                        adapterInfo.adapter.getKeyValuePairs(
                            adapterInfo.id,
                            adapterInfo.properties
                        ),
                    refetchDependencies: adapterInfo.properties,
                    isLongPolling: true,
                    pollingIntervalMillis: networkTimeoutMillis * 2,
                    pulseTimeoutMillis: pulseMillis
                })
            );
        });
    });

    test('Long polling activated, pulse state, and long polling toggle', async () => {
        // Test initial hook state on mount
        expect(renderedHook.result.current.adapterResult).toEqual(
            new AdapterResult<KeyValuePairAdapterData>({
                result: null,
                errorInfo: null
            })
        );
        expect(renderedHook.result.current.isLoading).toBe(true);
        expect(renderedHook.result.current.pulse).toBe(false);
        expect(renderedHook.result.current.isLongPolling).toBe(true);

        // Wait for loading state to change
        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.isLoading
        );

        // Test state once data has loaded and save data fetched into variable
        expect(renderedHook.result.current.adapterResult.hasNoData()).toBe(
            false
        );
        expect(renderedHook.result.current.isLoading).toBe(false);
        expect(renderedHook.result.current.pulse).toBe(true);
        const dataFetched =
            renderedHook.result.current.adapterResult.result.data;

        // Wait for first long poll.  State should indicate loading
        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.isLoading
        );

        expect(renderedHook.result.current.isLoading).toBe(true);

        // Wait for first long poll completion.  Data should be updated.
        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.isLoading
        );

        expect(dataFetched).not.toEqual(
            renderedHook.result.current.adapterResult.result.data
        );

        // Toggle off long polling
        act(() => {
            renderedHook.result.current.setIsLongPolling(false);
        });

        expect(renderedHook.result.current.isLongPolling).toBe(false);
    });
});

describe('Dependency change testing', () => {
    test('Changing hook dependencies triggers data refetch', async () => {
        const id = 'test1';
        let properties = ['temp', 'speed', 'pressure'];

        // Call hook with initial id and properties
        renderedHook = renderHook(() =>
            useAdapter<KeyValuePairAdapterData>({
                adapterMethod: () =>
                    adapterInfo.adapter.getKeyValuePairs(id, properties),
                refetchDependencies: properties
            })
        );

        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.isLoading
        );

        const dataFetched =
            renderedHook.result.current.adapterResult.result.data;

        // Change properties
        properties = ['altitude', 'acceleration', 'direction'];
        renderedHook.rerender();

        // Test for refetch and new data
        expect(renderedHook.result.current.isLoading).toBe(true);

        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.isLoading
        );

        expect(dataFetched).not.toEqual(
            renderedHook.result.current.adapterResult.result.data
        );
    });
});
