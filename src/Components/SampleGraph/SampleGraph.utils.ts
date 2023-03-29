import { EdgeStyle } from '@antv/graphin';
import {
    OatGraphReferenceType,
    DtdlInterface,
    OAT_EXTEND_HANDLE_NAME
} from '../..';
import { DTDLType } from '../../Models/Classes/DTDL';
import {
    isDTDLReference,
    isDTDLRelationshipReference,
    isDTDLComponentReference
} from '../../Models/Services/DtdlUtils';
import { ensureIsArray } from '../../Models/Services/OatUtils';
import { createGUID } from '../../Models/Services/Utils';
import { IExtendedTheme } from '../../Theming/Theme.types';
import { ICustomGraphData } from './GraphTypes.types';
import { IGraphNode } from './SampleGraph.types';

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
        }
    });
}

export function AddEdges<N>(
    model: DtdlInterface,
    data: ICustomGraphData<N>,
    theme: IExtendedTheme
) {
    model.contents?.forEach((content) => {
        if (isDTDLReference(content)) {
            let source = '';
            let target = '';
            if (isDTDLRelationshipReference(content)) {
                source = model['@id'];
                target = content.target;
            } else if (isDTDLComponentReference(content)) {
                source = model['@id'];
                target =
                    typeof content.schema === 'object'
                        ? content.schema['@id']
                        : content.schema;
            }
            data.edges.push({
                source: source,
                target: target,
                label: content.name,
                data: {
                    itemType: 'Edge',
                    name: content.name,
                    source: source,
                    target: target,
                    type: content['@type']
                },
                style: getEdgeStyle(content['@type'], theme)
            });
        }
    });
    // add extends edges
    const extendsStyle = getEdgeStyle('Extend', theme);
    ensureIsArray(model.extends).forEach((content) => {
        data.edges.push({
            source: model['@id'],
            target: content,
            label: 'Extends',
            data: {
                itemType: 'Edge',
                name: 'Extends',
                source: model['@id'],
                target: content,
                type: OAT_EXTEND_HANDLE_NAME
            },
            style: extendsStyle
        });
    });
}

function getEdgeStyle(
    type: OatGraphReferenceType,
    theme: IExtendedTheme
): Partial<EdgeStyle> {
    let edgeColor = 'black';
    switch (type) {
        case DTDLType.Relationship:
            edgeColor = theme.palette.yellow;
            break;
        case DTDLType.Component:
            edgeColor = theme.palette.blue;
            break;
        case 'Extend':
            edgeColor = theme.palette.green;
            break;
        case 'Untargeted':
            edgeColor = theme.palette.yellow;
    }
    return {
        keyshape: {
            stroke: edgeColor
        },
        status: {
            hover: {
                halo: {
                    stroke: 'yellow',
                    fill: 'blue',
                    visible: true
                }
            },
            selected: {
                halo: {
                    stroke: 'red',
                    fill: 'green',
                    visible: true
                }
            }
        }
    };
}
