import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    Callout,
    DefaultButton,
    DirectionalHint,
    FontSizes
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import {
    getEdgeCenter,
    useStoreState,
    Position as FlowPosition,
    Node,
    Edge,
    getSmoothStepPath
} from 'react-flow-renderer';
import { path as d3Path } from 'd3-path';

import { getGraphViewerStyles } from '../OATGraphViewer.styles';
import {
    OAT_UNTARGETED_RELATIONSHIP_NAME,
    OAT_EXTEND_HANDLE_NAME
} from '../../../Models/Constants/Constants';
import { getDisplayName } from '../../OATPropertyEditor/Utils';
import { IOATNodePosition } from '../../../Models/Constants';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { getDebugLogger } from '../../../Models/Services/Utils';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { useOatGraphContext } from '../../../Models/Context/OatGraphContext/OatGraphContext';
import { IOATGraphCustomEdgeProps } from './OATGraphCustomEdge.types';
import { DTDLType } from '../../../Models/Classes/DTDL';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATGraphCustomEdge', debugLogging);

const foreignObjectSize = 20;
const offsetSmall = 5;
const offsetMedium = 10;
const rightAngleValue = 1.5708;
const separation = 20;
const SELF_REFERENCING_RADIUS_RADIUS = 40;
const SELF_REFERENCING_RADIUS_OFFSET = 16;
const ASSUMED_NODE_HEIGHT = 118;

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

