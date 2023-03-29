/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IGraphContext,
    IGraphContextProviderProps,
    IGraphContextState,
    GraphContextAction,
    GraphContextActionType
} from './GraphContext.types';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('GraphContext', debugLogging);

export const GraphContext = React.createContext<IGraphContext>(null);
export const useGraphContext = () => useContext(GraphContext);

export const GraphContextReducer: (
    draft: IGraphContextState,
    action: GraphContextAction
) => IGraphContextState = produce(
    (draft: IGraphContextState, action: GraphContextAction) => {
        logDebugConsole(
            'info',
            `Updating Graph context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case GraphContextActionType.SET_SELECTED_NODES:
                draft.selectedNodes = action.payload.nodes;
                break;
        }
    }
);

export const GraphContextProvider: React.FC<IGraphContextProviderProps> = React.memo(
    (props) => {
        const { children, initialState } = props;

        // skip wrapping if the context already exists
        const existingContext = useGraphContext();
        if (existingContext) {
            return <>{children}</>;
        }

        const [state, dispatch] = useReducer(
            GraphContextReducer,
            { ...emptyState, ...initialState },
            getInitialState
        );

        logDebugConsole('debug', 'Mount GraphContextProvider. {state}', state);
        return (
            <GraphContext.Provider
                value={{
                    graphDispatch: dispatch,
                    graphState: state
                }}
            >
                {children}
            </GraphContext.Provider>
        );
    }
);

const emptyState: IGraphContextState = {
    selectedNodes: []
};

const getInitialState = (
    initialState: IGraphContextState
): IGraphContextState => {
    const state: IGraphContextState = {
        ...initialState
    };

    logDebugConsole('debug', 'Initialized context state. {state}', state);

    return state;
};
