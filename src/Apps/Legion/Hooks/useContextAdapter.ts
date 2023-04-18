import { useContext, useMemo } from 'react';
import MockDataManagementAdapter from '../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import BaseAdapter from '../Adapters/BaseAdapter';

/**
 * This hook is used to grab an adapter from context provided or returns the mock adapter of that kind if provided
 * @param context specify the target context object to get the adapter value from nearest context provider of
 * @param fallbackMockAdapter the fallback mock adapter that will return if it is not exist in context provided
 * @returns adapter class
 */
export const useContextAdapter = <
    T extends BaseAdapter = MockDataManagementAdapter // wasn't able to make it work with only extending from BaseAdapter, for now keep MockDataManagementAdapter here
>(
    context: React.Context<any>,
    fallbackMockAdapter: { new () } = MockDataManagementAdapter // currently fallback adapter is MockDataManagementAdapter, change this as necessary or dont forget to pass as argument
): T => {
    const contextValue = useContext(context);
    return useMemo(() => {
        if (!contextValue) {
            console.warn('Context is not provided, returning mock adapter...');
        }
        return contextValue?.adapter || new fallbackMockAdapter();
    }, [contextValue, fallbackMockAdapter]);
};
