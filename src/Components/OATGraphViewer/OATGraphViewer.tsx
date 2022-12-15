import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    useContext
} from 'react';
import {
    Label,
    SpinnerSize,
    Spinner,
    classNamesFunction,
    styled,
    Callout,
    DirectionalHint
} from '@fluentui/react';
import { useId, usePrevious } from '@fluentui/react-hooks';
import ReactFlow, {
    ReactFlowProvider,
    MiniMap,
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
    OatReferenceType,
    OAT_GRAPH_REFERENCE_TYPE
} from '../../Models/Constants/Constants';
import {
    getGraphViewerStyles,
    getGraphViewerWarningStyles,
    getStyles
} from './OATGraphViewer.styles';
import { IOATNodeElement } from '../../Models/Constants/Interfaces';
import { deepCopy, getDebugLogger } from '../../Models/Services/Utils';
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
import { DtdlInterface, DtdlRelationship } from '../../Models/Constants';
import { IOATModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    addComponentRelationship,
    addExtendsRelationship,
    addModelToGraph,
    addTargetedRelationship,
    addUntargetedRelationship,
    deleteModelFromGraph,
    getNewNodePosition,
    getSelectionFromNode,
    updateModelInGraph
} from './Internal/Utils';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';
import {
    IOatElementNode,
    IOatGraphNode,
    IOATGraphViewerProps,
    IOATGraphViewerStyleProps,
    IOATGraphViewerStyles
} from './OATGraphViewer.types';
import { ensureIsArray, isUntargeted } from '../../Models/Services/OatUtils';
import GraphLegend from './Internal/GraphLegend/GraphLegend';
import {
    OatGraphContextProvider,
    useOatGraphContext
} from '../../Models/Context/OatGraphContext/OatGraphContext';
import { OatGraphContextActionType } from '../../Models/Context/OatGraphContext/OatGraphContext.types';
import GraphViewerControls from './Internal/GraphViewerControls/GraphViewerControls';
import OATModelList from '../OATModelList/OATModelList';
import {
    CONTROLS_CALLOUT_OFFSET,
    getControlBackgroundColor
} from '../../Models/Constants/OatStyleConstants';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import { DTDLType } from '../../Models/Classes/DTDL';
import { IReactFlowInstance } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ElementEdge } from './Internal/Classes/ElementEdge';
import { ElementNode } from './Internal/Classes/ElementNode';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATGraphViewer', debugLogging);

const getClassNames = classNamesFunction<
    IOATGraphViewerStyleProps,
    IOATGraphViewerStyles
>();

const nodeWidth = 300;
const nodeHeight = 100;
const newNodeTopOffset = 20;
const newNodeLeft = 100;
const newNodeLeftWithPanelOpen = 450;
const typeMapping = new Map<string, OatReferenceType>([
    [OAT_COMPONENT_HANDLE_NAME, DTDLType.Component],
    [OAT_RELATIONSHIP_HANDLE_NAME, DTDLType.Relationship],
    [OAT_EXTEND_HANDLE_NAME, 'Extend']
]);

