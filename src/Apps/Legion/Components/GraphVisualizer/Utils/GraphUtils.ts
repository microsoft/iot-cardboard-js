import { INode } from '@antv/g6';

export function GetNodeIdsFromSelection(nodes: INode[]): string[] {
    return nodes.map((node) => node.getModel().id);
}
