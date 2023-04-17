import { ICustomGraphData } from '../../Components/GraphVisualizer/GraphTypes.types';

export interface IGraphNode<T> {
    /** color of the node */
    color?: string;
    /** data bag to attach to the node */
    data: T;
    /** icon to show on the node */
    icon?: string;
    /** unique id for the node. Must be unique on the graph */
    id: string;
    /** label to show for the node */
    label: string;
}

export interface IGraphContextProviderProps<N> {
    nodeData: IGraphNode<N>[];
    initialState?: Partial<Omit<IGraphContextState, 'graphData'>>;
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
    isParentFormVisible: boolean;
    graphData: ICustomGraphData<any>;
    selectedNodeIds: string[];
}

/**
 * The actions to update the state
 */
export enum GraphContextActionType {
    ADD_PARENT = 'ADD_PARENT',
    PARENT_FORM_MODAL_HIDE = 'PARENT_FORM_MODAL_HIDE',
    PARENT_FORM_MODAL_SHOW = 'PARENT_FORM_MODAL_SHOW',
    SET_SELECTED_NODES = 'SET_SELECTED_NODES'
}

/** The actions to update the state */
export type GraphContextAction =
    | {
          type: GraphContextActionType.SET_SELECTED_NODES;
          payload: {
              nodeIds: string[];
          };
      }
    | {
          type: GraphContextActionType.PARENT_FORM_MODAL_SHOW;
          payload: {
              /** node id that was clicked to create the parent, will prioritize SelectedNodes if any, then fallback to this node if nothing is selected */
              nodeId: string;
          };
      }
    | {
          type: GraphContextActionType.PARENT_FORM_MODAL_HIDE;
      }
    | {
          type: GraphContextActionType.ADD_PARENT;
          payload: {
              /** node id that was clicked to create the parent, will prioritize SelectedNodes if any, then fallback to this node if nothing is selected */
              nodeId: string;
          };
      };
