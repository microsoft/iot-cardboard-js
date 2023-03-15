import React, { useEffect, useRef } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { createNodeFromReact } from '@antv/g6-react-node';
import Graphin, { EdgeStyle } from '@antv/graphin';
import { CreateEdge } from '@antv/graphin-components';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import {
    getDebugLogger,
    sortCaseInsensitive
} from '../../Models/Services/Utils';
import {
    ISampleGraphProps,
    ISampleGraphStyleProps,
    ISampleGraphStyles
} from './SampleGraph.types';
import { getStyles } from './SampleGraph.styles';
import CustomGraphNode from './Internal/CustomGraphNode/CustomGraphNode';
import {
    ICustomGraphData,
    ICustomNodeConfig,
    IDefaultEdge,
    IDefaultNode
} from './GraphTypes.types';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ensureIsArray, parseModelId } from '../../Models/Services/OatUtils';
import {
    isDTDLComponentReference,
    isDTDLReference,
    isDTDLRelationshipReference
} from '../../Models/Services/DtdlUtils';
import {
    DtdlInterface,
    OatGraphReferenceType,
    OAT_EXTEND_HANDLE_NAME
} from '../../Models/Constants';
import ONTOLOGY_DATA from './CityOntology.json';
import CustomClickHandler from './Hooks/CustomClickHandler/CustomClickHandler';
import CustomLegend from './Internal/CustomLegend/CustomLegend';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { IExtendedTheme } from '../../Theming/Theme.types';
import { DTDLType } from '../../Models/Classes/DTDL';
import { CustomNode } from './Internal/CustomNode';

const debugLogging = true;
const logDebugConsole = getDebugLogger('SampleGraph', debugLogging);

const getClassNames = classNamesFunction<
    ISampleGraphStyleProps,
    ISampleGraphStyles
>();

const CUSTOM_NODE_NAME = 'react-node';
const DEFAULT_NODE: IDefaultNode = {
    type: CUSTOM_NODE_NAME // 'rect'
};
const DEFAULT_EDGE: IDefaultEdge = {
    type: 'graphin-line' // as any // forcing type since Graphin has an opinion for some reason
};

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

function AddNodes(
    allModels: DtdlInterface[],
    currentModel: DtdlInterface,
    graphData: ICustomGraphData
) {
    const findRelatedNodeIds = (model: DtdlInterface): string[] => {
        // look for any references TO the current model
        const related = allModels
            .filter((x) => {
                if (
                    ensureIsArray(x.extends)?.find(
                        (y) => y['@id'] === model['@id']
                    )
                ) {
                    return true;
                } else if (
                    ensureIsArray(x.contents)?.find(
                        (y) => isDTDLReference(y) && y['@id'] === model['@id']
                    )
                ) {
                    return true;
                }
                return false;
            })
            .map((x) => (x ? x['@id'] : ''));

        const relatedSet = new Set<string>(related);

        // add all the relationships FROM the current model
        ensureIsArray(model.extends).forEach((x) => x && relatedSet.add(x));
        ensureIsArray(model.contents).forEach((x) => {
            isDTDLReference(x) && relatedSet.add(x['@id']);
        });

        // sort them to get consistent ordering across nodes
        const results =
            Array.from(relatedSet.values()).sort(sortCaseInsensitive()) || [];
        return results;
    };
    const relatedNodesKey = findRelatedNodeIds(currentModel).join(',') ?? '';

    // add the model node
    graphData.nodes.push({
        id: currentModel['@id'],
        label: parseModelId(currentModel['@id']).name,
        data: {
            itemType: 'Node',
            id: currentModel['@id'],
            name: parseModelId(currentModel['@id']).name,
            relatedNodesKey: relatedNodesKey
        }
    });
}

function AddEdges(
    model: DtdlInterface,
    data: ICustomGraphData,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FORCE_LAYOUT = {
    type: 'force2',
    animate: true,
    // clustering: true,
    // nodeClusterBy: 'relatedNodesKey',
    nodeSpacing: (node: ICustomNodeConfig) => {
        if (node.data.name.length > 15) {
            return 100;
        }
        return 20;
    },
    nodeSize: 20,
    preventOverlap: true,
    onLayoutEnd: () => {
        console.log('layout end');
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RADIAL_LAYOUT = {
    type: 'radial',
    animate: true,
    workerEnabled: true,
    linkDistance: 100,
    unitRadius: 200,
    nodeSize: 40,
    preventOverlap: true
};

const SampleGraph: React.FC<ISampleGraphProps> = (props) => {
    const { styles } = props;

    // context
    const { oatPageState } = useOatPageContext();

    // hooks
    const graphContainerId = useId('graph-container');
    const theme = useExtendedTheme();

    const data: ICustomGraphData = {
        edges: [],
        nodes: []
    };
    const ontologyModels = (ONTOLOGY_DATA as IOATFile).data.models;
    ontologyModels.forEach((model) => {
        AddNodes(ontologyModels, model, data);
        //add the reference edges
        AddEdges(model, data, theme);
    });

    // contexts

    // state
    const isMounted = useRef(false);

    // hooks

    // callbacks

    // side effects
    useEffect(() => {
        if (!isMounted.current) {
            const node = createNodeFromReact(CustomGraphNode);
            node.linkPoints = {
                top: true,
                bottom: true,
                fill: '#fff'
            };
            const nodeToRegiser = CustomNode;
            Graphin.registerNode(CUSTOM_NODE_NAME, nodeToRegiser, 'rect');
            console.log('registering node', nodeToRegiser);
            isMounted.current = true;
        }
    }, []);

    useEffect(() => {
        const selection = oatPageState.selection;
        if (!selection) {
            return;
        }
        if (selection.contentId) {
            const edge = data.edges.find(
                (x) => x.data.source === selection.contentId
            );
            if (edge) {
                edge.status = { ...edge.status, selected: true };
                logDebugConsole(
                    'info',
                    'Setting edge as selected. {edge}',
                    edge
                );
            } else {
                logDebugConsole(
                    'warn',
                    'Could not find edge. {selection}',
                    selection
                );
            }
        } else {
            const node = data.nodes.find((x) => x.id === selection.modelId);
            if (node) {
                node.status = { ...node.status, selected: true };
                logDebugConsole(
                    'info',
                    'Setting node as selected. {node}',
                    node
                );
            } else {
                logDebugConsole(
                    'warn',
                    'Could not find node. {selection}',
                    selection
                );
            }
        }
    }, [data.edges, data.nodes, oatPageState.selection]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render', data);

    const height = document.getElementById(graphContainerId)?.scrollHeight;
    return (
        <div className={classNames.root}>
            <div className={classNames.graphContainer} id={graphContainerId}>
                <Graphin
                    data={data}
                    defaultEdge={DEFAULT_EDGE}
                    defaultNode={DEFAULT_NODE}
                    height={height}
                    layout={
                        { type: 'preset' }
                        // FORCE_LAYOUT
                        // RADIAL_LAYOUT
                    }
                >
                    <CustomLegend />
                    <CustomClickHandler />
                    <CreateEdge
                        active={false}
                        onClick={() => {
                            alert('clicked');
                        }}
                    />
                </Graphin>
            </div>
        </div>
    );
};

export default styled<
    ISampleGraphProps,
    ISampleGraphStyleProps,
    ISampleGraphStyles
>(SampleGraph, getStyles);
