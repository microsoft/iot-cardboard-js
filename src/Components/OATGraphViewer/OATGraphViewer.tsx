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
    TwinsLocalStorageKey,
    PositionsLocalStorageKey
} from '../../Models/Constants/Constants';
import { getGraphViewerStyles } from './OATGraphViewer.styles';
import { ElementsContext } from './Internal/OATContext';
import { IOATElementsChangeEventArgs } from '../../Models/Constants/Interfaces';

type OATGraphProps = {
    onElementsUpdate: (digitalTwinsModels: IOATElementsChangeEventArgs) => any;
};

const OATGraphViewer = ({ onElementsUpdate }: OATGraphProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const reactFlowWrapperRef = useRef(null);
    const storedElements = JSON.parse(
        localStorage.getItem(ElementsLocalStorageKey)
    );
    const [elements, setElements] = useState(
        storedElements === null ? [] : storedElements
    );
    const idClassBase = 'dtmi:com:example:';
    const [newModelId, setNewModelId] = useState(0);
    const graphViewerStyles = getGraphViewerStyles();
    const currentNodeId = useRef('');

    useEffect(() => {
        let nextModelId = newModelId;
        let index = 0;
        while (index !== -1) {
            index = elements.findIndex(
                (element) => element.id === `${idClassBase}model${nextModelId}`
            );
            if (index === -1) {
                setNewModelId(nextModelId);
            }
            nextModelId++;
        }
        storeElements();
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
        const id = `${idClassBase}model${newModelId}`;
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
        elements.find((element) => element.id === node.id).position =
            node.position;
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
        const target = (evt.path || []).find(
            (element) => element.dataset && element.dataset.id
        );
        if (target) {
            params.target = target.dataset.id;
            setElements((els) => addEdge(params, els));
        } else {
            const node = elements.find(
                (element) => element.id === currentNodeId.current
            );
            const untargetedRelationship = {
                '@type': 'Relationship',
                '@id': `${currentNodeId.current}Relationship`,
                name: '',
                displayName: ''
            };
            node.data['content'] = [
                ...node.data['content'],
                untargetedRelationship
            ];
            setElements([...elements]);
        }
    };

    const storeElements = () => {
        const nodePositions = [];
        elements.reduce((initial, element) => {
            if (initial) {
                nodePositions.push({
                    id: initial.id,
                    position: initial.position
                });
            }
            if (!element.source) {
                nodePositions.push({
                    id: element.id,
                    position: element.position
                });
            }
        });
        localStorage.setItem(
            PositionsLocalStorageKey,
            JSON.stringify({ nodePositions })
        );
        localStorage.setItem(ElementsLocalStorageKey, JSON.stringify(elements));
    };

    const translateOutput = () => {
        const outputObject = elements;
        const nodes = outputObject.reduce((currentNodes, currentNode) => {
            if (currentNode.position) {
                const node = {
                    '@id': currentNode.id,
                    '@type': 'Interface',
                    displayName: currentNode.data.name,
                    contents: [...currentNode.data.content]
                };
                currentNodes.push(node);
            } else if (currentNode.source) {
                const node = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                const relationship = {
                    '@type': currentNode.data.type,
                    '@id': currentNode.data.id,
                    name: currentNode.data.name,
                    displayName: currentNode.data.displayName,
                    target: currentNode.target
                };
                node.contents = [...node.contents, relationship];
            }
            return currentNodes;
        }, []);
        localStorage.setItem(
            TwinsLocalStorageKey,
            JSON.stringify({ digitalTwinsModels: nodes })
        );
        onElementsUpdate({ digitalTwinsModels: nodes });
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

OATGraphViewer.defaultProps = {
    onElementsUpdate: () => null
};

export default OATGraphViewer;
