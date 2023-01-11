import React, { useCallback, useContext, useMemo } from 'react';
import {
    Callout,
    classNamesFunction,
    DefaultButton,
    DirectionalHint,
    FontSizes,
    styled
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import {
    getEdgeCenter,
    useStoreState,
    Position as FlowPosition,
    Node,
    Edge,
    getBezierPath
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
import {
    IOATGraphCustomEdgeProps,
    IOATGraphCustomEdgeStyleProps,
    IOATGraphCustomEdgeStyles
} from './OATGraphCustomEdge.types';
import { DTDLType } from '../../../Models/Classes/DTDL';
import { useTranslation } from 'react-i18next';
import { IOATNodeData } from '../OATGraphViewer.types';
import { getSelectionFromNode } from './Utils';
import { CardboardList } from '../../CardboardList';
import { ICardboardListItem } from '../../CardboardList/CardboardList.types';
import { useExtendedTheme } from '../../../Models/Hooks/useExtendedTheme';
import { getStyles } from './OATGraphCustomEdge.styles';

const debugLogging = true;
const logDebugConsole = getDebugLogger('OATGraphCustomEdge', debugLogging);

const foreignObjectSize = 20;
const offsetSmall = 5;
const offsetMedium = 10;
const rightAngleValue = 1.5708;
const separation = 20;
const SELF_REFERENCING_RADIUS_RADIUS = 45;
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
const getIdentifier = (data: IOATNodeData): string => {
    if (data['@type'] === 'Extend') {
        return data['@id'];
    } else {
        return data.name;
    }
};

const getClassNames = classNamesFunction<
    IOATGraphCustomEdgeStyleProps,
    IOATGraphCustomEdgeStyles
>();

const OATGraphCustomEdge: React.FC<IOATGraphCustomEdgeProps> = (props) => {
    const {
        id: edgeId,
        target: edgeTargetName,
        data: edgeData,
        styles
    } = props;

    const isExtendEdge = edgeData['@type'] === OAT_EXTEND_HANDLE_NAME;
    const isRelationshipEdge = edgeData['@type'] === DTDLType.Relationship;
    const isComponentEdge = edgeData['@type'] === DTDLType.Component;
    const isUntargetedEdge =
        edgeData['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME;

    // hooks
    const { t } = useTranslation();
    const edgeCalloutTargetId = useId('callout-stacked-references');
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
    const [edgeSourceNode, edgeSourceX, edgeSourceY] = useMemo(() => {
        const source = nodes.find((x) => x.id === edge.source);
        return [source, ...getMidPointForNode(source)];
    }, [edge, nodes]);
    const [edgeTargetNode, edgeTargetX, edgeTargetY] = useMemo(() => {
        const target = nodes.find((x) => x.id === edge.target);
        return [target, ...getMidPointForNode(target)];
    }, [edge, nodes]);

    const parallelEdges = useMemo(() => {
        if (edges && edge) {
            return edges.filter(
                (x) => x.source === edge.source && x.target === edge.target
            );
        } else {
            return [];
        }
    }, [edge, edges]);
    const stackedEdges = useMemo(() => {
        if (edges && edge) {
            return edges.filter(
                (x) =>
                    x.source === edge.source &&
                    x.target === edge.target &&
                    (x.data as IOATNodeData)['@type'] ===
                        (edge.data as IOATNodeData)['@type']
            );
        } else {
            return [];
        }
    }, [edge, edges]);
    const isPrimaryEdge = useMemo(
        () => stackedEdges.findIndex((x) => x.id === edgeId) === 0,
        [edgeId, stackedEdges]
    );
    const isSelfReferencing = edge.source === edge.target;

    // If a valid element we get size based on positioning
    const sourceNodeSizeX = edgeSourceNode.__rf.width;
    const sourceNodeSizeY = edgeSourceNode.__rf.height;
    const targetNodeSizeX = edgeTargetNode.__rf.width;
    const targetNodeSizeY = edgeTargetNode.__rf.height;

    const isSelected = useMemo(() => {
        console.log(
            `[${props.id}] ` + '***Selection',
            props,
            oatPageState.selection,
            stackedEdges,
            isExtendEdge
        );
        if (!oatPageState.selection) {
            return false;
        }

        const isSelected =
            oatPageState.selection.modelId === edgeSourceNode.id &&
            stackedEdges.some(
                (x) =>
                    getIdentifier(x.data) === oatPageState.selection.contentId
            );
        // if (isExtendEdge) {
        //     console.log(`[${props.id}] before isSelected: ` + isSelected);
        //     isSelected =
        //         isSelected &&
        //         ;
        //     console.log(`[${props.id}] after isSelected: ` + isSelected);
        // } else {
        //     isSelected =
        //         isSelected &&
        //         stackedEdges.some(
        //             (x) =>
        //                 (x.data as IOATNodeData).name ===
        //                 oatPageState.selection.contentId
        //         );
        // }
        return isSelected;
    }, [
        props,
        oatPageState.selection,
        stackedEdges,
        edgeSourceNode,
        isExtendEdge
    ]);

    // side effects

    // styles
    const graphViewerStyles = getGraphViewerStyles();
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // callbacks
    const onDelete = useCallback(() => {
        const deletion = () => {
            const dispatchDelete = () => {
                const nameOrTarget = props.data.name || edgeTargetName; // use name, if empty, then it's an extends, so use the target
                logDebugConsole(
                    'info',
                    `Delete reference of type ${edgeData['@type']} with name/target ${nameOrTarget} for model ${edgeSourceNode.id}`
                );
                oatPageDispatch({
                    type: OatPageContextActionType.DELETE_REFERENCE,
                    payload: {
                        modelId: edgeSourceNode.id,
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
        edgeTargetName,
        execute,
        oatPageDispatch,
        oatPageState.currentOntologyModelPositions,
        oatPageState.currentOntologyModels,
        oatPageState.modified,
        oatPageState.selection,
        props.data.name,
        edgeSourceNode.id
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
                      offsetMedium * (edgeSourceY > edgeTargetY ? -1 : 1)
                    : polygonSourceY;
            } else {
                newBase = sourceBase + adjustmentSourceX * baseVector;
                const newHypotenuse = newBase / Math.sin(betaAngle);
                newHeight = Math.sqrt(
                    newHypotenuse * newHypotenuse - newBase * newBase
                );
                polygonSourceX = adjustedSourceX + newBase * baseVector;
                polygonSourceY = edgeSourceY + newHeight * heightVector;
                componentPolygon = getComponentPolygon(
                    polygonSourceX,
                    polygonSourceY,
                    baseVector,
                    heightVector,
                    orientation
                );
                edgePathSourceX = isComponentEdge
                    ? polygonSourceX +
                      offsetMedium * (adjustedSourceX > edgeTargetX ? -1 : 1)
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
        [isComponentEdge, edgeSourceY, edgeTargetX, edgeTargetY]
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
                          offsetMedium * (edgeSourceY < edgeTargetY ? -1 : 1)
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
                          offsetMedium * (edgeSourceX < edgeTargetX ? -1 : 1)
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
            edgeSourceX,
            edgeSourceY,
            edgeTargetX,
            edgeTargetY
        ]
    );

    const onSelectEdge = useCallback(
        (edge: Edge<any>) => {
            const onClick = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                    payload: { selection: getSelectionFromNode(edge) }
                });
            };

            const undoOnClick = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                    payload: { selection: oatPageState.selection }
                });
            };

            execute(onClick, undoOnClick);
        },
        [execute, oatPageDispatch, oatPageState.selection]
    );

    const polygons = useMemo(() => {
        // With this Memo function the values for Polygons Points are calculated
        let adjustedSourceY = edgeSourceY;
        let adjustedSourceX = edgeSourceX;
        let adjustmentSourceX = 0;
        let adjustmentSourceY = 0;
        let adjustedTargetY = edgeTargetY;
        let adjustedTargetX = edgeTargetX;
        let adjustmentTargetX = 0;
        let adjustmentTargetY = 0;

        let polygons: IPolygon = {} as IPolygon;
        if (edge) {
            const polygonElement: IPolygonElement = {
                element: edge
            };
            // Getting vectors to adjust angle from source to target
            let heightVector = edgeTargetY > edgeSourceY ? 1 : -1;
            let baseVector = edgeTargetX > edgeSourceX ? 1 : -1;
            if (parallelEdges.length > 1) {
                const sourceRange =
                    (separation * (parallelEdges.length - 1)) / 2;
                adjustedSourceX = adjustedSourceX - sourceRange;
                adjustedSourceY = adjustedSourceY + sourceRange * baseVector;
                const indexX = parallelEdges.findIndex((x) => x.id === edgeId);
                adjustedSourceX = indexX * separation + adjustedSourceX;
                adjustedSourceY =
                    adjustedSourceY - indexX * separation * baseVector;
                adjustmentSourceX = edgeSourceX - adjustedSourceX;
                adjustmentSourceY = edgeSourceY - adjustedSourceY;
            }
            // Using source and target points to triangulate and get angles
            const triangleHeight =
                (edgeTargetY - adjustedSourceY) * heightVector;
            const triangleBase = (edgeTargetX - adjustedSourceX) * baseVector;
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
            heightVector = edgeTargetY < edgeSourceY ? 1 : -1;
            baseVector = edgeTargetX < edgeSourceX ? 1 : -1;
            if (parallelEdges.length > 1) {
                const targetRange =
                    (separation * (parallelEdges.length - 1)) / 2;
                adjustedTargetX = adjustedTargetX - targetRange;
                adjustedTargetY = adjustedTargetY - targetRange;
                const indexX = parallelEdges.findIndex((x) => x.id === edgeId);
                adjustedTargetX = indexX * separation + adjustedTargetX;
                adjustedTargetY = indexX * separation + adjustedTargetY;
                adjustmentTargetX = edgeTargetX - adjustedTargetX;
                adjustmentTargetY = edgeTargetY - adjustedTargetY;
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
        parallelEdges,
        getSourceComponents,
        getTargetComponents,
        sourceNodeSizeX,
        sourceNodeSizeY,
        edgeSourceX,
        edgeSourceY,
        targetNodeSizeX,
        targetNodeSizeY,
        edgeTargetX,
        edgeTargetY
    ]);

    const computeSelfReferencingPath = useCallback((): string => {
        const nodeX = edgeSourceX;
        const nodeY = edgeSourceY;
        const verticalOffset = (ASSUMED_NODE_HEIGHT / 2) * 0.5;
        let radius = SELF_REFERENCING_RADIUS_RADIUS;

        // if there are other relationships, offset this one by the index in the set so each line has a different radius
        if (stackedEdges.length > 1) {
            const index = stackedEdges.findIndex((x) => x.id === edgeId);
            radius += index * SELF_REFERENCING_RADIUS_OFFSET;
        }

        // create the path
        const context = d3Path();
        // context.moveTo(nodeX, nodeY);
        context.arc(nodeX, nodeY - verticalOffset, radius, Math.PI, 0, false);
        return context.toString();
    }, [edgeId, stackedEdges, edgeSourceX, edgeSourceY]);

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
                edgeSourceX < edgeTargetX
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
        }

        return path;
    }, [
        polygons,
        isSelfReferencing,
        computeSelfReferencingPath,
        edgeSourceX,
        edgeTargetX
    ]);

    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX: edgeSourceX,
        sourceY: edgeSourceY,
        targetX: edgeTargetX,
        targetY: edgeTargetY
    });

    const hasStackedReferences = stackedEdges.length > 1;
    const stackedEdgeListItems: ICardboardListItem<Edge>[] = useMemo(() => {
        if (stackedEdges.length === 1) {
            return [];
        }
        return stackedEdges.map((x) => {
            const edgeData = x.data as IOATNodeData;
            const name =
                edgeData['@type'] === OAT_EXTEND_HANDLE_NAME
                    ? t('OATGraphViewer.extends')
                    : edgeData.name;
            const item: ICardboardListItem<Edge> = {
                ariaLabel: '',
                isSelected:
                    oatPageState.selection?.contentId === getIdentifier(x.data),
                item: x,
                textPrimary: name,
                onClick: () => onSelectEdge(x),
                overflowMenuItems: [
                    {
                        key: 'delete',
                        text: 'Delete',
                        iconProps: { iconName: 'Delete' },
                        onClick: onDelete
                    }
                ]
            };
            console.log('***building menu item ', x, item);
            return item;
        });
    }, [
        oatPageState.selection?.contentId,
        onDelete,
        onSelectEdge,
        stackedEdges,
        t
    ]);

    const showEdge =
        isPrimaryEdge &&
        ((isExtendEdge && showInheritances) ||
            ((isRelationshipEdge || isUntargetedEdge) && showRelationships) ||
            (isComponentEdge && showComponents));
    let edgeClassName = '';
    let shapeClassName = '';
    let shapePoints = '';
    if (isComponentEdge && isPrimaryEdge) {
        edgeClassName = isSelected
            ? graphViewerStyles.selectedComponentPath
            : graphViewerStyles.componentPath;
        shapeClassName = graphViewerStyles.componentShape;
        shapePoints = polygons.componentPolygon;
    } else if (isExtendEdge && isPrimaryEdge) {
        edgeClassName = isSelected
            ? graphViewerStyles.selectedInheritancePath
            : graphViewerStyles.inheritancePath;
        shapeClassName = graphViewerStyles.inheritanceShape;
        shapePoints = polygons.inheritancePolygon;
    } else if ((isUntargetedEdge || isRelationshipEdge) && isPrimaryEdge) {
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
            {!hasStackedReferences && (
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
            )}
            {hasStackedReferences && (
                <text>
                    <textPath
                        href={`#${edgeId}`}
                        className={classNames.stackedReferenceCountLabel}
                        startOffset="50%"
                        textAnchor="middle"
                    >
                        {String(stackedEdges.length)}
                    </textPath>
                </text>
                // <foreignObject
                //     width={50}
                //     height={50}
                //     x={
                //         !isExtendEdge
                //             ? edgeCenterX - foreignObjectSize / 2
                //             : edgeCenterX
                //     }
                //     y={edgeCenterY}
                //     requiredExtensions="http://www.w3.org/1999/xhtml"
                // >
                //     <DefaultButton
                //         componentRef={menuRef}
                //         text={String(stackedEdges.length)}
                //         menuProps={{
                //             items: [
                //                 {
                //                     key: 'something',
                //                     text: 'something'
                //                 }
                //             ]
                //         }}
                //         styles={{
                //             root: {
                //                 minWidth: 'unset',
                //                 padding: '0 4px',
                //                 fontSize: FontSizes.small
                //             },
                //             icon: {
                //                 fontSize: FontSizes.small
                //             }
                //         }}
                //     />
                // </foreignObject>
            )}
            {isSelected && (
                <foreignObject
                    width={foreignObjectSize}
                    height={foreignObjectSize}
                    x={edgeCenterX + 10}
                    y={edgeCenterY}
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                    id={edgeCalloutTargetId}
                >
                    <Callout
                        directionalHint={DirectionalHint.rightCenter}
                        isBeakVisible={false}
                        gapSpace={8}
                        setInitialFocus
                        target={`#${edgeCalloutTargetId}`}
                    >
                        {hasStackedReferences ? (
                            <CardboardList
                                className={classNames.stackedReferencesList}
                                items={stackedEdgeListItems}
                                listKey={'stacked-items-' + edge.id}
                            />
                        ) : (
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
                        )}
                    </Callout>
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

export default styled<
    IOATGraphCustomEdgeProps,
    IOATGraphCustomEdgeStyleProps,
    IOATGraphCustomEdgeStyles
>(OATGraphCustomEdge, getStyles);
