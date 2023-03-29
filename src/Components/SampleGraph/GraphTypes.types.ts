import { NodeConfig, EdgeConfig } from '@antv/g6';
import {
    EdgeStyle,
    GraphinData,
    IUserEdge,
    IUserNode,
    NodeStyle
} from '@antv/graphin';
import { OatGraphReferenceType } from '../../Models/Constants/Constants';

/** data passed to the graph. Overriding nodes, so we can define the custom properties we add for rendering */
export interface ICustomGraphData extends GraphinData {
    nodes: ICustomNodeDefintion[]; // override root definition
    edges: ICustomEdgeDefintion[]; // override root definition
}

// #region Nodes

/** data passed into a node at runtime */
export interface ICustomNodeConfig extends NodeConfig {
    data: ICustomNodeData;
}

/** used to define a node at config time */
export interface ICustomNodeDefintion extends IUserNode {
    data: ICustomNodeData;
}

/** custom data to pass to a node for rendering purposes */
export interface ICustomNodeData {
    itemType: 'Node';
    id: string;
    name: string;
    relatedNodesKey: string;
}

// #endregion

// #region Edges

/** data passed into an edge at run time */
export interface ICustomEdgeConfig extends EdgeConfig {
    data: ICustomEdgeData;
}

/** used to define a node at config time */
export interface ICustomEdgeDefintion extends IUserEdge {
    data: ICustomEdgeData;
}

/** custom data to pass to an edge for rendering purposes */
export interface ICustomEdgeData {
    itemType: 'Edge';
    name: string;
    source: string;
    target: string;
    type: OatGraphReferenceType;
}
// #endregion

// #region Built-in Graph Types
export type IDefaultNode = Partial<{
    type?: string;
    style: NodeStyle;
    [key: string]: any;
}>;
export type IDefaultEdge = Partial<{
    type?: 'graphin-line';
    style: EdgeStyle;
    [key: string]: any;
}>;
// #endregion
