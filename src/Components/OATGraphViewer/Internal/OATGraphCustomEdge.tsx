import React, { useContext, useMemo, useState } from 'react';
import { useTheme, Icon, FontSizes, ActionButton } from '@fluentui/react';
import {
    getBezierPath,
    getEdgeCenter,
    removeElements
} from 'react-flow-renderer';
import { getGraphViewerStyles } from '../OATGraphViewer.styles';
import { ElementsContext } from './OATContext';
import { TextField } from '@fluentui/react';
import {
    OATUntargetedRelationshipName,
    OATRelationshipHandleName,
    OATComponentHandleName,
    OATExtendHandleName
} from '../../../Models/Constants/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../Models/Constants/ActionTypes';
import { ModelTypes } from '../../../Models/Constants/Enums';
import { DTDLRelationship } from '../../../Models/Classes/DTDL';
import { getPropertyDisplayName } from '../../OATPropertyEditor/Utils';

const foreignObjectSize = 180;
const offsetSmall = 5;
const offsetMedium = 10;
const sourceDefaultHeight = 6;
const rightAngleValue = 1.5708;

const OATGraphCustomEdge: React.FC<IOATGraphCustomEdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd
}) => {
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(getPropertyDisplayName(data));
    const {
        elements,
        setElements,
        dispatch,
        setCurrentNode,
        showRelationships,
        showInheritances,
        showComponents,
        state
    } = useContext(ElementsContext);
    const graphViewerStyles = getGraphViewerStyles();
    const theme = useTheme();

    const getPolygon = (vertexes) =>
        vertexes.map((v) => `${v.x},${v.y}`).join(' ');

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

    const getSourceComponents = (
        betaAngle,
        sourceBase,
        sourceBetaAngle,
        sourceHeight,
        alphaAngle,
        adjustedSourceY,
        baseVector,
        heightVector
    ) => {
        // Using triangulated conection position to create componentPolygon and angles to define orientation
        let newHeight = 0;
        let newBase = 0;
        let componentPolygon = '';
        let polygonSourceX = 0;
        let polygonSourceY = 0;
        let edgePathSourceX = 0;
        let edgePathSourceY = 0;
        if (betaAngle < sourceBetaAngle) {
            newHeight = sourceHeight;
            const newHypotenuse = newHeight / Math.sin(alphaAngle);
            newBase = Math.sqrt(
                newHypotenuse * newHypotenuse - newHeight * newHeight
            );
            polygonSourceX = sourceX + newBase * baseVector;
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
            newBase = sourceBase;
            const newHypotenuse = newBase / Math.sin(betaAngle);
            newHeight = Math.sqrt(
                newHypotenuse * newHypotenuse - newBase * newBase
            );
            polygonSourceX = sourceX + newBase * baseVector;
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
                      offsetMedium * (sourceX > targetX ? -1 : 1)
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
        targetBetaAngle,
        targetHeight,
        alphaAngle,
        baseVector,
        heightVector,
        targetBase
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
            newHeight = targetHeight;
            const newHypotenuse = newHeight / Math.sin(alphaAngle);
            newBase = Math.sqrt(
                newHypotenuse * newHypotenuse - newHeight * newHeight
            );
            polygonTargetX = targetX + newBase * baseVector;
            polygonTargetY = targetY + newHeight * heightVector;
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
            newBase = targetBase;
            const newHypotenuse = newBase / Math.sin(betaAngle);
            newHeight = Math.sqrt(
                newHypotenuse * newHypotenuse - newBase * newBase
            );
            polygonTargetX = targetX + newBase * baseVector;
            polygonTargetY = targetY + newHeight * heightVector;
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
        const adjustedSourceY = sourceY - sourceDefaultHeight;

        const element = elements.find((x) => x.id === id);
        let polygons = {};
        if (element) {
            polygons = { element: element };
            // If a valid element we get size based in positioning
            const sourceNode = elements.find((x) => x.id === element.source);
            const sourceNodeSizeX = (sourceX - sourceNode.position.x) * 2;
            const sourceNodeSizeY =
                (adjustedSourceY - sourceNode.position.y) * 2;
            const targetNode = elements.find((x) => x.id === element.target);
            const targetNodeSizeX = (targetX - targetNode.position.x) * 2;
            const targetNodeSizeY = (targetY - targetNode.position.y) * 2;
            // Getting vectors to adjust angle from source to target
            let heightVector = targetY > adjustedSourceY ? 1 : -1;
            let baseVector = targetX > sourceX ? 1 : -1;
            // Using source and target points to triangulate and get angles
            const triangleHeight = (targetY - adjustedSourceY) * heightVector;
            const triangleBase = (targetX - sourceX) * baseVector;
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
                baseVector,
                heightVector
            );
            polygons = { ...polygons, ...sourceComponents };
            // Getting vectors to adjust angle from target to source
            heightVector = targetY < adjustedSourceY ? 1 : -1;
            baseVector = targetX < sourceX ? 1 : -1;
            // Using source size to triangulate connection with target edge
            const targetHeight = targetNodeSizeY / 2;
            const targetBase = targetNodeSizeX / 2;
            const targetHypotenuse = Math.sqrt(
                targetHeight * targetHeight + targetBase * targetBase
            );
            const targetBetaAngle = Math.asin(targetBase / targetHypotenuse);
            const targetComponents = getTargetComponents(
                betaAngle,
                targetBetaAngle,
                targetHeight,
                alphaAngle,
                baseVector,
                heightVector,
                targetBase
            );
            polygons = { ...polygons, ...targetComponents };
        }
        return polygons;
    }, [id, elements, sourceX, sourceY, targetX, targetY]);

    const onNameChange = (evt) => {
        setNameText(evt.target.value);

        const displayName =
            typeof polygons.element.data.name === 'string'
                ? evt.target.value
                : {
                      ...polygons.element.data.name,
                      [Object.keys(data.name)[0]]: evt.target.value
                  };

        const relationship = new DTDLRelationship(
            polygons.element.data.id,
            polygons.element.data.name,
            displayName,
            polygons.element.data.description,
            polygons.element.data.comment,
            polygons.element.data.writable,
            polygons.element.data.content ? polygons.element.data.content : [],
            polygons.element.data.target,
            polygons.element.data.maxMultiplicity
        );

        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: relationship
        });
    };

    const onNameClick = () => {
        if (!state.modified) {
            setNameEditor(true);
            if (
                polygons.element.data.type !== ModelTypes.relationship &&
                polygons.element.data.type !== ModelTypes.untargeted
            ) {
                setCurrentNode(null);
                dispatch({
                    type: SET_OAT_PROPERTY_EDITOR_MODEL,
                    payload: relationship
                });
            }

            const displayName =
                typeof polygons.element.data.name === 'string'
                    ? polygons.element.data.name
                    : {
                          ...polygons.element.data.name,
                          [Object.keys(
                              polygons.element.data.name
                          )[0]]: Object.values(polygons.element.data.name)[0]
                      };
            const relationship = new DTDLRelationship(
                polygons.element.data.id,
                polygons.element.data.name,
                displayName,
                polygons.element.data.description,
                polygons.element.data.comment,
                polygons.element.data.writable,
                polygons.element.data.content
                    ? polygons.element.data.content
                    : [],
                polygons.element.data.target,
                polygons.element.data.maxMultiplicity
            );

            setCurrentNode(polygons.element.id);
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: relationship
            });
        }
    };

    const onNameBlur = () => {
        setNameEditor(false);
        if (typeof data.name === 'string' && data.name !== nameText) {
            elements.find(
                (element) => element.data.id === data.id
            ).data.name = nameText;
            setElements([...elements]);
        }
    };

    const onKeyDown = (evt) => {
        if (evt.key === 'Escape') {
            onNameBlur();
        }
    };

    const bezierPath = getBezierPath({
        targetX,
        targetY,
        targetPosition,
        sourceX,
        sourceY,
        sourcePosition
    })
        .replace('M', '')
        .replace('C', '')
        .split(' ');

    const edgePath = useMemo(() => {
        return sourceX > targetX
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
                    width={foreignObjectSize}
                    height={foreignObjectSize}
                    x={edgeCenterX - foreignObjectSize / 2}
                    y={edgeCenterY}
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <body>
                        <TextField
                            id="text"
                            name="text"
                            className={graphViewerStyles.textEdit}
                            onChange={onNameChange}
                            onClick={onNameClick}
                            value={nameText}
                            onKeyDown={onKeyDown}
                            autoFocus
                        />
                        <ActionButton
                            className={graphViewerStyles.edgeCancel}
                            onClick={onDelete}
                        >
                            <Icon
                                iconName="Cancel"
                                styles={{
                                    root: {
                                        fontSize: FontSizes.size10,
                                        color: theme.semanticColors.actionLink,
                                        marginTop: '-35px',
                                        marginRight: '-10px'
                                    }
                                }}
                            />
                        </ActionButton>
                        <ActionButton
                            className={graphViewerStyles.edgeCancel}
                            onClick={onNameBlur}
                        >
                            <Icon
                                iconName="Save"
                                styles={{
                                    root: {
                                        fontSize: FontSizes.size10,
                                        color: theme.semanticColors.actionLink,
                                        marginTop: '-35px',
                                        marginRight: '-10px'
                                    }
                                }}
                            />
                        </ActionButton>
                    </body>
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
