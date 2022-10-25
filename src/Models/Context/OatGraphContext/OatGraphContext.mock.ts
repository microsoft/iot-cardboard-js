import { IOatGraphContextState } from './OatGraphContext.types';

export const GET_MOCK_OAT_GRAPH_CONTEXT_STATE = (): IOatGraphContextState => {
    return {
        isLoading: false,
        isLegendVisible: true,
        isMiniMapVisible: true,
        showComponents: true,
        showInheritances: true,
        showRelationships: true
    };
};
