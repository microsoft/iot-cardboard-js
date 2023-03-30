import { createGUID } from '../../../../Models/Services/Utils';
import { ICustomGraphData } from '../../Components/GraphVisualizer/GraphTypes.types';
import { IGraphNode } from './GraphContext.types';

export function GetGraphData<N>(nodeData: IGraphNode<N>[]) {
    const graphData: ICustomGraphData<N> = {
        nodes: [],
        edges: []
    };
    nodeData.forEach((model) => {
        AddNode(model, graphData);
    });
    return graphData;
}

export function AddNode<N>(
    model: IGraphNode<N>,
    graphData: ICustomGraphData<N>
) {
    // add the model node
    const id = model.id || createGUID();
    const label = model.label || '';
    graphData.nodes.push({
        id: id,
        label: label,
        data: {
            ...model.data,
            itemType: 'Node',
            id: id,
            name: label
        },
        style: {
            badges: [],
            halo: {},
            icon: {},
            keyshape: model.color
                ? {
                      stroke: model.color,
                      fill: model.color
                  }
                : undefined,
            label: {
                value: label
            }
        }
    });
}

interface IEdgeData {
    sourceId: string;
    targetId: string;
    label: string;
}
export function AddEdge<N>(
    edgeData: IEdgeData,
    graphData: ICustomGraphData<N>
) {
    graphData.edges.push({
        source: edgeData.sourceId,
        target: edgeData.targetId,
        data: {
            itemType: 'Edge',
            name: 'Parent',
            source: edgeData.sourceId,
            target: edgeData.targetId
        }
    });
}
