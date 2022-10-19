import { IOatGraphContextState } from './OatGraphContext.types';

export const GET_MOCK_OAT_GRAPH_CONTEXT_STATE = (): IOatGraphContextState => {
    return {
        showComponents: true,
        showInheritances: true,
        showRelationships: true
    };
};