const OATGraphCustomEdge: React.FC<IOATGraphCustomEdgeProps> = (props) => {
    const { id: edgeId, target: edgeTarget, data: edgeData } = props;

    const isExtendEdge = edgeData['@type'] === OAT_EXTEND_HANDLE_NAME;
    const isRelationshipEdge = edgeData['@type'] === DTDLType.Relationship;
    const isComponentEdge = edgeData['@type'] === DTDLType.Component;
    const isUntargetedEdge =
        edgeData['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME;

    // hooks
    const calloutTargetId = useId('callout-target');
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

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();
    const { oatGraphState } = useOatGraphContext();

    // state
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const {
        showRelationships,
        showInheritances,
        showComponents
    } = oatGraphState;

    // data
    const edge = useMemo(() => edges.find((x) => x.id === edgeId), [
        edges,
        edgeId
    ]);
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
            oatPageState.selection &&
            oatPageState.selection.modelId === source.id &&
            ((isExtendEdge &&
                oatPageState.selection.contentId === edgeData['@id']) ||
                (!isExtendEdge &&
                    oatPageState.selection.contentId === edgeData.name)),
        [edgeData, isExtendEdge, oatPageState.selection, source.id]
    );
    const isSelfReferencing = edge.source === edge.target;

    // If a valid element we get size based on positioning
    const sourceNodeSizeX = source.__rf.width;
    const sourceNodeSizeY = source.__rf.height;
    const targetNodeSizeX = target.__rf.width;
    const targetNodeSizeY = target.__rf.height;

    // side effects
    useEffect(() => {
        // if (isMenuVisible && !isSelected) {
        setIsMenuVisible(isSelected);
        // }
    }, [isSelected]);

    // styles
    const graphViewerStyles = getGraphViewerStyles();

    // callbacks
    const onDelete = useCallback(() => {
        const deletion = () => {
            const dispatchDelete = () => {
                const nameOrTarget = props.data.name || edgeTarget; // use name, if empty, then it's an extends, so use the target
                logDebugConsole(
                    'info',
                    `Delete reference of type ${edgeData['@type']} with name/target ${nameOrTarget} for model ${source.id}`
                );
                oatPageDispatch({
                    type: OatPageContextActionType.DELETE_REFERENCE,
                    payload: {
                        modelId: source.id,
                        nameOrTarget: nameOrTarget,
                        referenceType: edgeData['@type']
                    }
                });
            };

            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            oatPageDispatch({
                type: OatPageContextActionType.GENERAL_UNDO,
                payload: {
                    models: oatPageState.currentOntologyModels,
                    positions: oatPageState.currentOntologyModelPositions,
                    selection: oatPageState.selection
                }
            });
        };

        if (!oatPageState.modified) {
            execute(deletion, undoDeletion);
        }
    }, [
        edgeData,
        edgeTarget,
        execute,
        oatPageDispatch,
        oatPageState.currentOntologyModelPositions,
        oatPageState.currentOntologyModels,
        oatPageState.modified,
        oatPageState.selection,
        props.data.name,
        source.id
    ]);

    // data
    const getSourceComponents = useCallback(
        (
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
                edgePathSourceY = isComponentEdge
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
                edgePathSourceX = isComponentEdge
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
        },
        [isComponentEdge, sourceY, targetX, targetY]
    );

    const getTargetComponents = useCallback(
        (
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
                    isExtendEdge || isRelationshipEdge || isUntargetedEdge
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
                    isExtendEdge || isRelationshipEdge || isUntargetedEdge
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
        },
        [
            isExtendEdge,
            isRelationshipEdge,
            isUntargetedEdge,
            sourceX,
            sourceY,
            targetX,
            targetY
        ]
    );

    const getParallelEdges = useCallback(() => {
        if (edges && edge) {
            return edges.filter(
                (x) => x.source === edge.source && x.target === edge.target
            );
        } else {
            return [];
        }
    }, [edge, edges]);

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
            // Getting vectors to adjust angle from source to target
            let heightVector = targetY > sourceY ? 1 : -1;
            let baseVector = targetX > sourceX ? 1 : -1;
            const parallels = getParallelEdges();
            if (parallels.length > 1) {
                const sourceRange = (separation * (parallels.length - 1)) / 2;
                adjustedSourceX = adjustedSourceX - sourceRange;
                adjustedSourceY = adjustedSourceY + sourceRange * baseVector;
                const indexX = parallels.findIndex((x) => x.id === edgeId);
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
                const indexX = parallels.findIndex((x) => x.id === edgeId);
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
    }, [
        edge,
        edgeId,
        getParallelEdges,
        getSourceComponents,
        getTargetComponents,
        sourceNodeSizeX,
        sourceNodeSizeY,
        sourceX,
        sourceY,
        targetNodeSizeX,
        targetNodeSizeY,
        targetX,
        targetY
    ]);

    const computeSelfReferencingPath = useCallback((): string => {
        const nodeX = sourceX;
        const nodeY = sourceY;
        const verticalOffset = (ASSUMED_NODE_HEIGHT / 2) * 0.8;
        let radius = SELF_REFERENCING_RADIUS_RADIUS;

        // if there are other relationships, offset this one by the index in the set so each line has a different radius
        const parallelEdges = getParallelEdges();
        if (parallelEdges.length > 1) {
            const index = parallelEdges.findIndex((x) => x.id === edgeId);
            radius += index * SELF_REFERENCING_RADIUS_OFFSET;
        }

        // create the path
        const context = d3Path();
        context.moveTo(nodeX, nodeY);
        context.arc(nodeX, nodeY - verticalOffset, radius, -10, 10);
        return context.toString();
    }, [edgeId, getParallelEdges, sourceX, sourceY]);

    const edgePath = useMemo(() => {
        const {
            edgePathSourceX,
            edgePathSourceY,
            edgePathTargetX,
            edgePathTargetY,
            orientation
        } = polygons;
        let path = '';
        if (isSelfReferencing) {
            path = computeSelfReferencingPath();
        } else {
            path =
                sourceX < targetX
                    ? getSmoothStepPath({
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
                    : getSmoothStepPath({
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
        }

        return path;
    }, [
        polygons,
        isSelfReferencing,
        computeSelfReferencingPath,
        sourceX,
        targetX
    ]);

    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY
    });

    const showEdge =
        (isExtendEdge && showInheritances) ||
        ((isRelationshipEdge || isUntargetedEdge) && showRelationships) ||
        (isComponentEdge && showComponents);
    let edgeClassName = '';
    let shapeClassName = '';
    let shapePoints = '';
    if (isComponentEdge) {
        edgeClassName = isSelected
            ? graphViewerStyles.selectedComponentPath
            : graphViewerStyles.componentPath;
        shapeClassName = graphViewerStyles.componentShape;
        shapePoints = polygons.componentPolygon;
    } else if (isExtendEdge) {
        edgeClassName = isSelected
            ? graphViewerStyles.selectedInheritancePath
            : graphViewerStyles.inheritancePath;
        shapeClassName = graphViewerStyles.inheritanceShape;
        shapePoints = polygons.inheritancePolygon;
    } else if (isUntargetedEdge || isRelationshipEdge) {
        edgeClassName = isSelected
            ? graphViewerStyles.selectedEdgePath
            : graphViewerStyles.edgePath;
        shapeClassName = graphViewerStyles.edgePath;
        shapePoints = polygons.relationshipPolygon;
    }

    logDebugConsole('debug', 'Render {props, nodes}', props, nodes, edgePath);
    if (!showEdge) {
        return null;
    }
    return (
        <>
            <path id={edgeId} className={edgeClassName} d={edgePath} />
            <text>
                <textPath
                    href={`#${edgeId}`}
                    className={graphViewerStyles.textPath}
                    startOffset="50%"
                    textAnchor="middle"
                >
                    {getDisplayName(edgeData.name)}
                </textPath>
            </text>
            {isMenuVisible && (
                <foreignObject
                    width={foreignObjectSize}
                    height={foreignObjectSize}
                    x={
                        !isExtendEdge
                            ? edgeCenterX - foreignObjectSize / 2
                            : edgeCenterX
                    }
                    y={edgeCenterY}
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <div
                        className={graphViewerStyles.relationshipNameEditorBody}
                        id={calloutTargetId}
                    >
                        <Callout
                            directionalHint={DirectionalHint.rightCenter}
                            isBeakVisible={false}
                            gapSpace={8}
                            target={`#${calloutTargetId}`}
                        >
                            <DefaultButton
                                text={'Delete'}
                                iconProps={{ iconName: 'Delete' }}
                                onClick={onDelete}
                                styles={{
                                    root: {
                                        fontSize: FontSizes.small,
                                        height: 28,
                                        padding: 4
                                    },
                                    icon: {
                                        fontSize: FontSizes.small
                                    },
                                    label: {
                                        marginLeft: 0
                                    }
                                }}
                            />
                        </Callout>
                    </div>
                </foreignObject>
            )}
            {/* Hide the indicators for self referencing ones, cause the math is wayyy too hard for V1 */}
            {!isSelfReferencing && (
                <polygon
                    points={shapePoints}
                    cx={polygons.polygonTargetX}
                    cy={polygons.polygonTargetY}
                    r={3}
                    strokeWidth={1.5}
                    className={shapeClassName}
                />
            )}
        </>
    );
};

export default OATGraphCustomEdge;
