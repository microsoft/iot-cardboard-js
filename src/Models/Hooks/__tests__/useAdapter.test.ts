import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import useAdapter from '../useAdapter';
import { MockAdapter } from '../../../Adapters';
import { AdapterResult, KeyValuePairAdapterData } from '../../Classes';

const networkTimeoutMillis = 100;
const pollingIntervalMillis = 100;

jest.mock('../../../i18n.ts', () => ({ t: () => 'testTranslation' }));

const getUseAdapterParams: (options?: { isLongPolling?: boolean }) => any = (
    options,
) => {
    return {
        adapterMethod: () => {
            return new MockAdapter({
                networkTimeoutMillis,
                isDataStatic: false,
            }).getKeyValuePairs('test', ['temp', 'speed', 'pressure'], {});
        },
        refetchDependencies: [],
        ...(options?.isLongPolling
            ? {
                  isLongPolling: true,
                  pollingIntervalMillis,
                  pulseTimeoutMillis: pollingIntervalMillis,
              }
            : {}),
    };
};

afterEach(cleanup);

describe('Basic useAdapter tests', () => {
    test('useAdapter return type is correct on initial call', () => {
        const { result } = renderHook(() => useAdapter(getUseAdapterParams()));
        const current = result.current;

        expect(current.adapterResult).toEqual(
            new AdapterResult<KeyValuePairAdapterData>({
                result: null,
                errorInfo: null,
            }),
        );
        expect(current.isLoading).toBe(true);
        expect(current.pulse).toBe(false);
    });

    test('loading state is truthy while loading, then false once data loaded', async (done) => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useAdapter(getUseAdapterParams()),
        );

        expect(result.current.isLoading).toBe(true);
        await waitForNextUpdate();
        expect(result.current.isLoading).toBe(false);
        done();
    });

    test('rendered component with useAdapter hook can safely unmount during adapter data fetch', async (done) => {
        const { unmount } = renderHook(() => useAdapter(getUseAdapterParams()));
        act(() => {
            unmount();
        });
        done();
    });

    test('manual adapter data refetch fetches new data', async (done) => {
        const {
            result,
            waitForNextUpdate,
            waitForValueToChange,
        } = renderHook(() => useAdapter(getUseAdapterParams()));

        // Wait for initial data fetch to complete
        await waitForNextUpdate();

        // Save intial data fetched
        const dataFetched = result.current.adapterResult.result.data;

        // Trigger manual adapter call
        act(() => {
            result.current.callAdapter();
        });

        // Wait for refetch to complete
        await waitForValueToChange(() => result.current.isLoading);

        // Verify new data is present
        expect(result.current.adapterResult.result.data).not.toEqual(
            dataFetched,
        );
        done();
    });
});

describe('Long polling useAdapter tests', () => {
    test('Long polling activated, pulse state, and long polling toggle', async (done) => {
        const { result, waitForValueToChange, unmount } = renderHook(() =>
            useAdapter(getUseAdapterParams({ isLongPolling: true })),
        );

        // Test initial hook state on mount
        expect(result.current.adapterResult).toEqual(
            new AdapterResult<KeyValuePairAdapterData>({
                result: null,
                errorInfo: null,
            }),
        );
        expect(result.current.pulse).toBe(false);
        expect(result.current.isLongPolling).toBe(true);

        // Wait for loading state to change
        await waitForValueToChange(() => result.current.isLoading);

        // Test state once data has loaded and save data fetched into variable
        expect(result.current.adapterResult.hasNoData()).toBe(false);
        expect(result.current.pulse).toBe(true);
        const dataFetched = result.current.adapterResult.result.data.slice(0);

        // Wait for first long poll to trigger
        await waitForValueToChange(
            () => result.current.adapterResult.result.data,
        );

        expect(dataFetched).not.toEqual(
            result.current.adapterResult.result.data,
        );

        // Toggle off long polling
        act(() => {
            result.current.setIsLongPolling(false);
        });

        expect(result.current.isLongPolling).toBe(false);
        unmount();
        done();
    });
});

describe('Dependency change testing', () => {
    test('Changing hook dependencies triggers data refetch', async (done) => {
        let refetchDeps = ['temp', 'press', 'vol'];

        const { result, rerender, waitForValueToChange } = renderHook(() =>
            useAdapter({
                adapterMethod: () =>
                    new MockAdapter({
                        networkTimeoutMillis,
                        isDataStatic: false,
                    }).getKeyValuePairs(
                        'test',
                        ['temp', 'speed', 'pressure'],
                        {},
                    ),
                refetchDependencies: refetchDeps,
                isAdapterCalledOnMount: true,
            }),
        );

        // Wait for original data to load
        await waitForValueToChange(() => result.current.isLoading);

        const dataFetched = result.current.adapterResult.result.data;
        expect(dataFetched).not.toBe(null);

        // Change refetch deps
        act(() => {
            refetchDeps = ['height', 'weight', 'rad'];
        });

        rerender();

        // Wait for data to load
        await waitForValueToChange(() => result.current.isLoading);

        expect(dataFetched).not.toEqual(
            result.current.adapterResult.result.data,
        );
        done();
    });
});
