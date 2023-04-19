import { useContext, useMemo } from 'react';
import MockDataManagementAdapter from '../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import { IDataManagementAdapter } from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { ADXAdapterTargetContext } from '../Models';

/**
 * This hook is used to grab an adapter from context provided or returns the mock adapter of that kind if provided
 * @param context specify the target context object to get the adapter value from nearest context provider of
 * @returns adapter IDataManagementAdapter class
 */
export const useADXAdapter = (
    context: ADXAdapterTargetContext
): IDataManagementAdapter => {
    const contextValue = useContext(context);
    return useMemo(() => {
        if (!contextValue) {
            console.warn('Context is not provided, returning mock adapter...');
        }
        return contextValue?.adapter || new MockDataManagementAdapter();
    }, [contextValue]);
};
