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
import { ElementsLocalStorageKey } from '../../Models/Constants/Constants';
import { getGraphViewerStyles } from './OATGraphViewer.styles';
import { ElementsContext } from './Internal/OATContext';

const OATGraphViewer = () => {
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
        localStorage.setItem(ElementsLocalStorageKey, JSON.stringify(elements));
    }, [elements]);

    const onConnect = (evt) => {
        const params = {
            source: evt.source,
            target: evt.target,
            label: '',
            arrowHeadType: 'arrowclosed',
            type: 'RelationshipEdge',
            data: {
                name: '',
                id: `${evt.source}${evt.target}RelationshipEdge`,
                type: 'RelationshipEdge'
            }
        };
        setElements((els) => addEdge(params, els));
    };

    const providerVal = useMemo(() => ({ elements, setElements }), [
        elements,
        setElements
    ]);

    const nodeTypes = useMemo(() => ({ Interface: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(
        () => ({ RelationshipEdge: OATGraphCustomEdge }),
        []
    );

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
                                onConnect={onConnect}
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
