import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTheme, Icon, FontSizes, ActionButton } from '@fluentui/react';
import {
    getEdgeCenter,
    useStoreState,
    getBezierPath,
    Position as FlowPosition,
    Node,
    Edge
} from 'react-flow-renderer';
import {
    getGraphViewerStyles,
    getRelationshipTextFieldStyles
} from '../OATGraphViewer.styles';
import { ElementsContext } from './OATContext';
import {
    OAT_UNTARGETED_RELATIONSHIP_NAME,
    OAT_RELATIONSHIP_HANDLE_NAME,
    OAT_COMPONENT_HANDLE_NAME,
    OAT_EXTEND_HANDLE_NAME
} from '../../../Models/Constants/Constants';
import {
    SET_OAT_SELECTED_MODEL,
    SET_OAT_MODELS
} from '../../../Models/Constants/ActionTypes';
import { getDisplayName } from '../../OATPropertyEditor/Utils';
import {
    IOATGraphCustomEdgeProps,
    IOATNodePosition
} from '../../../Models/Constants';
import OATTextFieldName from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldName';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { deepCopy } from '../../../Models/Services/Utils';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

const foreignObjectSize = 180;
const foreignObjectSizeExtendRelation = 20;
const offsetSmall = 5;
const offsetMedium = 10;
const rightAngleValue = 1.5708;
const separation = 10;

const getPolygon = (vertexes: IOATNodePosition[]): string =>
    vertexes.map((v) => `${v.x},${v.y}`).join(' ');

interface IPolygonElement {
    element: Edge<any>;
}
interface IPolygonSource {
    componentPolygon: string;
    polygonSourceX: number;
    polygonSourceY: number;
    edgePathSourceX: number;
    edgePathSourceY: number;
    orientation: boolean;
}
interface IPolygonTarget {
    inheritancePolygon: string;
    relationshipPolygon: string;
    polygonTargetX: number;
    polygonTargetY: number;
    edgePathTargetX: number;
    edgePathTargetY: number;
}

type IPolygon = IPolygonElement & IPolygonSource & IPolygonTarget;

const getComponentPolygon = (
    polygonSourceX: number,
    polygonSourceY: number,
    baseVector: number,
    heightVector: number,
    verticalPolygon: boolean
): string => {
    const vertexAX = verticalPolygon
        ? polygonSourceX + offsetSmall * baseVector
        : polygonSourceX + offsetSmall * baseVector;
    const vertexAY = verticalPolygon
        ? polygonSourceY + offsetSmall * heightVector
        : polygonSourceY - offsetSmall * heightVector;
    const vertexBX = verticalPolygon
        ? polygonSourceX
        : polygonSourceX + offsetMedium * baseVector;
    const vertexBY = verticalPolygon
        ? polygonSourceY + offsetMedium * heightVector
        : polygonSourceY;
    const vertexCX = verticalPolygon
        ? polygonSourceX - offsetSmall * baseVector
        : polygonSourceX + offsetSmall * baseVector;
    const vertexCY = verticalPolygon
        ? polygonSourceY + offsetSmall * heightVector
        : polygonSourceY + offsetSmall * heightVector;
    const vertexDX = polygonSourceX;
    const vertexDY = polygonSourceY;
    return getPolygon([
        { x: vertexAX, y: vertexAY },
        { x: vertexBX, y: vertexBY },
        { x: vertexCX, y: vertexCY },
        { x: vertexDX, y: vertexDY }
    ]);
};

const getInheritancePolygon = (
    polygonTargetX: number,
    polygonTargetY: number,
    baseVector: number,
    heightVector: number,
    verticalPolygon: boolean
): string => {
    const vertexAX = verticalPolygon
        ? polygonTargetX + offsetSmall * baseVector
        : polygonTargetX + offsetMedium * baseVector;
    const vertexAY = verticalPolygon
        ? polygonTargetY + offsetMedium * heightVector
        : polygonTargetY + offsetSmall * heightVector;
    const vertexBX = verticalPolygon
        ? polygonTargetX - offsetSmall * baseVector
        : polygonTargetX + offsetMedium * baseVector;
    const vertexBY = verticalPolygon
        ? polygonTargetY + offsetMedium * heightVector
        : polygonTargetY - offsetSmall * heightVector;
    const vertexCX = polygonTargetX;
    const vertexCY = polygonTargetY;
    return getPolygon([
        { x: vertexAX, y: vertexAY },
        { x: vertexBX, y: vertexBY },
        { x: vertexCX, y: vertexCY }
    ]);
};

