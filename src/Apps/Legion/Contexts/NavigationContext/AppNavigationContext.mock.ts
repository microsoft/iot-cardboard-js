/** File for exporting common testing utilities for the context */

import {
    AppPageName,
    IAppNavigationContextState
} from './AppNavigationContext.types';

export const GET_MOCK_APP_NAV_CONTEXT_STATE = (): IAppNavigationContextState => {
    return {
        currentPage: { pageName: AppPageName.StoreList }
    };
};
