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

import './OATGraphViewer.scss';

const OATGraphViewer = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const reactFlowWrapper = useRef(null);
    const [storedElements] = useState(
        JSON.parse(localStorage.getItem('elements'))
    );
    const [elements, setElements] = useState(
        storedElements === null ? [] : storedElements
    );
    const [idClass] = useState('dtmi:com:example:');
    const [newModelId, setNewModelId] = useState(0);

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
        elements.map((item) => {
            item.data['onDeleteNode'] = { onDeleteNode };
            item.data['onUpdateNode'] = { onUpdateNode };
        });
        localStorage.setItem('elements', JSON.stringify(elements));
    }, [elements]);

    const onDeleteNode = (id) => {
        const elementsToRemove = [
            {
                id: id
            }
        ];
        setElements((els) => removeElements(elementsToRemove, els));
    };

    const onUpdateNode = (prevId, id) => {
        const index = elements.findIndex((element) => element.id === prevId);
        elements[index].id = id;
        localStorage.setItem('elements', JSON.stringify(elements));
    };

    const onConnect = (evt) => {
        const params = {
            source: evt.source,
            target: evt.target,
            label: '',
            arrowHeadType: 'arrowclosed',
            type: 'RelationShipEdge',
            data: {
                name: ''
            }
        };
        setElements((els) => addEdge(params, els));
    };

    const nodeTypes = useMemo(() => ({ Interface: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(
        () => ({ RelationShipEdge: OATGraphCustomEdge }),
        []
    );

    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));

    const onLoad = (_reactFlowInstance) => {
        _reactFlowInstance.fitView();
    };

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
        localStorage.setItem('elements', JSON.stringify(elements));
    };

    return (
        <BaseComponent theme={theme}>
            <div>
                <ReactFlowProvider>
                    <div
                        className="cb-oat-graph-viewer-container"
                        ref={reactFlowWrapper}
                    >
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
                                className="cb-oat-graph-viewer-button"
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
                    </div>
                </ReactFlowProvider>
            </div>
        </BaseComponent>
    );
};

export default OATGraphViewer;
