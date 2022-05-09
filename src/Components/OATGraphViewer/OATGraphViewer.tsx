import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback
} from 'react';
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
    OATElementsLocalStorageKey,
    OATTwinsLocalStorageKey,
    OATPositionsLocalStorageKey,
    OATUntargetedRelationshipName,
    OATRelationshipHandleName,
    OATComponentHandleName,
    OATExtendHandleName,
    OATInterfaceType
} from '../../Models/Constants/Constants';
import {
    getGraphViewerStyles,
    getGraphViewerButtonStyles
} from './OATGraphViewer.styles';
import { ElementsContext } from './Internal/OATContext';
import {
    IOATElementsChangeEventArgs,
    IOATTwinModelNodes,
    IOATNodeElement,
    IOATRelationShipElement
} from '../../Models/Constants/Interfaces';

const idClassBase = 'dtmi:com:example:';
const contextClassBase = 'dtmi:adt:context;2';
const versionClassBase = '1';

type OATGraphProps = {
    onElementsUpdate: (digitalTwinsModels: IOATElementsChangeEventArgs) => any;
    setModel: (twinModel: IOATTwinModelNodes) => any;
    model: IOATTwinModelNodes;
    deletedModelId: string;
    selectedModel: string;
    editedName: string;
    editedId: string;
};