const getRelationshipPolygon = (
    polygonTargetX: number,
    polygonTargetY: number,
    baseVector: number,
    heightVector: number,
    verticalPolygon: boolean
): string => {
    const vertexAX = verticalPolygon
        ? polygonTargetX + offsetSmall * heightVector
        : polygonTargetX + offsetMedium * baseVector;
    const vertexAY = verticalPolygon
        ? polygonTargetY + offsetMedium * heightVector
        : polygonTargetY - offsetSmall * heightVector;
    const vertexBX = polygonTargetX;
    const vertexBY = polygonTargetY;
    const vertexCX = verticalPolygon
        ? polygonTargetX - offsetSmall * heightVector
        : polygonTargetX + offsetMedium * baseVector;
    const vertexCY = verticalPolygon
        ? polygonTargetY + offsetMedium * heightVector
        : polygonTargetY + offsetSmall * heightVector;
    return getPolygon([
        { x: vertexAX, y: vertexAY },
        { x: vertexBX, y: vertexBY },
        { x: vertexCX, y: vertexCY },
        { x: vertexBX, y: vertexBY }
    ]);
};

const getMidPointForNode = (node: Node<any>): number[] => {
    let x = 0;
    let y = 0;
    if (node) {
        x = node.__rf.position.x + node.__rf.width / 2;
        y = node.__rf.position.y + node.__rf.height / 2;
    }

    return [x, y];
};

