import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo
} from 'react';
import { useTranslation } from 'react-i18next';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges
} from 'react-flow-renderer';
import BaseComponent from '../BaseComponent/BaseComponent';
import { Theme } from '../../Models/Constants/Enums';
import { useLibTheme } from '../../Theming/ThemeProvider';
import OATGraphCustomNode from './Internal/OATGraphCustomNode';
import OATGraphCustomEdge from './Internal/OATGraphCustomEdge';

import './OATGraphViewer.scss';

type OATGraphViewerProps = {
    elements: [];
    theme?: Theme;
    onHandleElementsUpdate: () => any;
};

const OATGraphViewer = ({
    elements,
    theme,
    onHandleElementsUpdate
}: OATGraphViewerProps) => {
    const { t } = useTranslation();
    const libTheme = useLibTheme();
    const themeToUse = (libTheme || theme) ?? Theme.Light;
    const currentNodeId = useRef('');
    const currentHandle = useRef('');
    const reactFlowWrapper = useRef(null);
    const [elementNodes, setElementNodes] = useState([]);
    const [elementEdges, setElementEdges] = useState([]);
    const [ordered, setOrdered] = useState(true);
    const [updatedElements, setUpdatedElements] = useState(elements);

    useEffect(() => {
        translateInput(elements);
    }, [elements]);

    useEffect(() => {
        if (elements !== updatedElements) {
            onHandleElementsUpdate(updatedElements);
        }
    }, [updatedElements]);

    const nodeTypes = useMemo(() => ({ ModelNode: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(
        () => ({ RelationShipEdge: OATGraphCustomEdge }),
        []
    );

    const onNodesChange = useCallback(
        (changes) => setElementNodes((ns) => applyNodeChanges(changes, ns)),
        []
    );

    const onEdgesChange = useCallback(
        (changes) => setElementEdges((es) => applyEdgeChanges(changes, es)),
        []
    );

    const onConnectStart = (evt, params) => {
        currentNodeId.current = params.nodeId;
        currentHandle.current = params.handleId;
    };

    const onConnectStop = (evt) => {
        let params = {
            source: currentNodeId.current,
            sourceHandle: currentHandle.current,
            label: '',
            arrowHeadType: 'arrowclosed',
            type: 'RelationShipEdge',
            data: {
                name: ''
            }
        };
        let indexId = -1;
        try {
            indexId = evt.path.findIndex((element) => element.dataset.id);
            params.target = evt.path[indexId].dataset.id;
        } catch (error) {
            console.log(error);
        }

        if (indexId < 0) {
            const name = `newNode${elementNodes.length}`;
            const id = name;
            const newNode = {
                id: name,
                type: 'ModelNode',
                position: { x: evt.layerX, y: evt.layerY },
                style: {
                    width: 100
                },
                data: {
                    name: name,
                    type: 'node',
                    id: id,
                    content: []
                }
            };
            params.target = id;
            setElementNodes((es) => es.concat(newNode));
        }
        params = newEdge(params);
        setElementEdges((els) => addEdge(params, els));
    };

    const onLoad = (_reactFlowInstance) => {
        console.log('flow loaded:', _reactFlowInstance);
        _reactFlowInstance.fitView();
    };

    const translateInput = (inputElements) => {
        setElementNodes([]);
        setElementEdges([]);
        let nodes = [];
        const edges = [];
        let initialX = 0;
        let initialY = 0;
        if (inputElements.digitalTwinsModels) {
            inputElements.digitalTwinsModels.map((item) => {
                const nameLength = item.displayName.length + 5;
                const idLength = item['@id'].length + 3;
                const minWidth =
                    20 + (nameLength > idLength ? nameLength : idLength) * 5.5;
                const contents = [];
                item.contents.map((content) => {
                    if (content['@type'] === 'Property') {
                        contents.push(content);
                    }
                });
                const node = {
                    id: item['@id'],
                    type: 'ModelNode',
                    data: {
                        name: item.displayName,
                        type: 'node',
                        content: contents,
                        id: item['@id']
                    },
                    style: {
                        width: minWidth
                    },
                    position: { x: initialX, y: initialY }
                };
                if (!ordered) {
                    if (initialX === 10000) {
                        initialY = initialY + 200;
                        initialX = 0;
                    } else {
                        initialX = initialX + 200;
                    }
                }
                item.contents.map((content) => {
                    if (content['@type'] !== 'Property') {
                        let edge = {
                            id: `${item['@id']}-${content.target}`,
                            source: item['@id'],
                            sourceHandle: content['@type'],
                            target: content.target,
                            label: content.name,
                            data: {
                                name: content.name,
                                type: content['@type']
                            },
                            arrowHeadType: 'arrowclosed'
                        };
                        edge = newEdge(edge);
                        edges.push(edge);
                    }
                });

                nodes.push(node);
            });
            if (ordered) {
                const indexes = getAllUnconectedNodes(nodes, edges);
                initialX = 100;
                initialY = 100;
                indexes.map((item) => {
                    nodes[item].position = { x: initialX, y: initialY };
                    const conectedIndexes = getAllConectedNodes(
                        nodes,
                        edges,
                        nodes[item].id
                    );
                    nodes = setPositionsConectedNodes(
                        nodes,
                        edges,
                        conectedIndexes,
                        item
                    );
                    initialX = initialX + 200;
                });
            }
            setElementNodes([...nodes]);
            setElementEdges([...edges]);
        }
    };

    const translateOutput = () => {
        const nodes = [];
        elementNodes.map((item) => {
            const node = {
                '@id': item.id,
                '@type': 'Interface',
                displayName: item.data.name,
                contents: item.data.content
            };
            nodes.push(node);
        });
        elementEdges.map((item) => {
            const nodeIndex = nodes.findIndex(
                (element) => element['@id'] === item.source
            );
            const relationship = {
                '@type': item.data.type,
                name: item.data.name,
                target: item.target
            };
            nodes[nodeIndex].contents.push(relationship);
        });

        elementNodes.map((item) => {
            const nodeIndex = nodes.findIndex(
                (element) => element['@id'] === item.id
            );
            nodes[nodeIndex]['@id'] = item.data.id;
        });
        setUpdatedElements({ digitalTwinsModels: nodes });
    };

    const newEdge = (params) => {
        switch (params['sourceHandle']) {
            case 'Relationship':
                params['type'] = 'RelationShipEdge';
                params['data']['type'] = params['sourceHandle'];
                break;
            case 'untargeted_relationship':
                params['type'] = 'step';
                params['data']['type'] = params['sourceHandle'];
                params['animated'] = true;
                break;
            case 'extend':
                params['type'] = 'step';
                params['data']['type'] = params['sourceHandle'];
                break;
            case 'component_reference':
                params['type'] = 'floating';
                params['data']['type'] = params['sourceHandle'];
                params['animated'] = true;
                break;
            default:
                break;
        }
        return params;
    };

    function getAllUnconectedNodes(nodes, edges) {
        const indexes = [];
        nodes.map((item) => {
            const index = edges.findIndex(
                (element) => element.target === item.id
            );
            if (index === -1) {
                indexes.push(
                    nodes.findIndex((element) => element.id === item.id)
                );
            }
        });
        return indexes;
    }

    function getAllConectedNodes(nodes, edges, id) {
        const indexes = [];
        nodes.map((item) => {
            const index = edges.findIndex(
                (element) => element.target === item.id && element.source === id
            );
            if (index !== -1) {
                indexes.push(
                    nodes.findIndex((element) => element.id === item.id)
                );
            }
        });
        return indexes;
    }

    function setPositionsConectedNodes(nodes, edges, conectedIndexes, index) {
        if (conectedIndexes.length === 0) {
            return nodes;
        } else {
            let initialX = nodes[index].position.x;
            const initialY = nodes[index].position.y + 200;
            conectedIndexes.map((item) => {
                if (nodes[item].position.x === 0) {
                    nodes[item].position.x = initialX;
                }
                nodes[item].position.y = initialY;
                initialX = initialX + 200;
            });
            conectedIndexes.map((item) => {
                const newConectedIndexes = getAllConectedNodes(
                    nodes,
                    edges,
                    nodes[item].id
                );
                nodes = setPositionsConectedNodes(
                    nodes,
                    edges,
                    newConectedIndexes,
                    item
                );
            });
        }
        return nodes;
    }

    return (
        <BaseComponent theme={themeToUse}>
            <div>
                <ReactFlowProvider>
                    <div
                        className="cb-ontology-graph-viewer-container"
                        ref={reactFlowWrapper}
                    >
                        <ReactFlow
                            nodes={elementNodes}
                            edges={elementEdges}
                            onConnectStart={onConnectStart}
                            onConnectStop={onConnectStop}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onLoad={onLoad}
                            snapToGrid={true}
                            snapGrid={[15, 15]}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                        >
                            <MiniMap />
                            <Controls />
                            <Background color="#aaa" gap={16} />
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>
            </div>
        </BaseComponent>
    );
};

export default OATGraphViewer;
