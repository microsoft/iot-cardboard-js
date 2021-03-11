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

const adapterInfo = {
    adapter: new MockAdapter(undefined, networkTimeoutMillis), // Explicitly set network timeout period
    id: 'test',
    properties: ['temp', 'speed', 'pressure']
};

let renderedHook: RenderHookResult<any, IUseAdapter<KeyValuePairAdapterData>>;

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

afterEach(() => {
    cleanup();
});

describe('useAdapter tests', () => {
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