const OATGraphViewer = ({
    onElementsUpdate,
    setModel,
    model,
    deletedModelId,
    selectedModel,
    editedName,
    editedId
}: OATGraphProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const reactFlowWrapperRef = useRef(null);
    const storedElements = JSON.parse(
        localStorage.getItem(OATElementsLocalStorageKey)
    );
    const [elements, setElements] = useState(
        !storedElements ? [] : storedElements
    );
    const [newModelId, setNewModelId] = useState(0);
    const graphViewerStyles = getGraphViewerStyles();
    const buttonStyles = getGraphViewerButtonStyles();
    const currentNodeIdRef = useRef('');
    const currentHandleId = useRef('');

    useEffect(() => {
        //identifies wich is the next model Id on creating new nodes and updates the Local Storage
        let nextModelId = newModelId;
        let index = 0;
        while (index !== -1) {
            index = elements.findIndex(
                (element) =>
                    element.id ===
                    `${idClassBase}model${nextModelId};${versionClassBase}`
            );
            if (index === -1) {
                setNewModelId(nextModelId);
            }
            nextModelId++;
        }
        storeElements();
    }, [elements]);

    useEffect(() => {
        //detect changes outside of the component on the selected model
        const node = elements.find(
            (element) => element.id === currentNodeIdRef.current
        );
        if (node) {
            const newId = model['@id'];
            elements.forEach((x) => {
                if (x.source && x.source === currentNodeIdRef.current) {
                    x.source = newId;
                }
                if (x.target && x.target === currentNodeIdRef.current) {
                    x.target = newId;
                }
            });
            node.id = newId;
            node.data.id = newId;
            node.data.name = model['displayName'];
            node.data.content = model['contents'];
            setElements([...elements]);
            currentNodeIdRef.current = newId;
        }
    }, [model]);

    useEffect(() => {
        //detects when a Model is deleted outside of the component and Updates the elements state
        if (deletedModelId) {
            const elementsToRemove = [
                {
                    id: deletedModelId
                }
            ];
            onElementsRemove(elementsToRemove);
        }
    }, [deletedModelId]);

    useEffect(() => {
        //detects when a Model is selected outside of the component
        const node = elements.find((element) => element.id === selectedModel);
        if (node) {
            currentNodeIdRef.current = node.id;
            const modelClicked = {
                '@id': node.id,
                '@type': node.data.type,
                '@context': node.data.context,
                displayName: node.data.name,
                contents: node.data.content
            };
            setModel(modelClicked);
        }
    }, [selectedModel]);

    useEffect(() => {
        //detects when a Model name is edited outside of the component and Updates the elements state
        const node = elements.find((element) => element.id === selectedModel);
        if (node) {
            node.data.name = editedName;
            const modelClicked = {
                '@id': node.id,
                '@type': node.data.type,
                '@context': node.data.context,
                displayName: node.data.name,
                contents: node.data.content
            };
            setModel(modelClicked);
            setElements([...elements]);
        }
    }, [editedName]);

    useEffect(() => {
        //detects when a Model id is edited outside of the component and Updates the elements state
        const node = elements.find((element) => element.id === selectedModel);
        if (node) {
            elements
                .filter((x) => x.source === currentNodeIdRef.current)
                .forEach((x) => (x.source = editedId));
            elements
                .filter((x) => x.target === currentNodeIdRef.current)
                .forEach((x) => (x.target = editedId));
            node.id = editedId;
            node.data.id = editedId;
            const modelClicked = {
                '@id': node.id,
                '@type': node.data.type,
                '@context': node.data.context,
                displayName: node.data.name,
                contents: node.data.content
            };
            setModel(modelClicked);
            setElements([...elements]);
            currentNodeIdRef.current = editedId;
        }
    }, [editedId]);

    const providerVal = useMemo(
        () => ({ elements, setElements, setModel, setCurrentNode }),
        [elements, setElements, setModel, setCurrentNode]
    );

    const nodeTypes = useMemo(() => ({ Interface: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(() => ({ Relationship: OATGraphCustomEdge }), []);

    const setCurrentNode = (id) => {
        currentNodeIdRef.current = id;
    };

    const onElementsRemove = (elementsToRemove: IOATNodeElement) =>
        //remove an specific node and all related edges
        setElements((els) => removeElements(elementsToRemove, els));

    const onLoad = useCallback(
        (_reactFlowInstance) => _reactFlowInstance.fitView(),
        []
    );

    const onNewModelClick = () => {
        //create a new floating node
        const name = `Model${newModelId}`;
        const id = `${idClassBase}model${newModelId};${versionClassBase}`;
        const newNode = {
            id: id,
            type: OATInterfaceType,
            position: { x: 100, y: 100 },
            data: {
                name: name,
                type: OATInterfaceType,
                id: id,
                content: [],
                context: contextClassBase
            }
        };
        setElements((es) => es.concat(newNode));
    };

    const onNodeDragStop = (evt, node) => {
        //checks if a node is being draged into another node to create a relationship between them
        let targetId = '';
        const areaDistanceX = 60;
        const areaDistanceY = 30;
        elements.forEach((element) => {
            if (
                element.id !== node.id &&
                !element.source &&
                node.position.x - areaDistanceX < element.position.x &&
                element.position.x < node.position.x + areaDistanceX &&
                node.position.y - areaDistanceY < element.position.y &&
                element.position.y < node.position.y + areaDistanceY
            ) {
                targetId = element.id;
            }
        });
        const targetIndex = elements.findIndex(
            (element) => element.id === targetId
        );
        const index = elements.findIndex((element) => element.id === node.id);
        if (targetIndex >= 0) {
            const id = node.id;
            if (node.data.type === elements[targetIndex].data.type) {
                const params: IOATRelationShipElement = {
                    source: node.id,
                    sourceHandle: OATExtendHandleName,
                    target: targetId,
                    label: '',
                    type: OATRelationshipHandleName,
                    data: {
                        name: '',
                        displayName: '',
                        id: `${node.id}${OATExtendHandleName}`,
                        type: OATExtendHandleName
                    }
                };
                setElements((es) => addEdge(params, es));
            } else {
                let sourceId = '';
                if (node.data.type === OATComponentHandleName) {
                    sourceId = targetId;
                    targetId = node.id;
                } else {
                    sourceId = node.id;
                }
                const params: IOATRelationShipElement = {
                    source: sourceId,
                    sourceHandle: OATComponentHandleName,
                    target: targetId,
                    label: '',
                    type: OATRelationshipHandleName,
                    data: {
                        name: '',
                        displayName: '',
                        id: `${sourceId}${OATComponentHandleName}`,
                        type: OATComponentHandleName
                    }
                };
                setElements((es) => addEdge(params, es));
            }
            node.id = id;
        } else {
            elements[index].position = node.position;
            setElements([...elements]);
        }
    };

    const onConnectStart = (evt, params) => {
        //stores values before connection is created
        currentNodeIdRef.current = params.nodeId;
        currentHandleId.current = params.handleId;
    };

    const onConnectStop = (evt) => {
        //retrieves information and creates a desired relationship between nodes
        const params: IOATRelationShipElement = {
            source: currentNodeIdRef.current,
            sourceHandle: currentHandleId.current,
            label: '',
            markerEnd: 'arrow',
            type: OATRelationshipHandleName,
            data: {
                name: '',
                displayName: '',
                id: `${currentNodeIdRef.current}${currentHandleId.current}`,
                type: currentHandleId.current
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
                (element) => element.id === currentNodeIdRef.current
            );
            const componentRelativePosition = 120;

            if (currentHandleId.current === OATRelationshipHandleName) {
                const name = `${node.data.name}:${OATUntargetedRelationshipName}`;
                const id = `${node.id}:${OATUntargetedRelationshipName}`;
                const untargetedRelationship = {
                    '@type': OATRelationshipHandleName,
                    '@id': id,
                    name: '',
                    displayName: ''
                };
                const newNode = {
                    id: id,
                    type: OATInterfaceType,
                    position: {
                        x: node.position.x - componentRelativePosition,
                        y: node.position.y + componentRelativePosition
                    },
                    data: {
                        name: name,
                        type: OATUntargetedRelationshipName,
                        id: id,
                        source: currentNodeIdRef.current,
                        content: [untargetedRelationship]
                    }
                };
                params.target = id;
                params.data.type = `${OATUntargetedRelationshipName}`;
                setElements((es) => [...addEdge(params, es), newNode]);
            }
        }
    };

    const storeElements = () => {
        //save the desire session data into the local storage
        const nodePositions = elements.reduce((collection, element) => {
            if (!element.source) {
                collection.push({
                    id: element.id,
                    position: element.position
                });
            }
            return collection;
        }, []);
        localStorage.setItem(
            OATPositionsLocalStorageKey,
            JSON.stringify({ nodePositions })
        );
        localStorage.setItem(
            OATElementsLocalStorageKey,
            JSON.stringify(elements)
        );
    };

    const translatedOutput = useMemo(() => {
        //creates the json object in the DTDL standard based on the content of the nodes
        const outputObject = elements;
        const nodes = outputObject.reduce((currentNodes, currentNode) => {
            if (currentNode.data.type === OATInterfaceType) {
                const node = {
                    '@id': currentNode.id,
                    '@type': OATInterfaceType,
                    displayName: currentNode.data.name,
                    contents: [...currentNode.data.content]
                };
                currentNodes.push(node);
            } else if (currentNode.data.type === OATRelationshipHandleName) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                const targetModelName = /[^:]*$/.exec(currentNode.target)[0]; // Get substring after last ':' character
                const relationshipId = `${currentNode.data.id}_${targetModelName}`; // Unique relationship id

                const relationship = {
                    '@type': currentNode.data.type,
                    '@id': relationshipId,
                    name: currentNode.data.name,
                    displayName: currentNode.data.displayName,
                    target: currentNode.target
                };
                const found = sourceNode.contents.find(
                    (element) => element['@id'] === relationshipId
                );

                if (!found) {
                    sourceNode.contents = [
                        ...sourceNode.contents,
                        relationship
                    ];
                }
            } else if (currentNode.data.type === OATExtendHandleName) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                sourceNode.extends = currentNode.target;
            } else if (currentNode.data.type === OATComponentHandleName) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                const targetNode = elements.find(
                    (element) => element['id'] === currentNode.target
                );
                const component = {
                    '@type': currentNode.data.type,
                    name: targetNode.data.name,
                    schema: currentNode.target
                };
                sourceNode.contents = [...sourceNode.contents, component];
            } else if (
                currentNode.data.type === OATUntargetedRelationshipName &&
                currentNode.type === OATRelationshipHandleName
            ) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                const relationship = {
                    '@type': currentNode.data.type,
                    '@id': currentNode.data.id,
                    name: currentNode.data.name,
                    displayName: currentNode.data.name
                };
                sourceNode.contents = [...sourceNode.contents, relationship];
            }
            return currentNodes;
        }, []);

        return nodes;
    }, [elements]);

    useEffect(() => {
        //sends information to the page with the DTDL json
        localStorage.setItem(
            OATTwinsLocalStorageKey,
            JSON.stringify({ digitalTwinsModels: translatedOutput })
        );
        onElementsUpdate({ digitalTwinsModels: translatedOutput });
    }, [translatedOutput]);

    const onElementClick = (evt, node) => {
        //checks if a node is selected to display it in the property editor
        if (node.data.type === OATInterfaceType && translatedOutput) {
            currentNodeIdRef.current = node.id;

            const currentModel = translatedOutput.find(
                (model) => model['@id'] === node.id
            );

            const extendsItems = elements
                .filter(
                    (element) =>
                        element.type === OATExtendHandleName &&
                        element?.source === node.id
                )
                .map((element) => element.target);

            const selectedModel = {
                '@id': node.id,
                '@type': node.data.type,
                '@context': node.data.context,
                displayName: node.data.name,
                contents: currentModel.contents,
                extends: extendsItems ? extendsItems : null
            };
            setModel(selectedModel);
        }
    };

    return (
        <BaseComponent theme={theme}>
            <>
                <ReactFlowProvider>
                    <div
                        className={graphViewerStyles.container}
                        ref={reactFlowWrapperRef}
                    >
                        <ElementsContext.Provider value={providerVal}>
                            <ReactFlow
                                elements={elements}
                                onElementClick={onElementClick}
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
                                    styles={buttonStyles}
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
            </>
        </BaseComponent>
    );
};

OATGraphViewer.defaultProps = {
    onElementsUpdate: () => null,
    setModel: () => null
};

export default OATGraphViewer;
