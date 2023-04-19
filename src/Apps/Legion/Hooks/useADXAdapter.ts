import { useContext, useMemo } from 'react';
import MockDataManagementAdapter from '../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import { IWizardDataManagementContext } from '../Contexts/WizardDataManagementContext/WizardDataManagementContext.types';
import { IDataPusherContext } from '../Components/DataPusher/DataPusher.types';
import { IDataManagementAdapter } from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';

/**
 * This hook is used to grab an adapter from context provided or returns the mock adapter of that kind if provided
 * @param context specify the target context object to get the adapter value from nearest context provider of
 * @returns adapter IDataManagementAdapter class
 */
export const useADXAdapter = (
    context: React.Context<IWizardDataManagementContext | IDataPusherContext>
): IDataManagementAdapter => {
    const contextValue = useContext(context);
    return useMemo(() => {
        if (!contextValue) {
            console.warn('Context is not provided, returning mock adapter...');
        }
        return contextValue?.adapter || new MockDataManagementAdapter();
    }, [contextValue]);
};
