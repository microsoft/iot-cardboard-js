/** File for exporting common testing utilities for the context */

import { INavigationContextState } from './NavigationContext.types';

export const GET_MOCK_OAT_CONTEXT_STATE = (): INavigationContextState => {
    return {
        currentPage: 'StoreListPage'
    };
};
