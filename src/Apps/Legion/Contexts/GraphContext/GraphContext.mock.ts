/** File for exporting common testing utilities for the context */

import { IGraphContextState } from './GraphContext.types';

export const GET_MOCK_OAT_CONTEXT_STATE = (): IGraphContextState => {
    return {
        selectedNodes: []
    };
};