const OATGraphViewerContent: React.FC<IOATGraphViewerProps> = (props) => {
    const { styles } = props;

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageState, oatPageDispatch } = useOatPageContext();
    const { oatGraphDispatch, oatGraphState } = useOatGraphContext();

    logDebugConsole(
        'debug',
        '[START] Render {models, positions}',
        oatPageState.currentOntologyModels,
        oatPageState.currentOntologyModelPositions
    );

    //  Converts the stored models to a graph nodes
    const getGraphNodesFromModels = useCallback(
        (models: DtdlInterface[], modelPositions: IOATModelPosition[]) => {
            if (!models || !modelPositions) {
                return [];
            }

            // TODO: define a type here that actually works so it's not an any
            return models.reduce((elements, input) => {
                // create the Component & Relationship edges
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
                            case OAT_RELATIONSHIP_HANDLE_NAME: {
                                const relationship = content as DtdlRelationship;
                                if (relationship.target) {
                                    const foundRelationshipTarget = models.find(
                                        (model) =>
                                            model['@id'] === relationship.target
                                    );

                                    if (foundRelationshipTarget) {
                                        addTargetedRelationship(
                                            input['@id'],
                                            relationship,
                                            elements
                                        );
                                    }
                                } else {
                                    addUntargetedRelationship(
                                        input,
                                        relationship,
                                        modelPositions,
                                        elements
                                    );
                                }
                                break;
                            }
                        }
                    });
                }

                // create the Extend edges
                if (input.extends) {
                    ensureIsArray(input.extends).forEach((extend) => {
                        const foundExtendTarget = models.find(
                            (model) => model['@id'] === extend
                        );

                        if (foundExtendTarget) {
                            addExtendsRelationship(
                                input['@id'],
                                extend,
                                elements
                            );
                        }
                    });
                }

                // find the position
                const mp = modelPositions.find(
                    (x) => x['@id'] === input['@id']
                );

                // add to the graph
                addModelToGraph(input, mp?.position, elements);
                return elements;
            }, []);
        },
        []
    );

    // state
    const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
    // (ElementNode | ElementEdge)[]
    const [elements, setElements] = useState(
        getGraphNodesFromModels(
            oatPageState.currentOntologyModels,
            oatPageState.currentOntologyModelPositions
        )
    );
    const currentNodeIdRef = useRef<string>(null);
    const currentHandleIdRef = useRef<string>(null);
    const [rfInstance, setRfInstance] = useState<IReactFlowInstance | null>(
        null
    );

    const legendButtonId = useId('legend-button');
    const mapButtonId = useId('map-button');
    const modelListButtonId = useId('model-list-button');

    // callbacks
    const applyLayoutToElements = useCallback(
        (inputElements: IOatElementNode[]) => {
            logDebugConsole(
                'debug',
                '[START] Apply layout {elements}',
                inputElements
            );
            oatGraphDispatch({
                type: OatGraphContextActionType.LOADING_TOGGLE,
                payload: { value: true }
            });
            const nodes: IOatGraphNode[] = inputElements.reduce(
                (collection: IOatGraphNode[], element: IOatElementNode) => {
                    if (!element.source) {
                        collection.push({
                            id: element.id,
                            x: element.position.x + nodeWidth / 2,
                            y: element.position.y + nodeHeight / 2
                        });
                    }
                    return collection;
                },
                []
            );
            // console.log('***NODES:', nodes);

            const links = inputElements.reduce((collection: any[], element) => {
                if (element.source) {
                    collection.push({
                        source: element.source,
                        target: element.target
                    });
                }
                return collection;
            }, []);
            // console.log('***LINKS:', links);

            forceSimulation(nodes)
                .force(
                    'link',
                    forceLink(links)
                        .id((d) => (d as any).id)
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

                        // assign positions to model nodes
                        const newElement = { ...element };
                        if (node) {
                            // console.log(
                            //     '***[START] position node. {node, element}',
                            //     node,
                            //     newElement
                            // );
                            newElement.position = {
                                x:
                                    node.x -
                                    nodeWidth / 2 +
                                    Math.random() / 1000,
                                y: node.y - nodeHeight / 2
                            };
                            // console.log(
                            //     '***[END] position node. {element}',
                            //     newElement
                            // );
                        }

                        return newElement;
                    });
                    // console.log(
                    //     '*** END. {original, newEls, nodes, links}',
                    //     inputElements,
                    //     newElements,
                    //     nodes,
                    //     links
                    // );

                    const application = () => {
                        setElements(newElements);
                        oatGraphDispatch({
                            type: OatGraphContextActionType.LOADING_TOGGLE,
                            payload: { value: false }
                        });
                    };

                    const undoApplication = () => {
                        setElements(inputElements);
                    };

                    execute(application, undoApplication);
                    rfInstance.fitView();
                });
            logDebugConsole(
                'debug',
                '[END] Apply layout {elements}',
                inputElements
            );
        },
        [execute, oatGraphDispatch, rfInstance]
    );

    const nodeTypes = useMemo(() => ({ Interface: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(() => ({ Relationship: OATGraphCustomEdge }), []);

    /** called when the graph mounts */
    const onLoadGraph = useCallback((_reactFlowInstance: any) => {
        const instance = _reactFlowInstance as IReactFlowInstance;
        instance.fitView();
        instance.zoomOut();
        instance.zoomOut();
        setRfInstance(instance);
    }, []);

    /** Forces the auto layout of the current elements on the graph */
    const forceGraphLayout = useCallback(() => {
        applyLayoutToElements(elements);
    }, [applyLayoutToElements, elements]);

    const onConnectStart = (
        _: React.MouseEvent<Element, MouseEvent>,
        params: ConnectionParams
    ) => {
        logDebugConsole('debug', '[START] Connection. {params}', params);
        // Stores values before connection is created
        currentNodeIdRef.current = params.nodeId ? params.nodeId : null;
        currentHandleIdRef.current = params.handleId ? params.handleId : null;
    };

    const onConnectStop = (evt: GraphViewerConnectionEvent) => {
        const elementsCopy = deepCopy(elements);
        const sourceModelId = currentNodeIdRef.current;
        logDebugConsole(
            'debug',
            '[END] Connection stopped. {event, elements, source}',
            evt,
            elementsCopy,
            sourceModelId
        );

        let targetModelId = (evt.path || []).find(
            (element) => element.dataset && element.dataset.id
        );
        if (targetModelId) {
            targetModelId = targetModelId.dataset.id;
        }

        const addition = () => {
            const type = typeMapping.get(currentHandleIdRef.current);
            if (
                type === DTDLType.Component ||
                type === DTDLType.Relationship ||
                type === 'Extend'
            ) {
                if (targetModelId) {
                    oatPageDispatch({
                        type: OatPageContextActionType.ADD_NEW_RELATIONSHIP,
                        payload: {
                            type: 'Targeted',
                            relationshipType: type,
                            sourceModelId: sourceModelId,
                            targetModelId: targetModelId
                        }
                    });
                } else {
                    const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
                    const position = rfInstance.project({
                        x: evt.clientX - reactFlowBounds.left,
                        y: evt.clientY - reactFlowBounds.top
                    });
                    oatPageDispatch({
                        type:
                            OatPageContextActionType.ADD_NEW_MODEL_WITH_RELATIONSHIP,
                        payload: {
                            position: position,
                            relationshipType: type,
                            sourceModelId: sourceModelId
                        }
                    });
                }
            } else if (
                currentHandleIdRef.current === OAT_UNTARGETED_RELATIONSHIP_NAME
            ) {
                const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
                const position = rfInstance.project({
                    x: evt.clientX - reactFlowBounds.left,
                    y: evt.clientY - reactFlowBounds.top
                });
                oatPageDispatch({
                    type: OatPageContextActionType.ADD_NEW_RELATIONSHIP,
                    payload: {
                        type: 'Untargeted',
                        sourceModelId: sourceModelId,
                        position: position
                    }
                });
            }
        };

        const undoAddition = () => {
            setElements(elements);
        };

        execute(addition, undoAddition);
    };

    const storeElementPositions = useCallback(
        (currentElements) => {
            // Save the session data into the local storage
            const nodePositions: IOATModelPosition[] = currentElements.reduce(
                (collection: IOATModelPosition[], element: IOatElementNode) => {
                    if (!element.source) {
                        collection.push({
                            '@id': element.id,
                            position: element.position
                        });
                    }
                    return collection;
                },
                []
            );

            logDebugConsole(
                'debug',
                '[storeElementPositions] Storing the positions to context. {positions}',
                nodePositions
            );
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS,
                payload: { positions: nodePositions }
            });
        },
        [oatPageDispatch]
    );

    const onElementClick = (
        _: React.MouseEvent<Element, MouseEvent>,
        node: Node<any> | Edge<any>
    ) => {
        if (!oatPageState.modified) {
            // Checks if a node is selected to display it in the property editor
            const isDifferentNodeFromCurrent =
                node.type === OAT_INTERFACE_TYPE &&
                (node.data['@id'] !== oatPageState.selection?.modelId ||
                    oatPageState.selection?.contentId);
            const isDifferentRelationshipFromCurrent =
                node.type !== OAT_INTERFACE_TYPE &&
                ((node as Edge<any>).source !==
                    oatPageState.selection?.modelId ||
                    node.data.name !== oatPageState.selection?.contentId);
            if (
                !oatPageState.selection ||
                isDifferentNodeFromCurrent || // Prevent re-execute the same node
                isDifferentRelationshipFromCurrent // Prevent re-execute the same node
            ) {
                logDebugConsole('info', 'Element selected', node);
                // select the relationship when an untargeted node is selected
                if (isUntargeted(node.id) && node.type === OAT_INTERFACE_TYPE) {
                    // look for the relationship with the same id
                    const relationship = elements.find(
                        (x: ElementNode | ElementEdge) =>
                            x.type === OAT_GRAPH_REFERENCE_TYPE &&
                            x.id === node.id
                    );
                    if (relationship) {
                        node = relationship;
                    }
                }

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

    const onNodeDragEnd = (
        _: React.MouseEvent<Element, MouseEvent>,
        node: IOATNodeElement
    ) => {
        const match = elements.find((e) => e.id === node.id);
        if (match) {
            match.position = node.position;
        }
        storeElementPositions(elements);
    };

    const clearSelectedModel = () => {
        logDebugConsole('info', 'Clearing selected model');
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

    // sync changes from models & positions in state onto the graph
    useEffect(() => {
        const potentialElements = getGraphNodesFromModels(
            oatPageState.currentOntologyModels,
            oatPageState.currentOntologyModelPositions
        );

        if (JSON.stringify(potentialElements) !== JSON.stringify(elements)) {
            setElements(potentialElements);
        }
    }, [
        elements,
        getGraphNodesFromModels,
        oatPageState.currentOntologyModelPositions,
        oatPageState.currentOntologyModels
    ]);

    // Rebuild the graph when the selected ontology changes
    const previousId = usePrevious(oatPageState.currentOntologyId);
    useEffect(() => {
        if (previousId !== oatPageState.currentOntologyId) {
            const potentialElements = getGraphNodesFromModels(
                oatPageState.currentOntologyModels,
                oatPageState.currentOntologyModelPositions
            );

            if (
                JSON.stringify(potentialElements) !== JSON.stringify(elements)
            ) {
                setElements(potentialElements);
            }
        }
    }, [
        elements,
        getGraphNodesFromModels,
        oatPageState.currentOntologyId,
        oatPageState.currentOntologyModelPositions,
        oatPageState.currentOntologyModels,
        previousId
    ]);

    // force layout when requested by global context
    useEffect(() => {
        if (oatPageState.triggerGraphLayout) {
            forceGraphLayout();
            oatPageDispatch({
                type: OatPageContextActionType.CLEAR_GRAPH_LAYOUT
            });
        }
    }, [forceGraphLayout, oatPageDispatch, oatPageState.triggerGraphLayout]);

    // update the graph when models are added/updated/deleted on state
    useEffect(() => {
        const updatePayload = oatPageState.graphUpdatesToSync;
        if (
            updatePayload?.actionType !== 'None' &&
            updatePayload.models.length > 0
        ) {
            logDebugConsole(
                'info',
                '[START] Handle change to graph models. {actionType, models}',
                updatePayload.actionType,
                updatePayload.models
            );

            if (updatePayload.actionType === 'Add') {
                // ADD MODELS
                logDebugConsole('debug', 'Processing added models');
                const onAddModels = () => {
                    // indent more to get out from behind the left panel when it's open
                    const leftOffset = oatGraphState.isModelListVisible
                        ? newNodeLeftWithPanelOpen
                        : newNodeLeft;
                    const startPositionCoordinates = rfInstance.project({
                        x: leftOffset,
                        y: newNodeTopOffset
                    });
                    const elementsCopy = deepCopy(elements);
                    const newPositions: IOATModelPosition[] = [];
                    const updatedPositions =
                        oatPageState.currentOntologyModelPositions;
                    updatePayload.models.forEach((x) => {
                        const position: IOATModelPosition = {
                            '@id': x['@id'],
                            position: getNewNodePosition(
                                startPositionCoordinates,
                                updatedPositions
                            )
                        };
                        // track updated positions so the newly added items are considered
                        updatedPositions.push(position);
                        newPositions.push(position);
                    });

                    // send back the computed position for the new node so we can store the relative position
                    oatPageDispatch({
                        type: OatPageContextActionType.UPDATE_MODEL_POSTIONS,
                        payload: { models: newPositions }
                    });
                    setElements(elementsCopy);
                };
                const undoAddModels = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.GENERAL_UNDO,
                        payload: {
                            models: oatPageState.currentOntologyModels,
                            positions:
                                oatPageState.currentOntologyModelPositions,
                            selection: oatPageState.selection
                        }
                    });
                    setElements(elements);
                };
                execute(onAddModels, undoAddModels);
            } else if (updatePayload.actionType === 'Delete') {
                // DELETE MODELS
                logDebugConsole('debug', 'Processing deleted models');
                const onDeleteModels = () => {
                    const elementsCopy = deepCopy(elements);
                    updatePayload.models.forEach((x) => {
                        deleteModelFromGraph(x, elementsCopy);
                    });
                    setElements(elementsCopy);
                };

                const undoDeleteModels = () => {
                    setElements(elements);
                };

                execute(onDeleteModels, undoDeleteModels);
            } else if (updatePayload.actionType === 'Update') {
                // UPDATE EXISTING MODELS
                logDebugConsole('debug', 'Processing updated models');
                const onUpdateModels = () => {
                    const elementsCopy = deepCopy(elements);
                    updatePayload.models.forEach((x) => {
                        updateModelInGraph(x.oldId, x.newModel, elementsCopy);
                    });
                    setElements(elementsCopy);
                };

                const undoUpdateModels = () => {
                    setElements(elements);
                };

                execute(onUpdateModels, undoUpdateModels);
            } else {
                // Should not happen
                logDebugConsole(
                    'warn',
                    'No-op. Unexpected graph update scenario'
                );
            }
            oatPageDispatch({
                type: OatPageContextActionType.GRAPH_CLEAR_MODELS_TO_SYNC
            });
            logDebugConsole('info', '[END] Handle change to graph models');
        }
    }, [
        elements,
        execute,
        getGraphNodesFromModels,
        oatGraphState.isModelListVisible,
        oatPageDispatch,
        oatPageState.currentOntologyModelPositions,
        oatPageState.currentOntologyModels,
        oatPageState.currentOntologyNamespace,
        oatPageState.graphUpdatesToSync,
        oatPageState.selection,
        rfInstance,
        t
    ]);

    // styles
    const graphViewerStyles = getGraphViewerStyles();
    const warningStyles = getGraphViewerWarningStyles();
    const classNames = getClassNames(styles, { theme });

    logDebugConsole(
        'debug',
        '[END] Render {models, positions, nodes}',
        oatPageState.currentOntologyModels,
        oatPageState.currentOntologyModelPositions,
        elements
    );

    return (
        <ReactFlowProvider>
            <div
                className={graphViewerStyles.container}
                ref={reactFlowWrapperRef}
            >
                {oatGraphState.isLoading && (
                    <div className={graphViewerStyles.loadingOverlay}>
                        <Spinner
                            size={SpinnerSize.large}
                            ariaLive={t('OATGraphViewer.loadingText')}
                            label={t('OATGraphViewer.loadingText')}
                        />
                    </div>
                )}

                <ReactFlow
                    className={classNames.graph}
                    edgeTypes={edgeTypes}
                    elements={elements}
                    nodeTypes={nodeTypes}
                    onConnectStart={onConnectStart}
                    onConnectStop={onConnectStop}
                    onElementClick={onElementClick}
                    onLoad={onLoadGraph}
                    onNodeDragStop={onNodeDragEnd}
                    onPaneClick={clearSelectedModel}
                    snapGrid={[15, 15]}
                    snapToGrid={true}
                >
                    {!elements[0] && (
                        <Label styles={warningStyles}>
                            {t('OATGraphViewer.emptyGraph')}
                        </Label>
                    )}
                    {oatGraphState.isModelListVisible &&
                        !oatGraphState.isLoading && (
                            <Callout
                                directionalHint={DirectionalHint.bottomLeftEdge}
                                gapSpace={CONTROLS_CALLOUT_OFFSET}
                                isBeakVisible={false}
                                styles={
                                    classNames.subComponentStyles
                                        .modelsListCallout
                                }
                                target={`#${modelListButtonId}`}
                            >
                                <OATModelList />
                            </Callout>
                        )}

                    <GraphViewerControls
                        legendButtonId={legendButtonId}
                        miniMapButtonId={mapButtonId}
                        modelListButtonId={modelListButtonId}
                        onApplyAutoLayoutClick={forceGraphLayout}
                    />

                    {oatGraphState.isMiniMapVisible && (
                        <div className={classNames.graphMiniMapContainer}>
                            <MiniMap
                                nodeColor={'transparent'}
                                nodeStrokeColor={theme.palette.black}
                                nodeStrokeWidth={2}
                                maskColor={getControlBackgroundColor(theme)}
                                className={classNames.graphMiniMap}
                            />
                        </div>
                    )}
                    {oatGraphState.isLegendVisible && !oatGraphState.isLoading && (
                        <Callout
                            setInitialFocus={true}
                            styles={classNames.subComponentStyles.legendCallout}
                            target={`#${legendButtonId}`}
                            directionalHint={DirectionalHint.topRightEdge}
                        >
                            <GraphLegend />
                        </Callout>
                    )}
                    <Background gap={16} onClick={clearSelectedModel} />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

const OATGraphViewer: React.FC<IOATGraphViewerProps> = (props) => {
    return (
        <OatGraphContextProvider>
            <OATGraphViewerContent {...props} />
        </OatGraphContextProvider>
    );
};

export default styled<
    IOATGraphViewerProps,
    IOATGraphViewerStyleProps,
    IOATGraphViewerStyles
>(OATGraphViewer, getStyles);
