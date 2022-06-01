import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback
} from 'react';
import { useTheme, PrimaryButton, Label, Toggle, Stack } from '@fluentui/react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    removeElements,
    isNode
} from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import dagre from 'dagre';
import OATGraphCustomNode from './Internal/OATGraphCustomNode';
import OATGraphCustomEdge from './Internal/OATGraphCustomEdge';
import {
    OATUntargetedRelationshipName,
    OATRelationshipHandleName,
    OATExtendHandleName,
    OATInterfaceType,
    OATComponentHandleName
} from '../../Models/Constants/Constants';
import {
    getGraphViewerStyles,
    getGraphViewerButtonStyles,
    getGraphViewerWarningStyles,
    getGraphViewerMinimapStyles
} from './OATGraphViewer.styles';
import { ElementsContext } from './Internal/OATContext';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_MODELS,
    SET_OAT_MODELS_POSITIONS
} from '../../Models/Constants/ActionTypes';
import {
    IAction,
    IOATNodeElement,
    IOATRelationshipElement
} from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { ElementNode } from './Internal/Classes/ElementNode';
import { ElementData } from './Internal/Classes/ElementData';
import { ElementEdge } from './Internal/Classes/ElementEdge';
import { ElementEdgeData } from './Internal/Classes/ElementEdgeData';
import { deepCopy } from '../../Models/Services/Utils';

const idClassBase = 'dtmi:com:example:';
const contextClassBase = 'dtmi:dtdl:context;2';
const versionClassBase = '1';
const defaultNodePosition = 25;
type OATGraphProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
    storedModels?: any;
    storedModelPositions?: any;
};

//  Converts the stored models to a graph nodes
const getGraphViewerElementsFromModels = (models, modelPositions) => {
    if (!models || !modelPositions) {
        return [];
    }

    // Format models
    const modelsCopy = deepCopy(models);
    const testRelationships = [];
    modelsCopy.forEach((input, index) => {
        let relationships = [];
        let contents = [];
        input['contents'].forEach((content) => {
            if (content['@type'] === OATComponentHandleName) {
                const componentRelationship = new ElementEdge(
                    `${input['@id']}${OATComponentHandleName}${content['schema']}`,
                    OATRelationshipHandleName,
                    input['@id'],
                    OATComponentHandleName,
                    content['schema'],
                    new ElementEdgeData(
                        `${input['@id']}${OATComponentHandleName}${content['schema']}`,
                        content['name'],
                        content['name'],
                        OATComponentHandleName
                    )
                );
                relationships = [...relationships, componentRelationship];
            } else if (content['@type'] === OATRelationshipHandleName) {
                const relationship = new ElementEdge(
                    content['@id']
                        ? content['@id']
                        : `${input['@id']}${OATRelationshipHandleName};${versionClassBase}`,
                    OATRelationshipHandleName,
                    input['@id'],
                    OATRelationshipHandleName,
                    content['target'],
                    new ElementEdgeData(
                        content['@id']
                            ? content['@id']
                            : `${input['@id']}${OATComponentHandleName};${versionClassBase}`,
                        content['name'],
                        content['displayName'],
                        OATRelationshipHandleName
                    )
                );
                relationships = [...relationships, relationship];
            } else {
                contents = [...contents, content];
            }
        });
        if (input['extends']) {
            const extendRelationship = new ElementEdge(
                `${input['@id']}${OATExtendHandleName}${input['extends']}`,
                OATRelationshipHandleName,
                input['@id'],
                OATExtendHandleName,
                input['extends'],
                new ElementEdgeData(
                    `${input['@id']}${OATExtendHandleName}${input['extends']}`,
                    '',
                    '',
                    OATExtendHandleName
                )
            );
            relationships = [...relationships, extendRelationship];
        }
        const newNode = new ElementNode(
            input['@id'],
            input['@type'],
            {
                x:
                    modelPositions.length > 0
                        ? modelPositions[index].position.x
                        : defaultNodePosition,
                y:
                    modelPositions.length > 0
                        ? modelPositions[index].position.y
                        : defaultNodePosition
            },
            new ElementData(
                input['@id'],
                input['displayName'],
                input['@type'],
                contents,
                contextClassBase
            )
        );
        testRelationships.push(newNode, ...relationships);
    });

    return testRelationships;
};
const nodeWidth = 300;
const nodeHeight = 100;

