import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme, PrimaryButton } from '@fluentui/react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    removeElements
} from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATGraphCustomNode from './Internal/OATGraphCustomNode';
import OATGraphCustomEdge from './Internal/OATGraphCustomEdge';
import {
    ElementsLocalStorageKey,
    TwinsLocalStorageKey
} from '../../Models/Constants/Constants';
import { getGraphViewerStyles } from './OATGraphViewer.styles';
import { ElementsContext } from './Internal/OATContext';

type OATGraphProps = {
    onHandleElementsUpdate: () => any;
};

const OATGraphViewer = ({ onHandleElementsUpdate }: OATGraphProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const reactFlowWrapperRef = useRef(null);
    const storedElements = JSON.parse(
        localStorage.getItem(ElementsLocalStorageKey)
    );
    const [elements, setElements] = useState(
        storedElements === null ? [] : storedElements
    );
    const idClass = 'dtmi:com:example:';
    const [newModelId, setNewModelId] = useState(0);
    const graphViewerStyles = getGraphViewerStyles();
    const currentNodeId = useRef('');

    useEffect(() => {
        let nextModelId = newModelId;
        let index = 0;
        while (index !== -1) {
            index = elements.findIndex(
                (element) => element.id === `${idClass}model${nextModelId}`
            );
            if (index === -1) {
                setNewModelId(nextModelId);
            }
            nextModelId++;
        }
        localStorage.setItem(ElementsLocalStorageKey, JSON.stringify(elements));
        translateOutput();
    }, [elements]);

    const providerVal = useMemo(() => ({ elements, setElements }), [
        elements,
        setElements
    ]);

    const nodeTypes = useMemo(() => ({ Interface: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(() => ({ Relationship: OATGraphCustomEdge }), []);

    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));

    const onLoad = (_reactFlowInstance) => _reactFlowInstance.fitView();

    const onNewModelClick = () => {
        const name = `Model${newModelId}`;
        const id = `${idClass}model${newModelId}`;
        const newNode = {
            id: id,
            type: 'Interface',
            position: { x: 100, y: 100 },
            data: {
                name: name,
                type: 'Interface',
                id: id,
                content: []
            }
        };
        setElements((es) => es.concat(newNode));
    };

    const onNodeDragStop = (evt, node) => {
        const index = elements.findIndex((element) => element.id === node.id);
        elements[index].position = node.position;
        setElements([...elements]);
    };

    const onConnectStart = (evt, params) => {
        currentNodeId.current = params.nodeId;
    };

    const onConnectStop = (evt) => {
        const params = {
            source: currentNodeId.current,
            label: '',
            arrowHeadType: 'arrowclosed',
            type: 'Relationship',
            data: {
                name: '',
                displayName: '',
                id: `${currentNodeId.current}Relationship`,
                type: 'Relationship'
            }
        };
        try {
            const indexId = evt.path.findIndex((element) => element.dataset.id);
            params.target = evt.path[indexId].dataset.id;
            setElements((els) => addEdge(params, els));
        } catch (error) {
            const nodeIndex = elements.findIndex(
                (element) => element.id === currentNodeId.current
            );
            const untargetedRelationship = {
                '@type': 'Relationship',
                '@id': `${currentNodeId.current}Relationship`,
                name: '',
                displayName: ''
            };
            elements[nodeIndex].data['content'] = [
                ...elements[nodeIndex].data['content'],
                untargetedRelationship
            ];
            setElements([...elements]);
        }
    };

    const translateOutput = () => {
        const outputObject = elements;
        const nodes = [];
        outputObject.map((item) => {
            if (item.position) {
                const node = {
                    '@id': item.id,
                    '@type': 'Interface',
                    displayName: item.data.name,
                    contents: [...item.data.content]
                };
                nodes.push(node);
            } else if (item.source) {
                const nodeIndex = nodes.findIndex(
                    (element) => element['@id'] === item.source
                );
                const relationship = {
                    '@type': item.data.type,
                    '@id': item.data.id,
                    name: item.data.name,
                    displayName: item.data.displayName,
                    target: item.target
                };
                nodes[nodeIndex].contents = [
                    ...nodes[nodeIndex].contents,
                    relationship
                ];
            }
        });
        localStorage.setItem(
            TwinsLocalStorageKey,
            JSON.stringify({ digitalTwinsModels: nodes })
        );
        onHandleElementsUpdate({ digitalTwinsModels: nodes });
    };

    return (
        <BaseComponent theme={theme}>
            <div>
                <ReactFlowProvider>
                    <div
                        className={graphViewerStyles.container}
                        ref={reactFlowWrapperRef}
                    >
                        <ElementsContext.Provider value={providerVal}>
                            <ReactFlow
                                elements={elements}
                                onElementsRemove={onElementsRemove}
                                onConnectStart={onConnectStart}
                                onConnectStop={onConnectStop}
                                onLoad={onLoad}
                                snapToGrid={true}
                                snapGrid={[15, 15]}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                onNodeDragStop={onNodeDragStop}
                            >
                                <PrimaryButton
                                    className={graphViewerStyles.button}
                                    onClick={onNewModelClick}
                                    text={t('OATGraphViewer.newModel')}
                                />
                                <MiniMap />
                                <Controls />
                                <Background
                                    color={theme.semanticColors.bodyBackground}
                                    gap={16}
                                />
                            </ReactFlow>
                        </ElementsContext.Provider>
                    </div>
                </ReactFlowProvider>
            </div>
        </BaseComponent>
    );
};

export default OATGraphViewer;
