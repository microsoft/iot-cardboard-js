import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    useContext
} from 'react';
import {
    useTheme,
    PrimaryButton,
    Label,
    Toggle,
    Stack,
    SpinnerSize,
    Spinner,
    IconButton
} from '@fluentui/react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    Edge
} from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import OATGraphCustomNode from './Internal/OATGraphCustomNode';
import OATGraphCustomEdge from './Internal/OATGraphCustomEdge';
import {
    OATUntargetedRelationshipName,
    OATRelationshipHandleName,
    OATExtendHandleName,
    OATInterfaceType,
    OATComponentHandleName,
    OATNamespaceDefaultValue
} from '../../Models/Constants/Constants';
import {
    getGraphViewerStyles,
    getGraphViewerButtonStyles,
    getGraphViewerWarningStyles,
    getGraphViewerMinimapStyles,
    getGraphViewerFiltersStyles,
    getGraphForceLayoutStyles
} from './OATGraphViewer.styles';
import { ElementsContext } from './Internal/OATContext';
import {
    SET_OAT_SELECTED_MODEL,
    SET_OAT_MODELS,
    SET_OAT_MODELS_POSITIONS,
    SET_OAT_ERROR
} from '../../Models/Constants/ActionTypes';
import { IOATNodeElement } from '../../Models/Constants/Interfaces';
import { ElementNode } from './Internal/Classes/ElementNode';
import { ElementEdge } from './Internal/Classes/ElementEdge';
import { deepCopy } from '../../Models/Services/Utils';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    forceSimulation,
    forceLink,
    forceX,
    forceY,
    forceCenter,
    forceCollide
} from 'd3-force';
import { ConnectionParams } from './Internal/Classes/ConnectionParams';
import { GraphViewerConnectionEvent } from './Internal/Interfaces';
import { OATGraphProps } from './OATGraphViewer.types';
import { DtdlInterface, DtdlRelationship } from '../../Models/Constants';
import { IModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';

const contextClassBase = 'dtmi:dtdl:context;2';
const versionClassBase = '1';
const defaultNodePosition = 25;
const nodeWidth = 300;
const nodeHeight = 100;
const maxInheritanceQuantity = 2;
const newNodeLeft = 20;
const newNodeOffset = 10;

const OATGraphViewer = ({ state, dispatch }: OATGraphProps) => {
    const { execute } = useContext(CommandHistoryContext);
    const { model, models, importModels, modelPositions, namespace } = state;

    const idClassBase = `dtmi:${
        namespace ? namespace : OATNamespaceDefaultValue
    }:`;

    const getNextRelationshipAmount = (relationshipArray: ElementEdge[]) => {
        let relationshipAmount = 0;
        while (
            relationshipArray.some(
                (element) =>
                    element.source &&
                    element.id ===
                        `${idClassBase}${OATRelationshipHandleName}${relationshipAmount};${versionClassBase}`
            )
        ) {
            relationshipAmount++;
        }
        return relationshipAmount;
    };

    //  Converts the stored models to a graph nodes
    const getGraphViewerElementsFromModels = (
        models: DtdlInterface[],
        modelPositions: IModelPosition[]
    ) => {
        if (!models || !modelPositions) {
            return [];
        }

        // Format models
        const modelsCopy = deepCopy(models);
        return modelsCopy.reduce((elements, input) => {
            let relationships = [];
            const contents = [];

            if (input.contents) {
                // Get the relationships
                input.contents.forEach((content) => {
                    const handleTargetedRelation = () => {
                        const relationship = new ElementEdge(
                            content['@id']
                                ? content['@id']
                                : `${
                                      input['@id']
                                  }${OATRelationshipHandleName}${getNextRelationshipAmount(
                                      relationships
                                  )};${versionClassBase}`,
                            '',
                            OATRelationshipHandleName,
                            '',
                            input['@id'],
                            OATRelationshipHandleName,
                            content['target'],
                            OATRelationshipHandleName,
                            {
                                '@id': content['@id']
                                    ? content['@id']
                                    : `${
                                          input['@id']
                                      }${OATRelationshipHandleName}${getNextRelationshipAmount(
                                          relationships
                                      )};${versionClassBase}`,
                                '@type': OATRelationshipHandleName,
                                name: content.name,
                                displayName: content.displayName
                            }
                        );
                        relationships.push(relationship);
                    };

                    const handleUntargetedRelation = () => {
                        const id = `${input['@id']}:${OATUntargetedRelationshipName}`;
                        const rp = modelPositions.find((x) => x['@id'] === id);
                        const newNode = new ElementNode(
                            id,
                            input['@type'],
                            {
                                x: rp ? rp.position.x : defaultNodePosition,
                                y: rp ? rp.position.y : defaultNodePosition
                            },
                            {
                                '@id': id,
                                '@type': OATUntargetedRelationshipName,
                                '@context': contextClassBase,
                                displayName: '',
                                contents: []
                            }
                        );
                        const relationship = new ElementEdge(
                            content['@id']
                                ? content['@id']
                                : `${input['@id']}${OATUntargetedRelationshipName}${id}`,
                            '',
                            '',
                            OATRelationshipHandleName,
                            input['@id'],
                            OATUntargetedRelationshipName,
                            id,
                            OATUntargetedRelationshipName,
                            {
                                '@id': content['@id']
                                    ? content['@id']
                                    : `${input['@id']}${OATUntargetedRelationshipName}${id}`,
                                '@type': OATUntargetedRelationshipName,
                                name: content.name,
                                displayName: content.displayName
                            }
                        );

                        relationships = [
                            ...relationships,
                            newNode,
                            relationship
                        ];
                    };

                    const handleComponentRelation = () => {
                        const componentRelationship = new ElementEdge(
                            `${input['@id']}${OATComponentHandleName}${content.schema}`,
                            '',
                            OATRelationshipHandleName,
                            '',
                            input['@id'],
                            OATComponentHandleName,
                            content.schema as string,
                            OATComponentHandleName,
                            {
                                '@id': `${input['@id']}${OATComponentHandleName}${content.schema}`,
                                '@type': OATComponentHandleName,
                                name: content['name'],
                                displayName: ''
                            }
                        );
                        relationships = [
                            ...relationships,
                            componentRelationship
                        ];
                    };

                    switch (content['@type']) {
                        case OATComponentHandleName:
                            handleComponentRelation();
                            break;
                        case OATRelationshipHandleName:
                            if (content.target) {
                                handleTargetedRelation();
                            } else {
                                handleUntargetedRelation();
                            }
                            break;
                        default:
                            contents.push(content);
                            break;
                    }
                });
            }
            if (input.extends) {
                (Array.isArray(input.extends)
                    ? input.extends
                    : [input.extends]
                ).forEach((extend) => {
                    const relationship = new ElementEdge(
                        `${input['@id']}${OATExtendHandleName}${extend}`,
                        '',
                        OATRelationshipHandleName,
                        '',
                        input['@id'],
                        OATExtendHandleName,
                        extend,
                        OATExtendHandleName,
                        {
                            '@id': `${input['@id']}${OATExtendHandleName}${extend}`,
                            '@type': OATExtendHandleName,
                            name: ''
                        }
                    );
                    relationships.push(relationship);
                });
            }

            const mp = modelPositions.find((x) => x['@id'] === input['@id']);
            const newNode = new ElementNode(
                input['@id'],
                input['@type'],
                {
                    x: mp ? mp.position.x : defaultNodePosition,
                    y: mp ? mp.position.y : defaultNodePosition
                },
                input
            );
            elements.push(newNode, ...relationships);
            return elements;
        }, []);
    };

    const { t } = useTranslation();
    const theme = useTheme();
    const reactFlowWrapperRef = useRef(null);
    const [elements, setElements] = useState(
        getGraphViewerElementsFromModels(models, modelPositions)
    );
    const [newModelId, setNewModelId] = useState(0);
    const graphViewerStyles = getGraphViewerStyles();
    const buttonStyles = getGraphViewerButtonStyles();
    const warningStyles = getGraphViewerWarningStyles();
    const graphViewerMinimapStyles = getGraphViewerMinimapStyles();
    const graphViewerFiltersStyles = getGraphViewerFiltersStyles();
    const graphForceLayoutStyles = getGraphForceLayoutStyles();
    const currentNodeIdRef = useRef(null);
    const currentHandleIdRef = useRef(null);
    const [currentHovered, setCurrentHovered] = useState(null);
    const [showRelationships, setShowRelationships] = useState(true);
    const [showInheritances, setShowInheritances] = useState(true);
    const [showComponents, setShowComponents] = useState(true);
    const [rfInstance, setRfInstance] = useState(null);
    const [loading, setLoading] = useState(false);

    const applyLayoutToElements = (inputElements) => {
        const nodes = inputElements.reduce((collection, element) => {
            if (!element.source) {
                collection.push({
                    id: element.id,
                    x: element.position.x + nodeWidth / 2,
                    y: element.position.y + nodeHeight / 2
                });
            }
            return collection;
        }, []);

        const links = inputElements.reduce((collection, element) => {
            if (element.source) {
                collection.push({
                    source: element.source,
                    target: element.target
                });
            }
            return collection;
        }, []);

        forceSimulation(nodes)
            .force(
                'link',
                forceLink(links)
                    .id((d) => d.id)
                    .distance(nodeWidth)
                    .strength(1)
            )
            .force(
                'collide',
                forceCollide()
                    .radius(nodeWidth / 2)
                    .strength(1)
            )
            .force('x', forceX())
            .force('y', forceY())
            .force('center', forceCenter())
            .on('end', () => {
                const newElements = inputElements.map((element) => {
                    const node = nodes.find(
                        (node) => !element.source && node.id === element.id
                    );

                    const newElement = { ...element };
                    if (node) {
                        newElement.position = {
                            x: node.x - nodeWidth / 2 + Math.random() / 1000,
                            y: node.y - nodeHeight / 2
                        };
                    }

                    return newElement;
                });

                const application = () => {
                    setElements(newElements);
                    setLoading(false);
                };

                const undoApplication = () => {
                    setElements(inputElements);
                };

                execute(application, undoApplication);
                rfInstance.fitView();
            });
    };

    useEffect(() => {
        // Identifies which is the next model Id on creating new nodes and updates the Local Storage
        let nextModelId = 0;
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

    // Update graph nodes and edges when the models are updated
    useEffect(() => {
        const potentialElements = getGraphViewerElementsFromModels(
            models,
            modelPositions
        );

        if (JSON.stringify(potentialElements) !== JSON.stringify(elements)) {
            setElements(potentialElements);
        }
    }, [models]);

    useEffect(() => {
        // Detect changes outside of the component on the selected model
        if (!model) {
            currentNodeIdRef.current = '';
        } else {
            const node = elements.find(
                (element) => element.id === model['@id']
            );

            if (!node && model['@type'] === OATRelationshipHandleName) {
                currentNodeIdRef.current = model['@id'];
            }

            if (node && !node.source) {
                // Interface
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
                node.data = model;
                setElements([...elements]);
                currentNodeIdRef.current = newId;
            } else if (node && node.source) {
                // Relationship
                const newId = model['@id'];
                if (node.sourceHandle === OATComponentHandleName) {
                    elements.find(
                        (element) => element.id === node.target
                    ).data.name = model['name'];
                }
                node.id = newId;
                node.data = model;
                setElements([...elements]);
                currentNodeIdRef.current = newId;
            }
        }
    }, [model]);

    useEffect(() => {
        if (importModels && importModels.length > 0) {
            setLoading(true);
        }
        if (importModels.length > 0) {
            const potentialElements = getGraphViewerElementsFromModels(
                importModels,
                modelPositions
            );
            applyLayoutToElements([...potentialElements]);
        }
    }, [importModels]);

    const providerVal = useMemo(
        () => ({
            dispatch,
            currentNodeIdRef,
            currentHovered,
            showRelationships,
            showInheritances,
            showComponents,
            state
        }),
        [
            dispatch,
            currentNodeIdRef,
            currentHovered,
            showRelationships,
            showInheritances,
            showComponents,
            state
        ]
    );

    const nodeTypes = useMemo(() => ({ Interface: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(() => ({ Relationship: OATGraphCustomEdge }), []);

    const onLoad = useCallback((_reactFlowInstance: any) => {
        _reactFlowInstance.fitView();
        _reactFlowInstance.zoomOut();
        _reactFlowInstance.zoomOut();
        setRfInstance(_reactFlowInstance);
    }, []);

    const getNewNodePosition = (coordinates) => {
        // Find the amount of nodes at the same position
        const nodesAtPosition = elements.filter(
            (element) =>
                !element.source &&
                element.position.x === coordinates.x &&
                element.position.y === coordinates.y
        );

        // If there is no node at the same position, return the coordinates
        if (nodesAtPosition.length === 0) {
            return coordinates;
        }
        // Define the new coordinates
        const newCoordinates = {
            x: coordinates.x + nodesAtPosition.length * newNodeOffset,
            y: coordinates.y + nodesAtPosition.length * newNodeOffset
        };
        // Prevent nodes with the same position
        return getNewNodePosition(newCoordinates);
    };

    const onNewModelClick = (event) => {
        const onNewNode = () => {
            // Create a new floating node
            const name = `Model${newModelId}`;
            const id = `${idClassBase}model${newModelId};${versionClassBase}`;
            let startPositionCoordinates = event.target.getBoundingClientRect();
            startPositionCoordinates = rfInstance.project({
                x: newNodeLeft,
                y: startPositionCoordinates.y
            });
            const newNode = new ElementNode(
                id,
                OATInterfaceType,
                getNewNodePosition(startPositionCoordinates),
                {
                    '@id': id,
                    '@context': contextClassBase,
                    '@type': OATInterfaceType,
                    displayName: name,
                    contents: []
                }
            );
            setElements([...elements, newNode]);
        };

        const undoOnNewNode = () => {
            setElements(elements);
        };

        if (!state.modified) {
            execute(onNewNode, undoOnNewNode);
        }
    };

    const onNodeDragStop = (
        evt: React.MouseEvent<Element, MouseEvent>,
        node: IOATNodeElement
    ) => {
        // Checks if a node is being dragged into another node to create a relationship between them
        let targetId = '';
        const areaDistanceX = 60;
        const areaDistanceY = 30;
        const onStop = (node) => {
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
            if (targetIndex >= 0) {
                if (
                    node.data['@type'] === elements[targetIndex].data['@type']
                ) {
                    const params = new ElementEdge(
                        null,
                        '',
                        '',
                        OATRelationshipHandleName,
                        node.id,
                        OATExtendHandleName,
                        targetId,
                        OATExtendHandleName,
                        {
                            '@id': `${node.id}${OATExtendHandleName}`,
                            '@type': OATExtendHandleName,
                            name: '',
                            displayName: ''
                        }
                    );
                    setElements((es) => addEdge(params, es));
                } else {
                    let sourceId = '';
                    if (node.data.type === OATComponentHandleName) {
                        sourceId = targetId;
                        targetId = node.id;
                    } else {
                        sourceId = node.id;
                    }
                    const params = new ElementEdge(
                        null,
                        '',
                        '',
                        OATRelationshipHandleName,
                        sourceId,
                        OATComponentHandleName,
                        targetId,
                        OATComponentHandleName,
                        {
                            '@id': `${sourceId}${OATComponentHandleName}`,
                            '@type': OATComponentHandleName,
                            name: '',
                            displayName: ''
                        }
                    );
                    setElements((es) => addEdge(params, es));
                }
            } else {
                const index = elements.findIndex(
                    (element) => element.id === node.id
                );
                elements[index].position = { ...node.position };
                setElements([...elements]);
            }
        };

        const undoOnStop = () => {
            const previousPositions = getGraphViewerElementsFromModels(
                models,
                modelPositions
            );

            setElements(previousPositions);
        };

        execute(() => onStop(node), undoOnStop);
    };

    const onConnectStart = (
        evt: React.MouseEvent<Element, MouseEvent>,
        params: ConnectionParams
    ) => {
        // Stores values before connection is created
        currentNodeIdRef.current = params.handleId ? params.nodeId : null;
        currentHandleIdRef.current = params.handleId ? params.handleId : null;
    };

    const onConnectStop = (evt: GraphViewerConnectionEvent) => {
        // Retrieves information and creates a desired relationship between nodes
        const params = new ElementEdge(
            null,
            '',
            OATRelationshipHandleName,
            'arrow',
            currentNodeIdRef.current,
            currentHandleIdRef.current,
            null,
            currentHandleIdRef.current,
            {
                '@id': `${currentNodeIdRef.current}${currentHandleIdRef.current}`,
                '@type': currentHandleIdRef.current,
                name: '',
                displayName: ''
            }
        );
        const target = (evt.path || []).find(
            (element) => element.dataset && element.dataset.id
        );
        if (target) {
            if (currentHandleIdRef.current !== OATUntargetedRelationshipName) {
                const addition = () => {
                    params.id = `${idClassBase}${OATRelationshipHandleName}${getNextRelationshipAmount(
                        elements
                    )};${versionClassBase}`;
                    params.target = target.dataset.id;
                    params.data[
                        '@id'
                    ] = `${idClassBase}${OATRelationshipHandleName}${getNextRelationshipAmount(
                        elements
                    )};${versionClassBase}`;
                    params.data.name = OATRelationshipHandleName
                        ? `${OATRelationshipHandleName}_${getNextRelationshipAmount(
                              elements
                          )}`
                        : '';
                    params.data.target = target.dataset.id;
                    setElements((els) => addEdge(params, els));
                };

                const undoAddition = () => {
                    setElements(elements);
                };

                execute(addition, undoAddition);
            }
        } else {
            const node = elements.find(
                (element) => element.id === currentNodeIdRef.current
            );

            if (currentHandleIdRef.current === OATUntargetedRelationshipName) {
                const addition = () => {
                    const id = `${node.id}:${OATUntargetedRelationshipName}`;
                    const paramId = `${idClassBase}${OATRelationshipHandleName}${getNextRelationshipAmount(
                        elements
                    )};${versionClassBase}`;
                    const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
                    const position = rfInstance.project({
                        x: evt.clientX - reactFlowBounds.left,
                        y: evt.clientY - reactFlowBounds.top
                    });
                    const newNode = new ElementNode(
                        id,
                        OATInterfaceType,
                        position,
                        {
                            '@id': id,
                            '@type': OATUntargetedRelationshipName,
                            '@context': contextClassBase,
                            displayName: '',
                            contents: []
                        }
                    );
                    params.target = id;
                    params.id = paramId;
                    params.data['@id'] = paramId;
                    params.data['@type'] = OATUntargetedRelationshipName;
                    params.data.name = `${OATRelationshipHandleName}_${getNextRelationshipAmount(
                        elements
                    )}`;
                    setElements((es) => addEdge(params, [...es, newNode]));
                };

                const undoAddition = () => {
                    setElements(elements);
                };

                execute(addition, undoAddition);
            }
            if (
                currentHandleIdRef.current === OATComponentHandleName ||
                currentHandleIdRef.current === OATExtendHandleName ||
                currentHandleIdRef.current === OATRelationshipHandleName
            ) {
                const addition = () => {
                    const name = `Model${newModelId}`;
                    const id = `${idClassBase}model${newModelId};${versionClassBase}`;
                    const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
                    const position = rfInstance.project({
                        x: evt.clientX - reactFlowBounds.left,
                        y: evt.clientY - reactFlowBounds.top
                    });
                    const newNode = new ElementNode(
                        id,
                        OATInterfaceType,
                        position,
                        {
                            '@id': id,
                            '@type': OATInterfaceType,
                            '@context': contextClassBase,
                            displayName: name,
                            contents: []
                        }
                    );
                    // On untargeted extends, the target is the node
                    if (currentHandleIdRef.current === OATExtendHandleName) {
                        params.target = params.source;
                        params.source = id;
                    } else {
                        params.target = id;
                        params.data.target = id;
                    }
                    params.id = `${idClassBase}${OATRelationshipHandleName}${getNextRelationshipAmount(
                        elements
                    )};${versionClassBase}`;
                    params.data[
                        '@id'
                    ] = `${idClassBase}${OATRelationshipHandleName}${getNextRelationshipAmount(
                        elements
                    )};${versionClassBase}`;
                    params.data['@type'] = currentHandleIdRef.current;
                    params.data.name = OATRelationshipHandleName
                        ? `${OATRelationshipHandleName}_${getNextRelationshipAmount(
                              elements
                          )}`
                        : '';
                    setElements((es) => addEdge(params, [...es, newNode]));
                };

                const undoAddition = () => {
                    setElements(elements);
                };

                execute(addition, undoAddition);
            }
        }
    };

    const storeElements = () => {
        // Save the session data into the local storage
        const nodePositions = elements.reduce((collection, element) => {
            if (!element.source) {
                collection.push({
                    '@id': element.id,
                    position: element.position
                });
            }
            return collection;
        }, []);

        dispatch({
            type: SET_OAT_MODELS_POSITIONS,
            payload: nodePositions
        });
    };

    const triggerInheritanceLimitError = () => {
        dispatch({
            type: SET_OAT_ERROR,
            payload: {
                title: t('OATGraphViewer.errorReachedInheritanceLimit'),
                message: t('OATGraphViewer.errorInheritance')
            }
        });
    };

    const translatedOutput = useMemo(() => {
        // Creates the json object in the DTDL standard based on the content of the nodes
        const nodes = elements.reduce((currentNodes, currentNode) => {
            if (currentNode.data['@type'] === OATInterfaceType) {
                currentNodes.push(currentNode.data);
            } else if (
                currentNode.data['@type'] === OATRelationshipHandleName
            ) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                if (
                    sourceNode &&
                    sourceNode.contents.every(
                        (element) => element.target !== currentNode.target
                    )
                ) {
                    sourceNode.contents = [
                        ...sourceNode.contents,
                        currentNode.data
                    ];
                }
            } else if (currentNode.data['@type'] === OATExtendHandleName) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                if (sourceNode) {
                    sourceNode.extends = sourceNode.extends || [];
                    if (!sourceNode.extends.includes(currentNode.target)) {
                        if (
                            sourceNode.extends.length < maxInheritanceQuantity
                        ) {
                            sourceNode.extends.push(currentNode.target);
                        } else {
                            triggerInheritanceLimitError();
                        }
                    }
                }
            } else if (currentNode.data['@type'] === OATComponentHandleName) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                const targetNode = elements.find(
                    (element) => element.id === currentNode.target
                );
                if (
                    sourceNode &&
                    targetNode &&
                    sourceNode.contents.every(
                        (element) =>
                            element.name !== targetNode.data.displayName
                    )
                ) {
                    const component = {
                        '@type': currentNode.data['@type'],
                        name: targetNode.data.displayName,
                        schema: currentNode.target
                    };
                    sourceNode.contents = [...sourceNode.contents, component];
                }
            } else if (
                currentNode.data['@type'] === OATUntargetedRelationshipName
            ) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                if (
                    sourceNode &&
                    sourceNode.contents.every(
                        (element) => element.name !== currentNode.data.name
                    )
                ) {
                    sourceNode.contents = [
                        ...sourceNode.contents,
                        {
                            ...currentNode.data,
                            '@type': OATRelationshipHandleName
                        }
                    ];
                }
            }
            return currentNodes;
        }, []);
        return nodes;
    }, [elements]);

    useEffect(() => {
        // If there is a model find it on translatedOutput
        if (model) {
            const updatedModel = translatedOutput.find(
                (element) => element['@id'] === model['@id']
            );

            // Update if current model is outdated
            if (
                updatedModel &&
                JSON.stringify(model) !== JSON.stringify(updatedModel)
            ) {
                dispatch({
                    type: SET_OAT_SELECTED_MODEL,
                    payload: updatedModel
                });
            }
        }
    }, [translatedOutput]);

    useEffect(() => {
        dispatch({
            type: SET_OAT_MODELS,
            payload: translatedOutput
        });
    }, [translatedOutput]);

    const setModelFromClickedNode = (node) => {
        let modelClicked = null;
        if (node) {
            currentNodeIdRef.current = node.id;
            modelClicked = node.data;
        }
        return modelClicked;
    };

    const onElementClick = (
        evt: React.MouseEvent<Element, MouseEvent>,
        node: Edge
    ) => {
        if (!state.modified) {
            // Checks if a node is selected to display it in the property editor
            if (
                translatedOutput &&
                node.id !== currentNodeIdRef.current // Prevent re-execute the same node
            ) {
                const onClick = () => {
                    const clickedModel = setModelFromClickedNode(node);
                    dispatch({
                        type: SET_OAT_SELECTED_MODEL,
                        payload: clickedModel
                    });
                    currentNodeIdRef.current = node.id;
                };

                const undoOnClick = () => {
                    dispatch({
                        type: SET_OAT_SELECTED_MODEL,
                        payload: model
                    });
                };

                execute(onClick, undoOnClick);
            }
        }
    };

    const onNodeMouseEnter = (
        evt: React.MouseEvent<Element, MouseEvent>,
        node: IOATNodeElement
    ) => {
        setCurrentHovered(node);
    };

    const onNodeMouseLeave = () => {
        setCurrentHovered(null);
    };

    const onBackgroundClick = () => {
        const clearModel = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: null
            });
        };

        const undoClearModel = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
        };

        if (model) {
            execute(clearModel, undoClearModel);
        }
    };

    return (
        <ReactFlowProvider>
            <div
                className={graphViewerStyles.container}
                ref={reactFlowWrapperRef}
            >
                {loading && (
                    <div className={graphViewerStyles.loadingOverlay}>
                        <Spinner size={SpinnerSize.large} />
                    </div>
                )}

                <ElementsContext.Provider value={providerVal}>
                    <ReactFlow
                        elements={elements}
                        onElementClick={onElementClick}
                        onConnectStart={onConnectStart}
                        onConnectStop={onConnectStop}
                        onLoad={onLoad}
                        snapToGrid={false}
                        snapGrid={[15, 15]}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onNodeDragStop={onNodeDragStop}
                        onNodeMouseEnter={onNodeMouseEnter}
                        onNodeMouseLeave={onNodeMouseLeave}
                        onPaneClick={onBackgroundClick}
                    >
                        <PrimaryButton
                            styles={buttonStyles}
                            onClick={onNewModelClick}
                            text={t('OATGraphViewer.newModel')}
                        />
                        {!elements[0] && (
                            <Label styles={warningStyles}>
                                {t('OATGraphViewer.emptyGraph')}
                            </Label>
                        )}
                        <Stack styles={graphViewerFiltersStyles}>
                            <div
                                className={
                                    graphViewerStyles.graphViewerFiltersWrap
                                }
                            >
                                <div
                                    className={
                                        graphViewerStyles.graphViewerFiltersKey
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 23 8.86"
                                    >
                                        <g>
                                            <polygon
                                                fill="#ffb200"
                                                points="18.57 0 17.3 1.27 19.96 3.93 0 3.93 0 4.93 19.96 4.93 17.3 7.59 18.57 8.86 23 4.43 18.57 0"
                                            />
                                        </g>
                                    </svg>
                                    <span className="rel-title">
                                        {t('OATGraphViewer.relationships')}
                                    </span>
                                    <Toggle
                                        defaultChecked={showRelationships}
                                        onChange={() => {
                                            setShowRelationships(
                                                !showRelationships
                                            );
                                        }}
                                    />
                                </div>
                                <div
                                    className={
                                        graphViewerStyles.graphViewerFiltersKey
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 23.15 9.46"
                                    >
                                        <g>
                                            <path
                                                fill="#008945"
                                                d="M15,9.46l8.19-4.73L15,0V4.23H0v1H15V9.46Zm1-7.84,5.4,3.11-5.4,3.11Z"
                                            />
                                        </g>
                                    </svg>
                                    <span className="rel-title">
                                        {t('OATGraphViewer.inheritances')}
                                    </span>
                                    <Toggle
                                        defaultChecked={showInheritances}
                                        onChange={() => {
                                            setShowInheritances(
                                                !showInheritances
                                            );
                                        }}
                                    />
                                </div>
                                <div
                                    className={
                                        graphViewerStyles.graphViewerFiltersKey
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 23.06 8.12"
                                    >
                                        <g>
                                            <polygon
                                                fill="#0078ce"
                                                points="23.06 3.56 7.72 3.56 4.11 0 0 4.06 4.11 8.12 7.72 4.56 23.06 4.56 23.06 3.56"
                                            />
                                        </g>
                                    </svg>
                                    <span className="rel-title">
                                        {t('OATGraphViewer.components')}
                                    </span>
                                    <Toggle
                                        defaultChecked={showComponents}
                                        onChange={() => {
                                            setShowComponents(!showComponents);
                                        }}
                                    />
                                </div>
                            </div>
                        </Stack>

                        <Stack styles={graphForceLayoutStyles}>
                            <div
                                className={
                                    graphViewerStyles.graphViewerForceLayoutWrap
                                }
                            >
                                <IconButton
                                    iconProps={{ iconName: 'GridViewMedium' }}
                                    title={t('OATGraphViewer.runLayout')}
                                    ariaLabel={t('OATGraphViewer.runLayout')}
                                    onClick={() => {
                                        setLoading(true);
                                        applyLayoutToElements(elements);
                                    }}
                                />
                            </div>
                        </Stack>

                        <MiniMap
                            nodeColor={theme.semanticColors.inputBackground}
                            style={graphViewerMinimapStyles}
                        />
                        <Controls
                            className={graphViewerStyles.graphViewerControls}
                        />
                        <Background
                            color={theme.semanticColors.bodyBackground}
                            gap={16}
                            onClick={onBackgroundClick}
                        />
                    </ReactFlow>
                </ElementsContext.Provider>
            </div>
        </ReactFlowProvider>
    );
};

OATGraphViewer.defaultProps = {
    importModels: []
};

export default OATGraphViewer;