const OATGraphViewer = ({ state, dispatch }: OATGraphProps) => {
    const {
        model,
        models,
        importModels,
        deletedModelId,
        selectedModelId,
        editedModelName,
        editedModelId,
        modelPositions
    } = state;
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
    const currentNodeIdRef = useRef('');
    const currentHandleIdRef = useRef('');
    const [showRelationships, setShowRelationships] = useState(true);
    const [showInheritances, setShowInheritances] = useState(true);
    const [showComponents, setShowComponents] = useState(true);
    const [rfInstance, setRfInstance] = useState(null);

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const applyLayoutToElements = (elements, direction = 'TB') => {
        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({ rankdir: direction });

        elements.forEach((el) => {
            if (isNode(el)) {
                dagreGraph.setNode(el.id, {
                    width: nodeWidth,
                    height: nodeHeight
                });
            } else {
                dagreGraph.setEdge(el.source, el.target);
            }
        });

        dagre.layout(dagreGraph);

        return elements.map((el) => {
            if (isNode(el)) {
                const nodeWithPosition = dagreGraph.node(el.id);
                el.targetPosition = isHorizontal ? 'left' : 'top';
                el.sourcePosition = isHorizontal ? 'right' : 'bottom';

                el.position = {
                    x:
                        nodeWithPosition.x -
                        nodeWidth / 2 +
                        // unfortunately we need this little hack to pass a slightly different position
                        // to notify react flow about the change. Its required for V9 only and migth be removed later.
                        Math.random() / 1000,
                    y: nodeWithPosition.y - nodeHeight / 2
                };
            }

            return el;
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
                (element) => element.id === currentNodeIdRef.current
            );
            if (node && !node.source) {
                const newId = model['@id'];
                elements.forEach((x) => {
                    if (x.source && x.source === currentNodeIdRef.current) {
                        x.source = newId;
                    }
                    if (x.target && x.target === currentNodeIdRef.current) {
                        x.target = newId;
                    }
                });
                const propertyItems = model.contents.filter(
                    (property) =>
                        typeof property['@type'] === 'object' &&
                        property['@type'][0] === 'property'
                );
                node.id = newId;
                node.data.id = newId;
                node.data.name = model['displayName'];
                node.data.content = propertyItems;
                setElements([...elements]);
                currentNodeIdRef.current = newId;
            }
        }
    }, [model]);

    useEffect(() => {
        // Detects when a Model is deleted outside of the component and Updates the elements state
        let importModelsList = [...elements];
        if (importModels.length > 0) {
            importModels.forEach((input) => {
                const node = elements.find(
                    (element) => element.id === input['@id']
                );
                if (node) {
                    importModelsList = importModelsList.filter(
                        (element) =>
                            (!element.source && element.id !== input['@id']) ||
                            (element.source && element.source !== input['@id'])
                    );
                }
                let relationships = [];
                let contents = [];
                input['contents'].forEach((content) => {
                    if (content['@type'] === OATComponentHandleName) {
                        const componentRelationship = new ElementEdge(
                            `${input['@id']}${OATComponentHandleName}${content['schema']}`,
                            OATRelationshipHandleName,
                            input['@id'],
                            OATComponentHandleName,
                            content['schema'],
                            new ElementEdgeData(
                                `${input['@id']}${OATComponentHandleName}${content['schema']}`,
                                content['name'],
                                content['name'],
                                OATComponentHandleName
                            )
                        );
                        relationships = [
                            ...relationships,
                            componentRelationship
                        ];
                    } else if (content['@type'] === OATRelationshipHandleName) {
                        const relationship = new ElementEdge(
                            content['@id']
                                ? content['@id']
                                : `${input['@id']}${OATRelationshipHandleName};${versionClassBase}`,
                            OATRelationshipHandleName,
                            input['@id'],
                            OATRelationshipHandleName,
                            content['target'],
                            new ElementEdgeData(
                                content['@id']
                                    ? content['@id']
                                    : `${input['@id']}${OATComponentHandleName};${versionClassBase}`,
                                content['name'],
                                content['displayName'],
                                OATRelationshipHandleName
                            )
                        );
                        relationships = [...relationships, relationship];
                    } else {
                        contents = [...contents, content];
                    }
                });
                if (input['extends']) {
                    const extendRelationship = new ElementEdge(
                        `${input['@id']}${OATExtendHandleName}${input['extends']}`,
                        OATRelationshipHandleName,
                        input['@id'],
                        OATExtendHandleName,
                        input['extends'],
                        new ElementEdgeData(
                            `${input['@id']}${OATExtendHandleName}${input['extends']}`,
                            '',
                            '',
                            OATExtendHandleName
                        )
                    );
                    relationships = [...relationships, extendRelationship];
                }
                const newNode = new ElementNode(
                    input['@id'],
                    input['@type'],
                    positionLookUp(importModelsList),
                    new ElementData(
                        input['@id'],
                        input['displayName'],
                        input['@type'],
                        contents,
                        contextClassBase
                    )
                );
                importModelsList.push(newNode, ...relationships);
            });
            const positionedElements = applyLayoutToElements([
                ...importModelsList
            ]);
            setElements(positionedElements);
        }
    }, [importModels]);

    useEffect(() => {
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
        // Detects when a Model is selected outside of the component
        const node = elements.find((element) => element.id === selectedModelId);
        if (node) {
            currentNodeIdRef.current = node.id;
            const modelClicked = {
                '@id': node.id,
                '@type': node.data.type,
                '@context': node.data.context,
                displayName: node.data.name,
                contents: node.data.content
            };
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelClicked
            });
        }
    }, [selectedModelId]);

    useEffect(() => {
        // Detects when a Model name is edited outside of the component and Updates the elements state
        const node = elements.find((element) => element.id === selectedModelId);
        if (node) {
            node.data.name = editedModelName;
            const modelClicked = {
                '@id': node.id,
                '@type': node.data.type,
                '@context': node.data.context,
                displayName: node.data.name,
                contents: node.data.content
            };
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelClicked
            });
            setElements([...elements]);
        }
    }, [editedModelName]);

    useEffect(() => {
        // Detects when a Model id is edited outside of the component and Updates the elements state
        const node = elements.find((element) => element.id === selectedModelId);
        if (node) {
            elements
                .filter((x) => x.source === currentNodeIdRef.current)
                .forEach((x) => (x.source = editedModelId));
            elements
                .filter((x) => x.target === currentNodeIdRef.current)
                .forEach((x) => (x.target = state.editedModelId));
            node.id = state.editedModelId;
            node.data.id = state.editedModelId;
            const modelClicked = {
                '@id': node.id,
                '@type': node.data.type,
                '@context': node.data.context,
                displayName: node.data.name,
                contents: node.data.content
            };
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelClicked
            });
            setElements([...elements]);
            currentNodeIdRef.current = editedModelId;
        }
    }, [editedModelId]);

    const setCurrentNode = (id) => {
        currentNodeIdRef.current = id;
    };

    const providerVal = useMemo(
        () => ({
            elements,
            setElements,
            setCurrentNode,
            dispatch,
            currentNodeIdRef,
            showRelationships,
            showInheritances,
            showComponents,
            state
        }),
        [
            elements,
            setElements,
            setCurrentNode,
            dispatch,
            currentNodeIdRef,
            showRelationships,
            showInheritances,
            showComponents,
            state
        ]
    );

    const nodeTypes = useMemo(() => ({ Interface: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(() => ({ Relationship: OATGraphCustomEdge }), []);

    const onElementsRemove = (elementsToRemove: IOATNodeElement) => {
        if (!state.modified) {
            // Remove an specific node and all related edges
            dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: null });
            setElements((els) => removeElements(elementsToRemove, els));
        }
    };

    const onLoad = useCallback((_reactFlowInstance) => {
        _reactFlowInstance.fitView();
        _reactFlowInstance.zoomOut();
        _reactFlowInstance.zoomOut();
        setRfInstance(_reactFlowInstance);
    }, []);

    const onNewModelClick = () => {
        if (!state.modified) {
            // Create a new floating node
            const name = `Model${newModelId}`;
            const id = `${idClassBase}model${newModelId};${versionClassBase}`;
            const newNode = {
                id: id,
                type: OATInterfaceType,
                position: positionLookUp(),
                data: {
                    name: name,
                    type: OATInterfaceType,
                    id: id,
                    content: [],
                    context: contextClassBase
                }
            };
            const positionedElements = applyLayoutToElements([
                ...elements,
                newNode
            ]);
            setElements(positionedElements);
        }
    };

    const onNodeDragStop = (evt, node) => {
        // Checks if a node is being draged into another node to create a relationship between them
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
                const params: IOATRelationshipElement = {
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
                const params: IOATRelationshipElement = {
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
        // Stores values before connection is created
        currentNodeIdRef.current = params.handleId ? params.nodeId : null;
        currentHandleIdRef.current = params.handleId ? params.handleId : null;
    };

    const onConnectStop = (evt) => {
        // Retrieves information and creates a desired relationship between nodes
        const params: IOATRelationshipElement = {
            source: currentNodeIdRef.current,
            sourceHandle: currentHandleIdRef.current,
            label: '',
            markerEnd: 'arrow',
            type: OATRelationshipHandleName,
            data: {
                name: '',
                displayName: '',
                id: `${currentNodeIdRef.current}${currentHandleIdRef.current}`,
                type: currentHandleIdRef.current
            }
        };
        const target = (evt.path || []).find(
            (element) => element.dataset && element.dataset.id
        );
        if (target) {
            if (currentHandleIdRef.current !== OATUntargetedRelationshipName) {
                params.target = target.dataset.id;
                params.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${target.dataset.id}`;
                params.data.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${target.dataset.id}`;
                setElements((els) => addEdge(params, els));
            }
        } else {
            const node = elements.find(
                (element) => element.id === currentNodeIdRef.current
            );
            const componentRelativePosition = 120;

            if (currentHandleIdRef.current === OATUntargetedRelationshipName) {
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
                        x: node.position.x + componentRelativePosition,
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
                params.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${id}`;
                params.data.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${id}`;
                params.data.type = `${OATUntargetedRelationshipName}`;
                setElements((es) => [...addEdge(params, es), newNode]);
            }
            if (
                currentHandleIdRef.current === OATComponentHandleName ||
                currentHandleIdRef.current === OATExtendHandleName ||
                currentHandleIdRef.current === OATRelationshipHandleName
            ) {
                const name = `Model${newModelId}`;
                const id = `${idClassBase}model${newModelId};${versionClassBase}`;
                const newNode = {
                    id: id,
                    type: OATInterfaceType,
                    position: {
                        x: node.position.x - componentRelativePosition,
                        y: node.position.y + componentRelativePosition
                    },
                    data: {
                        name: name,
                        type: OATInterfaceType,
                        id: id,
                        content: [],
                        context: contextClassBase
                    }
                };
                params.target = id;
                params.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${id}`;
                params.data.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${id}`;
                params.data.type = currentHandleIdRef.current;
                setElements((es) => [...addEdge(params, es), newNode]);
            }
        }
    };

    const storeElements = () => {
        // Save the session data into the local storage
        const nodePositions = elements.reduce((collection, element) => {
            if (!element.source) {
                collection.push({
                    id: element.id,
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

    const translatedOutput = useMemo(() => {
        // Creates the json object in the DTDL standard based on the content of the nodes
        const outputObject = elements;
        const nodes = outputObject.reduce((currentNodes, currentNode) => {
            if (currentNode.data.type === OATInterfaceType) {
                const node = {
                    '@id': currentNode.id,
                    '@type': OATInterfaceType,
                    '@context': currentNode.data.context,
                    displayName: currentNode.data.name,
                    contents: [...currentNode.data.content]
                };
                currentNodes.push(node);
            } else if (currentNode.data.type === OATRelationshipHandleName) {
                const sourceNode = currentNodes.find(
                    (element) => element['@id'] === currentNode.source
                );
                const relationship = {
                    '@type': currentNode.data.type,
                    name: currentNode.data.name,
                    displayName: currentNode.data.displayName,
                    target: currentNode.target
                };
                const found = sourceNode.contents.find(
                    (element) => element.target === currentNode.target
                );

                // Prevent duplicated relationships
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
        dispatch({
            type: SET_OAT_MODELS,
            payload: translatedOutput
        });
    }, [translatedOutput]);

    const onElementClick = (evt, node) => {
        if (!state.modified) {
            // Checks if a node is selected to display it in the property editor
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
                dispatch({
                    type: SET_OAT_PROPERTY_EDITOR_MODEL,
                    payload: selectedModel
                });
            }
        }
    };

    const positionLookUp = (newNodes = null) => {
        const { position } = rfInstance.toObject();
        const areaDistanceX = 250;
        const areaDistanceY = 80;
        let defaultPositionX = 0 - position[0] + areaDistanceX;
        let defaultPositionY = 0 - position[1] + areaDistanceY * 2;
        const maxWidth = 800;
        const defaultPosition = defaultPositionX;
        const minWidth = 300;
        const minHeight = 100;
        const lookUpElements = newNodes
            ? [...elements, ...newNodes]
            : [...elements];

        let nodes = lookUpElements.find(
            (element) =>
                !element.source &&
                defaultPositionX - areaDistanceX < element.position.x &&
                element.position.x < defaultPositionX + areaDistanceX &&
                defaultPositionY - areaDistanceY < element.position.y &&
                element.position.y < defaultPositionY + areaDistanceY
        );
        while (nodes) {
            if (defaultPositionX > maxWidth) {
                defaultPositionY = defaultPositionY + minHeight;
                defaultPositionX = defaultPosition;
            } else {
                defaultPositionX = defaultPositionX + minWidth;
            }
            nodes = lookUpElements.find(
                (element) =>
                    !element.source &&
                    defaultPositionX - areaDistanceX < element.position.x &&
                    element.position.x < defaultPositionX + areaDistanceX &&
                    defaultPositionY - areaDistanceY < element.position.y &&
                    element.position.y < defaultPositionY + areaDistanceY
            );
        }
        return { x: defaultPositionX, y: defaultPositionY };
    };

    return (
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
                        {!elements[0] && (
                            <Label styles={warningStyles}>
                                {t('OATGraphViewer.emptyGraph')}
                            </Label>
                        )}
                        <Stack>
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
