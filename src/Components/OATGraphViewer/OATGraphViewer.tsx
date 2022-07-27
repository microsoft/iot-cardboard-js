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
import { DtdlInterface } from '../../Models/Constants';
import { IOATModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    addComponentRelationship,
    addExtendsRelationship,
    addNewModel,
    addTargetedRelationship,
    addUntargetedRelationship,
    defaultNodePosition,
    getSelectionFromNode,
    versionClassBase
} from './Internal/Utils';

const nodeWidth = 300;
const nodeHeight = 100;
const maxInheritanceQuantity = 2;
const newNodeLeft = 20;
const newNodeOffset = 10;

const OATGraphViewer = ({ state, dispatch }: OATGraphProps) => {
    const { execute } = useContext(CommandHistoryContext);
    const {
        selection,
        models,
        importModels,
        modelPositions,
        namespace
    } = state;

    const idClassBase = `dtmi:${
        namespace ? namespace : OATNamespaceDefaultValue
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
        return modelsCopy.reduce((elements, input) => {
            if (input.contents) {
                // Get the relationships
                input.contents.forEach((content) => {
                    const foundComponentTarget = models.find(
                        (model) => model['@id'] === content.schema
                    );

                    const foundRelationshipTarget = models.find(
                        (model) => model['@id'] === content.target
                    );

                    switch (content['@type']) {
                        case OATComponentHandleName:
                            if (foundComponentTarget) {
                                addComponentRelationship(
                                    input['@id'],
                                    content,
                                    foundComponentTarget.displayName,
                                    elements
                                );
                            }
                            break;
                        case OATRelationshipHandleName:
                            if (content.target) {
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
                    x: mp ? mp.position.x : defaultNodePosition,
                    y: mp ? mp.position.y : defaultNodePosition
                },
                input
            );

            elements.push(newNode);
            return elements;
        }, []);
    };

    const { t } = useTranslation();
    const theme = useTheme();
    const reactFlowWrapperRef = useRef(null);
    const [elements, setElements] = useState(
        getGraphViewerElementsFromModels(models, modelPositions)
    );
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

    const newModelId = useMemo(() => {
        // Identifies which is the next model Id on creating new nodes
        let nextModelId = -1;
        let index = 0;
        while (index !== -1) {
            nextModelId++;
            index = elements.findIndex(
                (element) =>
                    element.id ===
                    `${idClassBase}model${nextModelId};${versionClassBase}`
            );
        }

        return nextModelId;
    }, [elements]);

    useEffect(() => {
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
            currentHovered,
            showRelationships,
            showInheritances,
            showComponents,
            state
        }),
        [
            dispatch,
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
            let startPositionCoordinates = event.target.getBoundingClientRect();
            startPositionCoordinates = rfInstance.project({
                x: newNodeLeft,
                y: startPositionCoordinates.y
            });

            const elementsCopy = [...elements];
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

        if (!state.modified) {
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
                currentHandleIdRef.current !== OATUntargetedRelationshipName
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

            if (currentHandleIdRef.current === OATRelationshipHandleName) {
                const relationship = {
                    '@type': OATRelationshipHandleName,
                    name: null,
                    target
                };
                addTargetedRelationship(source, relationship, elementsCopy);
            } else if (currentHandleIdRef.current === OATComponentHandleName) {
                const component = {
                    '@type': OATComponentHandleName,
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
            } else if (currentHandleIdRef.current === OATExtendHandleName) {
                const existing = elementsCopy.filter(
                    (e) => e.type === OATExtendHandleName && e.source === source
                );
                if (existing.length > maxInheritanceQuantity) {
                    triggerInheritanceLimitError();
                } else {
                    addExtendsRelationship(source, target, elementsCopy);
                }
            } else if (
                currentHandleIdRef.current === OATUntargetedRelationshipName
            ) {
                const relationship = {
                    '@type': OATRelationshipHandleName,
                    name: null,
                    target
                };
                addUntargetedRelationship(
                    source,
                    relationship,
                    modelPositions,
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
                        sourceNode.extends.push(currentNode.target);
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
                        (element) => element.name !== currentNode.data.name
                    )
                ) {
                    sourceNode.contents = [
                        ...sourceNode.contents,
                        currentNode.data
                    ];
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
        dispatch({
            type: SET_OAT_MODELS,
            payload: translatedOutput
        });
    }, [translatedOutput]);

    const onElementClick = (
        _: React.MouseEvent<Element, MouseEvent>,
        node: Node<any> | Edge<any>
    ) => {
        if (!state.modified) {
            // Checks if a node is selected to display it in the property editor
            if (
                translatedOutput &&
                (!selection ||
                    (node.type === OATInterfaceType &&
                        (node.data['@id'] !== selection.modelId ||
                            selection.contentId)) ||
                    (node.type !== OATInterfaceType &&
                        ((node as Edge<any>).source !== selection.modelId ||
                            node.data.name !== selection.contentId))) // Prevent re-execute the same node
            ) {
                const onClick = () => {
                    dispatch({
                        type: SET_OAT_SELECTED_MODEL,
                        payload: getSelectionFromNode(node)
                    });
                };

                const undoOnClick = () => {
                    dispatch({
                        type: SET_OAT_SELECTED_MODEL,
                        payload: selection
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
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: null
            });
        };

        const undoClearModel = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: selection
            });
        };

        if (selection) {
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
