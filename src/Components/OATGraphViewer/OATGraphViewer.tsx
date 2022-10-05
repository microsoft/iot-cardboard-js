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
    MiniMap,
    Controls,
    Background,
    Node,
    Edge
} from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import OATGraphCustomNode from './Internal/OATGraphCustomNode';
import OATGraphCustomEdge from './Internal/OATGraphCustomEdge';
import {
    OAT_UNTARGETED_RELATIONSHIP_NAME,
    OAT_RELATIONSHIP_HANDLE_NAME,
    OAT_EXTEND_HANDLE_NAME,
    OAT_INTERFACE_TYPE,
    OAT_COMPONENT_HANDLE_NAME,
    OAT_NAMESPACE_DEFAULT_VALUE
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
import { IOATNodeElement } from '../../Models/Constants/Interfaces';
import { ElementNode } from './Internal/Classes/ElementNode';
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
import { DtdlInterface } from '../../Models/Constants';
import { IOATModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    addComponentRelationship,
    addExtendsRelationship,
    addNewModel,
    addTargetedRelationship,
    addUntargetedRelationship,
    DEFAULT_NODE_POSITION,
    getSelectionFromNode,
    VERSION_CLASS_BASE
} from './Internal/Utils';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';

const nodeWidth = 300;
const nodeHeight = 100;
const maxInheritanceQuantity = 2;
const newNodeLeft = 20;
const newNodeOffset = 10;

const OATGraphViewer = () => {
    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageState, oatPageDispatch } = useOatPageContext();

    const idClassBase = `dtmi:${
        oatPageState.currentOntologyNamespace
            ? oatPageState.currentOntologyNamespace
            : OAT_NAMESPACE_DEFAULT_VALUE
    }:`;

    //  Converts the stored models to a graph nodes
    const getGraphViewerElementsFromModels = (
        models: DtdlInterface[],
        modelPositions: IOATModelPosition[]
    ) => {
        if (!models || !modelPositions) {
            return [];
        }

        // Format models
        const modelsCopy = deepCopy(models);
        // TODO: define a type here that actually works so it's not an any
        return modelsCopy.reduce((elements, input) => {
            if (input.contents) {
                // Get the relationships
                input.contents.forEach((content) => {
                    switch (content['@type']) {
                        case OAT_COMPONENT_HANDLE_NAME: {
                            const foundComponentTarget = models.find(
                                (model) => model['@id'] === content.schema
                            );

                            if (foundComponentTarget) {
                                addComponentRelationship(
                                    input['@id'],
                                    content,
                                    foundComponentTarget.displayName,
                                    elements
                                );
                            }
                            break;
                        }
                        case OAT_RELATIONSHIP_HANDLE_NAME:
                            if (content.target) {
                                const foundRelationshipTarget = models.find(
                                    (model) => model['@id'] === content.target
                                );

                                if (foundRelationshipTarget) {
                                    addTargetedRelationship(
                                        input['@id'],
                                        content,
                                        elements
                                    );
                                }
                            } else {
                                addUntargetedRelationship(
                                    input['@id'],
                                    content,
                                    modelPositions,
                                    elements
                                );
                            }
                            break;
                    }
                });
            }

            if (input.extends) {
                (Array.isArray(input.extends)
                    ? input.extends
                    : [input.extends]
                ).forEach((extend) => {
                    const foundExtendTarget = models.find(
                        (model) => model['@id'] === extend
                    );

                    if (foundExtendTarget) {
                        addExtendsRelationship(input['@id'], extend, elements);
                    }
                });
            }

            const mp = modelPositions.find((x) => x['@id'] === input['@id']);
            const newNode = new ElementNode(
                input['@id'],
                input['@type'],
                {
                    x: mp ? mp.position.x : DEFAULT_NODE_POSITION,
                    y: mp ? mp.position.y : DEFAULT_NODE_POSITION
                },
                input
            );

            elements.push(newNode);
            return elements;
        }, []);
    };

    const { t } = useTranslation();
    const theme = useTheme();
    const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
    const [elements, setElements] = useState(
        getGraphViewerElementsFromModels(
            oatPageState.currentOntologyModels,
            oatPageState.currentOntologyModelPositions
        )
    );
    const graphViewerStyles = getGraphViewerStyles();
    const buttonStyles = getGraphViewerButtonStyles();
    const warningStyles = getGraphViewerWarningStyles();
    const graphViewerMinimapStyles = getGraphViewerMinimapStyles();
    const graphViewerFiltersStyles = getGraphViewerFiltersStyles();
    const graphForceLayoutStyles = getGraphForceLayoutStyles();
    const currentNodeIdRef = useRef<string>(null);
    const currentHandleIdRef = useRef<string>(null);
    const [currentHovered, setCurrentHovered] = useState<IOATNodeElement>(null);
    const [showRelationships, setShowRelationships] = useState(true);
    const [showInheritances, setShowInheritances] = useState(true);
    const [showComponents, setShowComponents] = useState(true);
    const [rfInstance, setRfInstance] = useState(null);
    const [loading, setLoading] = useState(false);

    const applyLayoutToElements = useCallback(
        (inputElements) => {
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
                                x:
                                    node.x -
                                    nodeWidth / 2 +
                                    Math.random() / 1000,
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
        },
        [execute, rfInstance]
    );

    const newModelId = useMemo(() => {
        // Identifies which is the next model Id on creating new nodes
        let nextModelId = -1;
        let index = 0;
        while (index !== -1) {
            nextModelId++;
            index = elements.findIndex(
                (element) =>
                    element.id ===
                    `${idClassBase}model${nextModelId};${VERSION_CLASS_BASE}`
            );
        }

        return nextModelId;
    }, [elements, idClassBase]);

    const providerVal = useMemo(
        () => ({
            currentHovered,
            showRelationships,
            showInheritances,
            showComponents
        }),
        [currentHovered, showRelationships, showInheritances, showComponents]
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
            let startPositionCoordinates = event.target.getBoundingClientRect();
            startPositionCoordinates = rfInstance.project({
                x: newNodeLeft,
                y: startPositionCoordinates.y
            });

            const elementsCopy = deepCopy(elements);
            addNewModel(
                newModelId,
                idClassBase,
                getNewNodePosition(startPositionCoordinates),
                elementsCopy
            );
            setElements(elementsCopy);
        };

        const undoOnNewNode = () => {
            setElements(elements);
        };

        if (!oatPageState.modified) {
            execute(onNewNode, undoOnNewNode);
        }
    };

    const onConnectStart = (
        _: React.MouseEvent<Element, MouseEvent>,
        params: ConnectionParams
    ) => {
        // Stores values before connection is created
        currentNodeIdRef.current = params.handleId ? params.nodeId : null;
        currentHandleIdRef.current = params.handleId ? params.handleId : null;
    };

    const onConnectStop = (evt: GraphViewerConnectionEvent) => {
        const elementsCopy = deepCopy(elements);
        const source = currentNodeIdRef.current;

        let target = (evt.path || []).find(
            (element) => element.dataset && element.dataset.id
        );
        let targetModel = null;
        if (target) {
            target = target.dataset.id;
            targetModel = elementsCopy.find((element) => element.id === target);
        }

        const addition = () => {
            if (
                !target &&
                currentHandleIdRef.current !== OAT_UNTARGETED_RELATIONSHIP_NAME
            ) {
                const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
                const position = rfInstance.project({
                    x: evt.clientX - reactFlowBounds.left,
                    y: evt.clientY - reactFlowBounds.top
                });
                targetModel = addNewModel(
                    newModelId,
                    idClassBase,
                    position,
                    elementsCopy
                );
                target = targetModel.id;
            }

            if (currentHandleIdRef.current === OAT_RELATIONSHIP_HANDLE_NAME) {
                const relationship = {
                    '@type': OAT_RELATIONSHIP_HANDLE_NAME,
                    name: null,
                    target
                };
                addTargetedRelationship(source, relationship, elementsCopy);
            } else if (
                currentHandleIdRef.current === OAT_COMPONENT_HANDLE_NAME
            ) {
                const component = {
                    '@type': OAT_COMPONENT_HANDLE_NAME,
                    name: null,
                    schema: target
                };

                if (targetModel) {
                    addComponentRelationship(
                        source,
                        component,
                        targetModel.data.displayName,
                        elementsCopy
                    );
                }
            } else if (currentHandleIdRef.current === OAT_EXTEND_HANDLE_NAME) {
                const existing = elementsCopy.filter(
                    (e) =>
                        e.type === OAT_EXTEND_HANDLE_NAME && e.source === source
                );
                if (existing.length > maxInheritanceQuantity) {
                    triggerInheritanceLimitError();
                } else {
                    addExtendsRelationship(source, target, elementsCopy);
                }
            } else if (
                currentHandleIdRef.current === OAT_UNTARGETED_RELATIONSHIP_NAME
            ) {
                const relationship = {
                    '@type': OAT_RELATIONSHIP_HANDLE_NAME,
                    name: null,
                    target
                };
                addUntargetedRelationship(
                    source,
                    relationship,
                    oatPageState.currentOntologyModelPositions,
                    elementsCopy
                );
            }

            setElements(elementsCopy);
        };

        const undoAddition = () => {
            setElements(elements);
        };

        execute(addition, undoAddition);
    };

    const storeElements = useCallback(() => {
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

        oatPageDispatch({
            type: OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS,
            payload: { positions: nodePositions }
        });
    }, [elements, oatPageDispatch]);

    const triggerInheritanceLimitError = () => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_ERROR,
            payload: {
                title: t('OATGraphViewer.errorReachedInheritanceLimit'),
                message: t('OATGraphViewer.errorInheritance')
            }
        });
    };

    const translatedOutput = useMemo(() => {
        // Creates the json object in the DTDL standard based on the content of the nodes
        const nodes = elements.reduce((currentNodes, currentNode) => {
            if (currentNode.data['@type'] === OAT_INTERFACE_TYPE) {
                currentNodes.push(currentNode.data);
            } else if (
                currentNode.data['@type'] === OAT_RELATIONSHIP_HANDLE_NAME
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
            } else if (currentNode.data['@type'] === OAT_EXTEND_HANDLE_NAME) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                if (sourceNode) {
                    sourceNode.extends = sourceNode.extends || [];
                    if (!sourceNode.extends.includes(currentNode.target)) {
                        sourceNode.extends.push(currentNode.target);
                    }
                }
            } else if (
                currentNode.data['@type'] === OAT_COMPONENT_HANDLE_NAME
            ) {
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
                        (element) => element.name !== currentNode.data.name
                    )
                ) {
                    sourceNode.contents = [
                        ...sourceNode.contents,
                        currentNode.data
                    ];
                }
            } else if (
                currentNode.data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME
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
                            '@type': OAT_RELATIONSHIP_HANDLE_NAME
                        }
                    ];
                }
            }
            return currentNodes;
        }, []);
        return nodes;
    }, [elements]);

    useEffect(() => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_CURRENT_MODELS,
            payload: { models: translatedOutput }
        });
    }, [oatPageDispatch, translatedOutput]);

    const onElementClick = (
        _: React.MouseEvent<Element, MouseEvent>,
        node: Node<any> | Edge<any>
    ) => {
        if (!oatPageState.modified) {
            // Checks if a node is selected to display it in the property editor
            if (
                translatedOutput &&
                (!oatPageState.selection ||
                    (node.type === OAT_INTERFACE_TYPE &&
                        (node.data['@id'] !== oatPageState.selection.modelId ||
                            oatPageState.selection.contentId)) ||
                    (node.type !== OAT_INTERFACE_TYPE &&
                        ((node as Edge<any>).source !==
                            oatPageState.selection.modelId ||
                            node.data.name !==
                                oatPageState.selection.contentId))) // Prevent re-execute the same node
            ) {
                const onClick = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                        payload: { selection: getSelectionFromNode(node) }
                    });
                };

                const undoOnClick = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                        payload: { selection: oatPageState.selection }
                    });
                };

                execute(onClick, undoOnClick);
            }
        }
    };

    const onNodeMouseEnter = (
        _: React.MouseEvent<Element, MouseEvent>,
        node: IOATNodeElement
    ) => {
        setCurrentHovered(node);
    };

    const onNodeDragEnd = (
        _: React.MouseEvent<Element, MouseEvent>,
        node: IOATNodeElement
    ) => {
        const match = elements.find((e) => e.id === node.id);
        if (match) {
            match.position = node.position;
        }
        storeElements();
    };

    const onNodeMouseLeave = () => {
        setCurrentHovered(null);
    };

    const onBackgroundClick = () => {
        const clearModel = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: null }
            });
        };

        const undoClearModel = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: oatPageState.selection }
            });
        };

        if (oatPageState.selection) {
            execute(clearModel, undoClearModel);
        }
    };

    // side effects
    useEffect(() => {
        storeElements();
    }, [elements, storeElements]);

    // Update graph nodes and edges when the models are updated
    useEffect(() => {
        const potentialElements = getGraphViewerElementsFromModels(
            oatPageState.currentOntologyModels,
            oatPageState.currentOntologyModelPositions
        );

        if (JSON.stringify(potentialElements) !== JSON.stringify(elements)) {
            setElements(potentialElements);
        }
    }, [
        oatPageState.currentOntologyModelPositions,
        oatPageState.currentOntologyModels
    ]);

    useEffect(() => {
        if (oatPageState.importModels?.length > 0) {
            setLoading(true);
            const potentialElements = getGraphViewerElementsFromModels(
                oatPageState.importModels,
                oatPageState.currentOntologyModelPositions
            );
            applyLayoutToElements(deepCopy(potentialElements));
        }
    }, [
        applyLayoutToElements,
        oatPageState.currentOntologyModelPositions,
        oatPageState.importModels
    ]);

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
                        onNodeDragStop={onNodeDragEnd}
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
