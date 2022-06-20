import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTheme, Icon, FontSizes, ActionButton } from '@fluentui/react';
import {
    getEdgeCenter,
    removeElements,
    useStoreState
} from 'react-flow-renderer';
import {
    getGraphViewerStyles,
    getRelationshipTextFieldStyles
} from '../OATGraphViewer.styles';
import { ElementsContext } from './OATContext';
import {
    OATUntargetedRelationshipName,
    OATRelationshipHandleName,
    OATComponentHandleName,
    OATExtendHandleName
} from '../../../Models/Constants/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../Models/Constants/ActionTypes';
import { DTDLRelationship } from '../../../Models/Classes/DTDL';
import { getPropertyDisplayName } from '../../OATPropertyEditor/Utils';
import { IOATGraphCustomEdgeProps } from '../../../Models/Constants';
import OATTextFieldName from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldName';

const foreignObjectSize = 180;
const foreignObjectSizeExtendRelation = 50;
const offsetSmall = 5;
const offsetMedium = 10;
const sourceDefaultHeight = 6;
const rightAngleValue = 1.5708;
const separation = 10;

const getPolygon = (vertexes) => vertexes.map((v) => `${v.x},${v.y}`).join(' ');

const getComponentPolygon = (
    polygonSourceX,
    polygonSourceY,
    baseVector,
    heightVector,
    verticalPolygon
) => {
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
    polygonTargetX,
    polygonTargetY,
    baseVector,
    heightVector,
    verticalPolygon
) => {
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
    polygonTargetX,
    polygonTargetY,
    baseVector,
    heightVector,
    verticalPolygon
) => {
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

const getMidPointForNode = (node) => {
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
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(getPropertyDisplayName(data));
    const {
        setElements,
        dispatch,
        setCurrentNode,
        showRelationships,
        showInheritances,
        showComponents,
        state
    } = useContext(ElementsContext);
    const { model } = state;
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

    useEffect(() => {
        if (nameEditor && (!model || model['@id'] !== id)) {
            setNameEditor(false);
        }
    }, [id, model, nameEditor]);

    const getSourceComponents = (
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
    ) => {
        // Using triangulated connection position to create componentPolygon and angles to define orientation
        let newHeight = 0;
        let newBase = 0;
        let componentPolygon = '';
        let polygonSourceX = 0;
        let polygonSourceY = 0;
        let edgePathSourceX = 0;
        let edgePathSourceY = 0;
        if (betaAngle < sourceBetaAngle) {
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
                true
            );
            edgePathSourceX = polygonSourceX;
            edgePathSourceY =
                data.type === OATComponentHandleName
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
                false
            );
            edgePathSourceX =
                data.type === OATComponentHandleName
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
            edgePathSourceY: edgePathSourceY
        };
    };

    const getTargetComponents = (
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
    ) => {
        let newHeight = 0;
        let newBase = 0;
        let polygonTargetX = 0;
        let polygonTargetY = 0;
        let inheritancePolygon = '';
        let relationshipPolygon = '';
        let edgePathTargetX = 0;
        let edgePathTargetY = 0;
        // Using triangulated conection position to create inheritance and relationship polygons and angles to define orientation
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
                data.type === OATExtendHandleName ||
                data.type === OATRelationshipHandleName ||
                data.type === OATUntargetedRelationshipName
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
                data.type === OATExtendHandleName ||
                data.type === OATRelationshipHandleName ||
                data.type === OATUntargetedRelationshipName
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
        let adjustedSourceY = sourceY - sourceDefaultHeight;
        let adjustedSourceX = sourceX;
        let adjustmentSourceX = 0;
        let adjustmentSourceY = 0;
        let adjustedTargetY = targetY;
        let adjustedTargetX = targetX;
        let adjustmentTargetX = 0;
        let adjustmentTargetY = 0;

        let polygons = {};
        if (edge) {
            polygons = { element: edge };
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
                adjustmentSourceY =
                    sourceY - adjustedSourceY - sourceDefaultHeight;
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
            const sourceComponents = getSourceComponents(
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
            polygons = { ...polygons, ...sourceComponents };
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
            const targetComponents = getTargetComponents(
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
            polygons = { ...polygons, ...targetComponents };
        }
        return polygons;
    }, [id, source, sourceX, sourceY, targetX, targetY]);

    const onNameClick = () => {
        setNameEditor(true);

        const relationship = new DTDLRelationship(
            polygons.element.data.id,
            nameText,
            polygons.element.data.displayName,
            polygons.element.data.description,
            polygons.element.data.comment,
            polygons.element.data.writable,
            polygons.element.data.content ? polygons.element.data.content : [],
            polygons.element.data.target,
            polygons.element.data.maxMultiplicity
        );

        if (polygons.element.data.type === OATExtendHandleName) {
            relationship['@type'] = OATExtendHandleName;
        }
        setCurrentNode(polygons.element.id);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: relationship
        });
    };

    const edgePath = useMemo(() => {
        return sourceX < targetX
            ? `M${polygons.edgePathSourceX},${polygons.edgePathSourceY} ${polygons.edgePathTargetX},${polygons.edgePathTargetY}`
            : `M${polygons.edgePathTargetX},${polygons.edgePathTargetY} ${polygons.edgePathSourceX},${polygons.edgePathSourceY}`;
    }, [polygons]);

    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY
    });

    const onDelete = () => {
        if (!state.modified) {
            const elementsToRemove = [
                {
                    id: data.id
                }
            ];
            setElements((els) => removeElements(elementsToRemove, els));
            dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: null });
        }
    };

    return (
        <>
            <path
                id={id}
                className={graphViewerStyles.widthPath}
                d={edgePath}
                onClick={onNameClick}
            />
            {data.type === OATExtendHandleName && showInheritances && (
                <path
                    id={id}
                    className={graphViewerStyles.inheritancePath}
                    d={edgePath}
                    onClick={onNameClick}
                    markerEnd={markerEnd}
                />
            )}
            {(data.type === OATRelationshipHandleName ||
                data.type === OATUntargetedRelationshipName) &&
                showRelationships && (
                    <path
                        id={id}
                        className={graphViewerStyles.edgePath}
                        d={edgePath}
                        onClick={onNameClick}
                        markerEnd={markerEnd}
                    />
                )}
            {data.type === OATComponentHandleName && showComponents && (
                <path
                    id={id}
                    className={graphViewerStyles.componentPath}
                    d={edgePath}
                    onClick={onNameClick}
                    markerEnd={markerEnd}
                />
            )}
            {nameEditor && (
                <foreignObject
                    width={
                        data.type === OATExtendHandleName
                            ? foreignObjectSizeExtendRelation
                            : foreignObjectSize
                    }
                    height={foreignObjectSize}
                    x={
                        data.type !== OATExtendHandleName
                            ? edgeCenterX - foreignObjectSize / 2
                            : edgeCenterX
                    }
                    y={edgeCenterY}
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <div
                        className={graphViewerStyles.relationshipNameEditorBody}
                    >
                        {data.type !== OATExtendHandleName && (
                            <OATTextFieldName
                                styles={relationshipTextFieldStyles}
                                name={nameText}
                                setName={setNameText}
                                dispatch={dispatch}
                                state={state}
                                autoFocus
                            />
                        )}
                        <div
                            className={graphViewerStyles.relationshipCTASection}
                        >
                            <ActionButton
                                className={
                                    data.type !== OATExtendHandleName
                                        ? graphViewerStyles.edgeCancel
                                        : graphViewerStyles.extendCancel
                                }
                                onClick={onDelete}
                            >
                                <Icon
                                    iconName="Cancel"
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
                ((data.type === OATExtendHandleName && showInheritances) ||
                    (data.type === OATComponentHandleName && showComponents) ||
                    ((data.type === OATRelationshipHandleName ||
                        data.type === OATUntargetedRelationshipName) &&
                        showRelationships)) && (
                    <text>
                        <textPath
                            href={`#${id}`}
                            className={graphViewerStyles.textPath}
                            startOffset="50%"
                            textAnchor="middle"
                            onClick={onNameClick}
                        >
                            {getPropertyDisplayName(data)}
                        </textPath>
                    </text>
                )}
            {data.type === OATExtendHandleName && showInheritances && (
                <polygon
                    points={polygons.inheritancePolygon}
                    cx={polygons.polygonTargetX}
                    cy={polygons.polygonTargetY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.inheritanceShape}
                />
            )}
            {(data.type === OATRelationshipHandleName ||
                data.type === OATUntargetedRelationshipName) &&
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
            {data.type === OATComponentHandleName && showComponents && (
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
