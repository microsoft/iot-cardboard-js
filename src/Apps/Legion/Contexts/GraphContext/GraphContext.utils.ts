import { ICustomGraphData } from '../../../../Components/SampleGraph/GraphTypes.types';
import { createGUID } from '../../../../Models/Services/Utils';
import { IGraphNode } from './GraphContext.types';

export function GetGraphData<N>(nodeData: IGraphNode<N>[]) {
    const graphData: ICustomGraphData<N> = {
        nodes: [],
        edges: []
    };
    nodeData.forEach((model) => {
        AddNodes(model, graphData);
    });
    nodeData.forEach((model) => {
        AddEdges(model, graphData);
    });
    return graphData;
}

export function AddNodes<N>(
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
            keyshape: {
                stroke: model.color || null,
                fill: model.color || null
            },
            label: {
                value: label
            }
        }
    });
}

export function AddEdges<N>(_model: IGraphNode<N>, _data: ICustomGraphData<N>) {
    return;
}
