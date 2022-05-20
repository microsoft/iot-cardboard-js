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
    removeElements
} from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import OATGraphCustomNode from './Internal/OATGraphCustomNode';
import OATGraphCustomEdge from './Internal/OATGraphCustomEdge';
import {
    OATDataStorageKey,
    OATUntargetedRelationshipName,
    OATRelationshipHandleName,
    OATExtendHandleName,
    OATInterfaceType,
    OATComponentHandleName
} from '../../Models/Constants/Constants';
import {
    getGraphViewerStyles,
    getGraphViewerButtonStyles,
    getGraphViewerWarningStyles
} from './OATGraphViewer.styles';
import { ElementsContext } from './Internal/OATContext';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_ELEMENTS
} from '../../Models/Constants/ActionTypes';
import {
    IAction,
    IOATNodeElement,
    IOATRelationShipElement
} from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { ElementNode } from './Internal/Classes/ElementNode';
import { ElementPosition } from './Internal/Classes/ElementPosition';
import { ElementData } from './Internal/Classes/ElementData';
import { ElementEdge } from './Internal/Classes/ElementEdge';
import { ElementEdgeData } from './Internal/Classes/ElementEdgeData';

const idClassBase = 'dtmi:com:example:';
const contextClassBase = 'dtmi:adt:context;2';
const versionClassBase = '1';
type OATGraphProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};

const getStoredElements = () => {
    const editorData = JSON.parse(localStorage.getItem(OATDataStorageKey));
    return editorData && editorData.models ? editorData.models : null;
};

const OATGraphViewer = ({ state, dispatch }: OATGraphProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const reactFlowWrapperRef = useRef(null);
    const storedElements = getStoredElements();
    const [elements, setElements] = useState(
        !storedElements ? [] : storedElements
    );
    const defaultPosition = 100;
    const [newModelId, setNewModelId] = useState(0);
    const graphViewerStyles = getGraphViewerStyles();
    const buttonStyles = getGraphViewerButtonStyles();
    const warningStyles = getGraphViewerWarningStyles();
    const currentNodeIdRef = useRef('');
    const currentHandleIdRef = useRef('');
    const {
        model,
        importModels,
        deletedModelId,
        selectedModelId,
        editedModelName,
        editedModelId
    } = state;
    const [showRelationships, setShowRelationships] = useState(true);
    const [showInheritances, setShowInheritances] = useState(true);
    const [showComponents, setShowComponents] = useState(true);

    useEffect(() => {
        // Identifies which is the next model Id on creating new nodes and updates the Local Storage
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
        // Detect changes outside of the component on the selected model
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
        // Detects when a Model is deleted outside of the component and Updates the elements state
        const importModelsList = [];
        if (importModels.length > 0) {
            importModels.forEach((input) => {
                const node = elements.find(
                    (element) => element.id === input['@id']
                );
                if (!node) {
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
                        } else if (
                            content['@type'] === OATRelationshipHandleName
                        ) {
                            const relationship = new ElementEdge(
                                content['@id'],
                                OATRelationshipHandleName,
                                input['@id'],
                                OATRelationshipHandleName,
                                content['target'],
                                new ElementEdgeData(
                                    content['@id'],
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
                        new ElementPosition(defaultPosition, defaultPosition),
                        new ElementData(
                            input['@id'],
                            input['displayName'],
                            input['@type'],
                            contents,
                            contextClassBase
                        )
                    );
                    importModelsList.push(newNode, ...relationships);
                }
            });
            setElements([...importModelsList]);
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
            showRelationships,
            showInheritances,
            showComponents
        }),
        [
            elements,
            setElements,
            setCurrentNode,
            dispatch,
            showRelationships,
            showInheritances,
            showComponents
        ]
    );

    const nodeTypes = useMemo(() => ({ Interface: OATGraphCustomNode }), []);

    const edgeTypes = useMemo(() => ({ Relationship: OATGraphCustomEdge }), []);

    const onElementsRemove = (elementsToRemove: IOATNodeElement) =>
        // Remove an specific node and all related edges
        setElements((els) => removeElements(elementsToRemove, els));

    const onLoad = useCallback(
        (_reactFlowInstance) => _reactFlowInstance.fitView(),
        []
    );

    const onNewModelClick = () => {
        // Create a new floating node
        const name = `Model${newModelId}`;
        const id = `${idClassBase}model${newModelId};${versionClassBase}`;
        const newNode = {
            id: id,
            type: OATInterfaceType,
            position: { x: defaultPosition, y: defaultPosition },
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
        currentNodeIdRef.current = params.handleId ? params.nodeId : null;
        currentHandleIdRef.current = params.handleId ? params.handleId : null;
    };

    const onConnectStop = (evt) => {
        // Retrieves information and creates a desired relationship between nodes
        const params: IOATRelationShipElement = {
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
            params.target = target.dataset.id;
            params.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${target.dataset.id}`;
            params.data.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${target.dataset.id}`;
            setElements((els) => addEdge(params, els));
        } else {
            const node = elements.find(
                (element) => element.id === currentNodeIdRef.current
            );
            const componentRelativePosition = 120;

            if (currentHandleIdRef.current === OATRelationshipHandleName) {
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
                params.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${id}`;
                params.data.id = `${currentNodeIdRef.current}${currentHandleIdRef.current}${id}`;
                params.data.type = `${OATUntargetedRelationshipName}`;
                setElements((es) => [...addEdge(params, es), newNode]);
            }
        }
    };

    const storeElements = () => {
        // Save the desire session data into the local storage
        const nodePositions = elements.reduce((collection, element) => {
            if (!element.source) {
                collection.push({
                    id: element.id,
                    position: element.position
                });
            }
            return collection;
        }, []);
        const editorData = JSON.parse(localStorage.getItem(OATDataStorageKey));
        const oatEditorData = {
            ...editorData,
            models: elements,
            modelPositions: nodePositions,
            projectName:
                editorData && editorData.projectName
                    ? editorData.projectName
                    : t('OATGraphViewer.project'),
            projectDescription:
                editorData && editorData.description
                    ? editorData && editorData.description
                    : t('OATGraphViewer.description')
        };

        localStorage.setItem(OATDataStorageKey, JSON.stringify(oatEditorData));
    };

    const translatedOutput = useMemo(() => {
        // Creates the json object in the DTDL standard based on the content of the nodes
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
        // Sends information to the page with the DTDL json
        const oatEditorData = JSON.parse(
            localStorage.getItem(OATDataStorageKey)
        );
        if (oatEditorData) {
            oatEditorData.modelTwins = translatedOutput;
            localStorage.setItem(
                OATDataStorageKey,
                JSON.stringify(oatEditorData)
            );
        }
        dispatch({
            type: SET_OAT_ELEMENTS,
            payload: { digitalTwinsModels: translatedOutput }
        });
    }, [translatedOutput]);

    const onElementClick = (evt, node) => {
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

                        <MiniMap />
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
