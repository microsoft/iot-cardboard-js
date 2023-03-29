export interface IGraphContextProviderProps {
    initialState?: Partial<IGraphContextState>;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IGraphContext {
    graphState: IGraphContextState;
    graphDispatch: React.Dispatch<GraphContextAction>;
}

/**
 * The state of the context
 */
export interface IGraphContextState {
    selectedNodes: string[];
}

/**
 * The actions to update the state
 */
export enum GraphContextActionType {
    SET_SELECTED_NODES = 'SET_SELECTED_NODES'
}

/** The actions to update the state */
export type GraphContextAction = {
    type: GraphContextActionType.SET_SELECTED_NODES;
    payload: {
        nodeIds: string[];
    };
};
