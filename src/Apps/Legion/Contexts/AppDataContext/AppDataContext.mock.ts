/** File for exporting common testing utilities for the context */

import { IAppDataContextState } from './AppDataContext.types';

export const GET_MOCK_APP_DATA_CONTEXT_STATE = (): IAppDataContextState => {
    return {
        targetDatabase: {
            databaseName: 'Mock target database'
        }
    };
};