const OATGraphCustomEdge: React.FC<IOATGraphCustomEdgeProps> = ({
    id,
    data,
    markerEnd
}) => {
    const { execute } = useContext(CommandHistoryContext);
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(getDisplayName(data.name));
    const {
        dispatch,
        showRelationships,
        showInheritances,
        showComponents,
        state
    } = useContext(ElementsContext);
    const { selection, models } = state;

    const graphViewerStyles = getGraphViewerStyles();
    const relationshipTextFieldStyles = getRelationshipTextFieldStyles();
    const theme = useTheme();
    const nodes = useStoreState(
        (state) => state.nodes,
        (l, r) =>
            l.length === r.length &&
            l.every((li) => {
                const rm = r.find((ri) => ri.id === li.id);
                return (
                    rm &&
                    rm.__rf.position.x === li.__rf.position.x &&
                    rm.__rf.position.y === li.__rf.position.y &&
                    rm.__rf.width === li.__rf.width &&
                    rm.__rf.height === li.__rf.height
                );
            })
    );
    const edges = useStoreState((state) => state.edges);

    const edge = useMemo(() => edges.find((x) => x.id === id), [edges, id]);
    const [source, sourceX, sourceY] = useMemo(() => {
        const source = nodes.find((x) => x.id === edge.source);
        return [source, ...getMidPointForNode(source)];
    }, [edge, nodes]);
    const [target, targetX, targetY] = useMemo(() => {
        const target = nodes.find((x) => x.id === edge.target);
        return [target, ...getMidPointForNode(target)];
    }, [edge, nodes]);

    const isSelected = useMemo(
        () =>
            selection &&
            selection.modelId === source.id &&
            ((data['@type'] === OAT_EXTEND_HANDLE_NAME &&
                selection.contentId === data['@id']) ||
                (data['@type'] !== OAT_EXTEND_HANDLE_NAME &&
                    selection.contentId === data.name)),
        [data, selection, source]
    );

    useEffect(() => {
        if (nameEditor && !isSelected) {
            setNameEditor(false);
        }
    }, [isSelected, nameEditor]);

    useEffect(() => {
        if (data.name) {
            setNameText(data.name);
        }
    }, [data]);

    const getSourceComponents = (
        betaAngle: number,
        sourceBase: number,
        sourceBetaAngle: number,
        sourceHeight: number,
        alphaAngle: number,
        adjustedSourceY: number,
        adjustedSourceX: number,
        baseVector: number,
        heightVector: number,
        adjustmentSourceX: number,
        adjustmentSourceY: number
    ): IPolygonSource => {
        // Using triangulated connection position to create componentPolygon and angles to define orientation
        let newHeight = 0;
        let newBase = 0;
        let componentPolygon = '';
        let polygonSourceX = 0;
        let polygonSourceY = 0;
        let edgePathSourceX = 0;
        let edgePathSourceY = 0;
        let orientation = false;
        if (betaAngle < sourceBetaAngle) {
            orientation = true;
            newHeight = sourceHeight + adjustmentSourceY * heightVector;
            const newHypotenuse = newHeight / Math.sin(alphaAngle);
            newBase = Math.sqrt(
                newHypotenuse * newHypotenuse - newHeight * newHeight
            );
            polygonSourceX = adjustedSourceX + newBase * baseVector;
            polygonSourceY = adjustedSourceY + newHeight * heightVector;
            componentPolygon = getComponentPolygon(
                polygonSourceX,
                polygonSourceY,
                baseVector,
                heightVector,
                orientation
            );
            edgePathSourceX = polygonSourceX;
            edgePathSourceY =
                data['@type'] === OAT_COMPONENT_HANDLE_NAME
                    ? polygonSourceY +
                      offsetMedium * (sourceY > targetY ? -1 : 1)
                    : polygonSourceY;
        } else {
            newBase = sourceBase + adjustmentSourceX * baseVector;
            const newHypotenuse = newBase / Math.sin(betaAngle);
            newHeight = Math.sqrt(
                newHypotenuse * newHypotenuse - newBase * newBase
            );
            polygonSourceX = adjustedSourceX + newBase * baseVector;
            polygonSourceY = sourceY + newHeight * heightVector;
            componentPolygon = getComponentPolygon(
                polygonSourceX,
                polygonSourceY,
                baseVector,
                heightVector,
                orientation
            );
            edgePathSourceX =
                data['@type'] === OAT_COMPONENT_HANDLE_NAME
                    ? polygonSourceX +
                      offsetMedium * (adjustedSourceX > targetX ? -1 : 1)
                    : polygonSourceX;
            edgePathSourceY = polygonSourceY;
        }
        return {
            componentPolygon: componentPolygon,
            polygonSourceX: polygonSourceX,
            polygonSourceY: polygonSourceY,
            edgePathSourceX: edgePathSourceX,
            edgePathSourceY: edgePathSourceY,
            orientation: orientation
        };
    };

    const getTargetComponents = (
        betaAngle: number,
        targetBase: number,
        targetBetaAngle: number,
        targetHeight: number,
        alphaAngle: number,
        adjustedTargetX: number,
        adjustedTargetY: number,
        baseVector: number,
        heightVector: number,
        adjustmentTargetX: number,
        adjustmentTargetY: number
    ): IPolygonTarget => {
        let newHeight = 0;
        let newBase = 0;
        let polygonTargetX = 0;
        let polygonTargetY = 0;
        let inheritancePolygon = '';
        let relationshipPolygon = '';
        let edgePathTargetX = 0;
        let edgePathTargetY = 0;

        // Using triangulated connection position to create inheritance and relationship polygons and angles to define orientation
        if (betaAngle < targetBetaAngle) {
            newHeight = targetHeight + adjustmentTargetY * heightVector;
            const newHypotenuse = newHeight / Math.sin(alphaAngle);
            newBase = Math.sqrt(
                newHypotenuse * newHypotenuse - newHeight * newHeight
            );
            polygonTargetX = adjustedTargetX + newBase * baseVector;
            polygonTargetY = adjustedTargetY + newHeight * heightVector;
            inheritancePolygon = getInheritancePolygon(
                polygonTargetX,
                polygonTargetY,
                baseVector,
                heightVector,
                true
            );
            relationshipPolygon = getRelationshipPolygon(
                polygonTargetX,
                polygonTargetY,
                baseVector,
                heightVector,
                true
            );
            edgePathTargetX = polygonTargetX;
            edgePathTargetY =
                data['@type'] === OAT_EXTEND_HANDLE_NAME ||
                data['@type'] === OAT_RELATIONSHIP_HANDLE_NAME ||
                data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME
                    ? polygonTargetY +
                      offsetMedium * (sourceY < targetY ? -1 : 1)
                    : polygonTargetY;
        } else {
            newBase = targetBase + adjustmentTargetX * baseVector;
            const newHypotenuse = newBase / Math.sin(betaAngle);
            newHeight = Math.sqrt(
                newHypotenuse * newHypotenuse - newBase * newBase
            );
            polygonTargetX = adjustedTargetX + newBase * baseVector;
            polygonTargetY = adjustedTargetY + newHeight * heightVector;
            inheritancePolygon = getInheritancePolygon(
                polygonTargetX,
                polygonTargetY,
                baseVector,
                heightVector,
                false
            );
            relationshipPolygon = getRelationshipPolygon(
                polygonTargetX,
                polygonTargetY,
                baseVector,
                heightVector,
                false
            );

            edgePathTargetX =
                data['@type'] === OAT_EXTEND_HANDLE_NAME ||
                data['@type'] === OAT_RELATIONSHIP_HANDLE_NAME ||
                data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME
                    ? polygonTargetX +
                      offsetMedium * (sourceX < targetX ? -1 : 1)
                    : polygonTargetX;
            edgePathTargetY = polygonTargetY;
        }
        return {
            inheritancePolygon: inheritancePolygon,
            relationshipPolygon: relationshipPolygon,
            polygonTargetX: polygonTargetX,
            polygonTargetY: polygonTargetY,
            edgePathTargetX: edgePathTargetX,
            edgePathTargetY: edgePathTargetY
        };
    };

    const polygons = useMemo(() => {
        // With this Memo function the values for Polygons Points are calculated
        let adjustedSourceY = sourceY;
        let adjustedSourceX = sourceX;
        let adjustmentSourceX = 0;
        let adjustmentSourceY = 0;
        let adjustedTargetY = targetY;
        let adjustedTargetX = targetX;
        let adjustmentTargetX = 0;
        let adjustmentTargetY = 0;

        let polygons: IPolygon = {} as IPolygon;
        if (edge) {
            const polygonElement: IPolygonElement = {
                element: edge
            };
            // If a valid element we get size based in positioning
            const sourceNodeSizeX = source.__rf.width;
            const sourceNodeSizeY = source.__rf.height;
            const targetNodeSizeX = target.__rf.width;
            const targetNodeSizeY = target.__rf.height;
            // Getting vectors to adjust angle from source to target
            let heightVector = targetY > sourceY ? 1 : -1;
            let baseVector = targetX > sourceX ? 1 : -1;
            const parallels = edges.filter(
                (x) => x.source === edge.source && x.target === edge.target
            );
            if (parallels.length > 1) {
                const sourceRange = (separation * (parallels.length - 1)) / 2;
                adjustedSourceX = adjustedSourceX - sourceRange;
                adjustedSourceY = adjustedSourceY + sourceRange * baseVector;
                const indexX = parallels.findIndex((x) => x.id === id);
                adjustedSourceX = indexX * separation + adjustedSourceX;
                adjustedSourceY =
                    adjustedSourceY - indexX * separation * baseVector;
                adjustmentSourceX = sourceX - adjustedSourceX;
                adjustmentSourceY = sourceY - adjustedSourceY;
            }
            // Using source and target points to triangulate and get angles
            const triangleHeight = (targetY - adjustedSourceY) * heightVector;
            const triangleBase = (targetX - adjustedSourceX) * baseVector;
            const triangleHypotenuse = Math.sqrt(
                triangleHeight * triangleHeight + triangleBase * triangleBase
            );
            // Using source size to triangulate connection with source edge
            const sourceHeight = sourceNodeSizeY / 2;
            const sourceBase = sourceNodeSizeX / 2;
            const sourceHypotenuse = Math.sqrt(
                sourceHeight * sourceHeight + sourceBase * sourceBase
            );
            const sourceBetaAngle = Math.asin(sourceBase / sourceHypotenuse);
            const alphaAngle = Math.asin(triangleHeight / triangleHypotenuse);
            const betaAngle = rightAngleValue - alphaAngle;
            const polygonSource = getSourceComponents(
                betaAngle,
                sourceBase,
                sourceBetaAngle,
                sourceHeight,
                alphaAngle,
                adjustedSourceY,
                adjustedSourceX,
                baseVector,
                heightVector,
                adjustmentSourceX,
                adjustmentSourceY
            );
            // Getting vectors to adjust angle from target to source
            heightVector = targetY < sourceY ? 1 : -1;
            baseVector = targetX < sourceX ? 1 : -1;
            if (parallels.length > 1) {
                const targetRange = (separation * (parallels.length - 1)) / 2;
                adjustedTargetX = adjustedTargetX - targetRange;
                adjustedTargetY = adjustedTargetY - targetRange;
                const indexX = parallels.findIndex((x) => x.id === id);
                adjustedTargetX = indexX * separation + adjustedTargetX;
                adjustedTargetY = indexX * separation + adjustedTargetY;
                adjustmentTargetX = targetX - adjustedTargetX;
                adjustmentTargetY = targetY - adjustedTargetY;
            }
            // Using source size to triangulate connection with target edge
            const targetHeight = targetNodeSizeY / 2;
            const targetBase = targetNodeSizeX / 2;
            const targetHypotenuse = Math.sqrt(
                targetHeight * targetHeight + targetBase * targetBase
            );
            const targetBetaAngle = Math.asin(targetBase / targetHypotenuse);
            const polygonTarget = getTargetComponents(
                betaAngle,
                targetBase,
                targetBetaAngle,
                targetHeight,
                alphaAngle,
                adjustedTargetX,
                adjustedTargetY,
                baseVector,
                heightVector,
                adjustmentTargetX,
                adjustmentTargetY
            );
            polygons = {
                ...polygonElement,
                ...polygonSource,
                ...polygonTarget
            };
        }
        return polygons;
    }, [id, source, sourceX, sourceY, targetX, targetY]);

    const onNameDoubleClick = () => {
        setNameEditor(true);
    };

    const edgePath = useMemo(() => {
        const {
            edgePathSourceX,
            edgePathSourceY,
            edgePathTargetX,
            edgePathTargetY,
            orientation
        } = polygons;
        const path =
            sourceX < targetX
                ? getBezierPath({
                      sourceX: edgePathSourceX,
                      sourceY: edgePathSourceY,
                      sourcePosition: orientation
                          ? FlowPosition.Bottom
                          : FlowPosition.Left,
                      targetX: edgePathTargetX,
                      targetY: edgePathTargetY,
                      targetPosition: orientation
                          ? FlowPosition.Top
                          : FlowPosition.Right
                  })
                : getBezierPath({
                      sourceX: edgePathTargetX,
                      sourceY: edgePathTargetY,
                      sourcePosition: orientation
                          ? FlowPosition.Top
                          : FlowPosition.Right,
                      targetX: edgePathSourceX,
                      targetY: edgePathSourceY,
                      targetPosition: orientation
                          ? FlowPosition.Bottom
                          : FlowPosition.Left
                  });
        return path;
    }, [polygons]);

    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY
    });

    const onDelete = () => {
        const deletion = () => {
            const dispatchDelete = () => {
                // Create models copy
                const modelsCopy = deepCopy(models);
                // Find relationship in models copy
                const model = modelsCopy.find(
                    (model) => model['@id'] === source.id
                );
                if (model) {
                    // Remove edge from model
                    model.contents = model.contents.filter(
                        (link) => link['@id'] !== id
                    );
                    dispatch({
                        type: SET_OAT_MODELS,
                        payload: modelsCopy
                    });
                    // Dispatch selected model to null
                    dispatch({
                        type: SET_OAT_SELECTED_MODEL,
                        payload: null
                    });
                }
            };

            dispatch({
                type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: selection
            });
        };

        if (!state.modified) {
            execute(deletion, undoDeletion);
        }
    };

    const onNameCommit = (value: string) => {
        const commit = () => {
            const modelsCopy = deepCopy(models);
            const model = modelsCopy.find(
                (model) => model['@id'] === source.id
            );
            const link =
                model &&
                model.contents.find(
                    (link) =>
                        link['@type'] === data['@type'] &&
                        link.name === nameText
                );
            if (link) {
                link.name = value;
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: modelsCopy
                });
                dispatch({
                    type: SET_OAT_SELECTED_MODEL,
                    payload: { modelId: source.id, contentId: value }
                });
            }

            setNameText(value);
            setNameEditor(false);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: selection
            });
        };

        execute(commit, undoCommit);
    };

    return (
        <>
            <path
                id={id}
                className={graphViewerStyles.widthPath}
                d={edgePath}
                onDoubleClick={onNameDoubleClick}
            />
            {data['@type'] === OAT_EXTEND_HANDLE_NAME && showInheritances && (
                <path
                    id={id}
                    className={
                        isSelected
                            ? graphViewerStyles.selectedInheritancePath
                            : graphViewerStyles.inheritancePath
                    }
                    d={edgePath}
                    onDoubleClick={onNameDoubleClick}
                    markerEnd={markerEnd}
                />
            )}
            {(data['@type'] === OAT_RELATIONSHIP_HANDLE_NAME ||
                data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME) &&
                showRelationships && (
                    <path
                        id={id}
                        className={
                            isSelected
                                ? graphViewerStyles.selectedEdgePath
                                : graphViewerStyles.edgePath
                        }
                        d={edgePath}
                        onDoubleClick={onNameDoubleClick}
                        markerEnd={markerEnd}
                    />
                )}
            {data['@type'] === OAT_COMPONENT_HANDLE_NAME && showComponents && (
                <path
                    id={id}
                    className={
                        isSelected
                            ? graphViewerStyles.selectedComponentPath
                            : graphViewerStyles.componentPath
                    }
                    d={edgePath}
                    onDoubleClick={onNameDoubleClick}
                    markerEnd={markerEnd}
                />
            )}
            {nameEditor && (
                <foreignObject
                    width={
                        data['@type'] === OAT_EXTEND_HANDLE_NAME
                            ? foreignObjectSizeExtendRelation
                            : foreignObjectSize
                    }
                    height={foreignObjectSize}
                    x={
                        data['@type'] !== OAT_EXTEND_HANDLE_NAME
                            ? edgeCenterX - foreignObjectSize / 2
                            : edgeCenterX
                    }
                    y={edgeCenterY}
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <div
                        className={graphViewerStyles.relationshipNameEditorBody}
                    >
                        {data['@type'] !== OAT_EXTEND_HANDLE_NAME && (
                            <OATTextFieldName
                                styles={relationshipTextFieldStyles}
                                value={nameText}
                                model={data}
                                models={models}
                                onCommit={onNameCommit}
                                autoFocus
                            />
                        )}
                        <div
                            className={graphViewerStyles.relationshipCTASection}
                        >
                            <ActionButton
                                className={
                                    data['@type'] !== OAT_EXTEND_HANDLE_NAME
                                        ? graphViewerStyles.edgeCancel
                                        : graphViewerStyles.extendCancel
                                }
                                onMouseDown={onDelete}
                            >
                                <Icon
                                    iconName="Trash"
                                    styles={{
                                        root: {
                                            fontSize: FontSizes.size10,
                                            color:
                                                theme.semanticColors.actionLink
                                        }
                                    }}
                                />
                            </ActionButton>
                        </div>
                    </div>
                </foreignObject>
            )}
            {!nameEditor &&
                ((data['@type'] === OAT_EXTEND_HANDLE_NAME &&
                    showInheritances) ||
                    (data['@type'] === OAT_COMPONENT_HANDLE_NAME &&
                        showComponents) ||
                    ((data['@type'] === OAT_RELATIONSHIP_HANDLE_NAME ||
                        data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME) &&
                        showRelationships)) && (
                    <text>
                        <textPath
                            href={`#${id}`}
                            className={graphViewerStyles.textPath}
                            startOffset="50%"
                            textAnchor="middle"
                            onDoubleClick={onNameDoubleClick}
                        >
                            {getDisplayName(data.name || data.displayName)}
                        </textPath>
                    </text>
                )}
            {data['@type'] === OAT_EXTEND_HANDLE_NAME && showInheritances && (
                <polygon
                    points={polygons.inheritancePolygon}
                    cx={polygons.polygonTargetX}
                    cy={polygons.polygonTargetY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.inheritanceShape}
                />
            )}
            {(data['@type'] === OAT_RELATIONSHIP_HANDLE_NAME ||
                data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME) &&
                showRelationships && (
                    <polygon
                        points={polygons.relationshipPolygon}
                        cx={polygons.polygonTargetX}
                        cy={polygons.polygonTargetY}
                        r={3}
                        strokeWidth={1.5}
                        className={graphViewerStyles.edgePath}
                    />
                )}
            {data['@type'] === OAT_COMPONENT_HANDLE_NAME && showComponents && (
                <polygon
                    points={polygons.componentPolygon}
                    cx={polygons.polygonSourceX}
                    cy={polygons.polygonSourceY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.componentShape}
                />
            )}
        </>
    );
};

export default OATGraphCustomEdge;
