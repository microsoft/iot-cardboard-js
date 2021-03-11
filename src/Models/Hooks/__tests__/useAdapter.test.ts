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

const networkTimeoutMillis = 250;

const networkTimeout = () => {
    return new Promise(
        (res) => setTimeout(() => res(null), networkTimeoutMillis + 100) // Add 100msecs to ensure mocked network timeout has completed
    );
};

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
                error: null
            })
        );
        expect(current.isLoading).toBe(true);
        expect(current.pulse).toBe(false);
    });

    test('loading state is truthy while loading, then false once loaded', async () => {
        expect(renderedHook.result.current.isLoading).toBe(true);
        await renderedHook.waitForValueToChange(
            () => renderedHook.result.current.isLoading
        );
        expect(renderedHook.result.current.isLoading).toBe(false);
    });

    test('rendered component with useAdapter hook can safely unmount during adapter data fetch', async () => {
        renderedHook.unmount();
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
                    pollingIntervalMillis: 500
                })
            );
        });
    });

    test.only('Long polling works as expected when toggled to true on initial hook call', async () => {
        const {
            result: { current }
        } = renderedHook;
        expect(current.adapterResult).toEqual(
            new AdapterResult<KeyValuePairAdapterData>({
                result: null,
                error: null
            })
        );
        expect(current.isLoading).toBe(true);
        expect(current.pulse).toBe(false);
        // await networkTimeout();
        // renderedHook.rerender();
        await renderedHook.waitFor(() => !current.adapterResult?.hasNoData(), {
            timeout: 5000
        });
        console.log(current);
        // expect(current.adapterResult.result.hasNoData()).toBe(false);
        // expect(current.isLoading).toBe(false);
        // expect(current.pulse).toBe(true);
    });
});
