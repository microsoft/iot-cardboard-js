import { useContext, useMemo } from 'react';
import MockDataManagementAdapter from '../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import { IDataManagementAdapter } from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';

export const useDataManagementAdapter = (
    context: React.Context<any>
): IDataManagementAdapter => {
    const contextValue = useContext(context);

    return useMemo(() => {
        if (!contextValue) {
            console.warn('Context is not provided, returning mock adapter...');
        }
        return contextValue
            ? contextValue.adapter
            : new MockDataManagementAdapter();
    }, [contextValue]);
};
