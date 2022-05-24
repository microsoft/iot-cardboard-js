import React, { useContext, useState } from 'react';
import { useTheme, Icon, FontSizes, ActionButton } from '@fluentui/react';
import {
    getBezierPath,
    getEdgeCenter,
    removeElements
} from 'react-flow-renderer';
import { IOATGraphCustomEdgeProps } from '../../Models/Constants/Interfaces';
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
        showComponents
    } = useContext(ElementsContext);
    const graphViewerStyles = getGraphViewerStyles();
    const theme = useTheme();
    sourceY = sourceY - 6;

    const element = elements.find((x) => x.id === id);
    let inheritancePolygon = '';
    let relationshipPolygon = '';
    let componentPolygon = '';
    let polygonTargetX = 0;
    let polygonTargetY = 0;
    let polygonSourceX = 0;
    let polygonSourceY = 0;
    if (element) {
        const sourceNode = elements.find((x) => x.id === element.source);
        const sourceNodeSizeX = (sourceX - sourceNode.position.x) * 2;
        const sourceNodeSizeY = (sourceY - sourceNode.position.y) * 2;
        const targetNode = elements.find((x) => x.id === element.target);
        const targetNodeSizeX = (targetX - targetNode.position.x) * 2;
        const targetNodeSizeY = (targetY - targetNode.position.y) * 2;
        let heightVector = targetY > sourceY ? 1 : -1;
        let baseVector = targetX > sourceX ? 1 : -1;
        const triangleHeight = (targetY - sourceY) * heightVector;
        const triangleBase = (targetX - sourceX) * baseVector;
        const triangleHypotenuse = Math.sqrt(
            triangleHeight * triangleHeight + triangleBase * triangleBase
        );
        const sourceHeight = sourceNodeSizeY / 2;
        const sourceBase = sourceNodeSizeX / 2;
        const sourceHypotenuse = Math.sqrt(
            sourceHeight * sourceHeight + sourceBase * sourceBase
        );
        const sourceBetaAngle = Math.asin(sourceBase / sourceHypotenuse);
        const alphaAngle = Math.asin(triangleHeight / triangleHypotenuse);
        const betaAngle = 1.5708 - alphaAngle;
        let newHeight = 0;
        let newBase = 0;
        if (betaAngle < sourceBetaAngle) {
            newHeight = sourceHeight;
            const newHypotenuse = newHeight / Math.sin(alphaAngle);
            newBase = Math.sqrt(
                newHypotenuse * newHypotenuse - newHeight * newHeight
            );
            polygonSourceX = sourceX + newBase * baseVector;
            polygonSourceY = sourceY + newHeight * heightVector;
            componentPolygon = `${polygonSourceX + offsetSmall * baseVector},${
                polygonSourceY + offsetSmall * heightVector
            } ${polygonSourceX},${
                polygonSourceY + offsetMedium * heightVector
            } ${polygonSourceX - offsetSmall * baseVector},${
                polygonSourceY + offsetSmall * heightVector
            } ${polygonSourceX},${polygonSourceY}`;
        } else {
            newBase = sourceBase;
            const newHypotenuse = newBase / Math.sin(betaAngle);
            newHeight = Math.sqrt(
                newHypotenuse * newHypotenuse - newBase * newBase
            );
            polygonSourceX = sourceX + newBase * baseVector;
            polygonSourceY = sourceY + newHeight * heightVector;
            componentPolygon = `${polygonSourceX + offsetSmall * baseVector},${
                polygonSourceY - offsetSmall * heightVector
            } ${polygonSourceX + offsetMedium * baseVector},${polygonSourceY} ${
                polygonSourceX + offsetSmall * baseVector
            },${
                polygonSourceY + offsetSmall * heightVector
            } ${polygonSourceX},${polygonSourceY}`;
        }
        heightVector = targetY < sourceY ? 1 : -1;
        baseVector = targetX < sourceX ? 1 : -1;
        const targetHeight = targetNodeSizeY / 2;
        const targetBase = targetNodeSizeX / 2;
        const targetHypotenuse = Math.sqrt(
            targetHeight * targetHeight + targetBase * targetBase
        );
        const targetBetaAngle = Math.asin(targetBase / targetHypotenuse);
        if (betaAngle < targetBetaAngle) {
            newHeight = targetHeight;
            const newHypotenuse = newHeight / Math.sin(alphaAngle);
            newBase = Math.sqrt(
                newHypotenuse * newHypotenuse - newHeight * newHeight
            );
            polygonTargetX = targetX + newBase * baseVector;
            polygonTargetY = targetY + newHeight * heightVector;
            inheritancePolygon = `${
                polygonTargetX + offsetSmall * baseVector
            },${polygonTargetY + offsetMedium * heightVector} ${
                polygonTargetX - offsetSmall * baseVector
            },${
                polygonTargetY + offsetMedium * heightVector
            } ${polygonTargetX},${polygonTargetY}`;
            relationshipPolygon = `${
                polygonTargetX + offsetSmall * heightVector
            },${
                polygonTargetY + offsetMedium * heightVector
            } ${polygonTargetX},${polygonTargetY} ${
                polygonTargetX - offsetSmall * heightVector
            },${
                polygonTargetY + offsetMedium * heightVector
            } ${polygonTargetX},${polygonTargetY}`;
        } else {
            newBase = targetBase;
            const newHypotenuse = newBase / Math.sin(betaAngle);
            newHeight = Math.sqrt(
                newHypotenuse * newHypotenuse - newBase * newBase
            );
            polygonTargetX = targetX + newBase * baseVector;
            polygonTargetY = targetY + newHeight * heightVector;
            inheritancePolygon = `${
                polygonTargetX + offsetMedium * baseVector
            },${polygonTargetY + offsetSmall * heightVector} ${
                polygonTargetX + offsetMedium * baseVector
            },${
                polygonTargetY - offsetSmall * heightVector
            } ${polygonTargetX},${polygonTargetY}`;
            relationshipPolygon = `${
                polygonTargetX + offsetMedium * baseVector
            },${
                polygonTargetY - offsetSmall * heightVector
            } ${polygonTargetX},${polygonTargetY} ${
                polygonTargetX + offsetMedium * baseVector
            },${
                polygonTargetY + offsetSmall * heightVector
            } ${polygonTargetX},${polygonTargetY}`;
        }
    }

    const onNameChange = (evt) => {
        setNameText(evt.target.value);

        const displayName =
            typeof element.data.name === 'string'
                ? evt.target.value
                : {
                      ...element.data.name,
                      [Object.keys(data.name)[0]]: evt.target.value
                  };

        const relationship = new DTDLRelationship(
            element.data.id,
            element.data.name,
            displayName,
            element.data.description,
            element.data.comment,
            element.data.writable,
            element.data.content ? element.data.content : [],
            element.data.target,
            element.data.maxMultiplicity
        );

        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: relationship
        });
    };

    const onNameClick = () => {
        setNameEditor(true);
        if (
            element.data.type !== ModelTypes.relationship &&
            element.data.type !== ModelTypes.untargeted
        ) {
            setCurrentNode(null);
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: null
            });
            return;
        }

        const displayName =
            typeof element.data.name === 'string'
                ? element.data.name
                : {
                      ...element.data.name,
                      [Object.keys(element.data.name)[0]]: Object.values(
                          element.data.name
                      )[0]
                  };
        const relationship = new DTDLRelationship(
            element.data.id,
            element.data.name,
            displayName,
            element.data.description,
            element.data.comment,
            element.data.writable,
            element.data.content ? element.data.content : [],
            element.data.target,
            element.data.maxMultiplicity
        );

        setCurrentNode(element.id);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: relationship
        });
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

    const edgePath =
        sourceX > targetX
            ? `M${bezierPath[3]} ${bezierPath[0]}`
            : `M${bezierPath[0]} ${bezierPath[3]}`;
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY
    });

    const onDelete = () => {
        const elementsToRemove = [
            {
                id: data.id
            }
        ];
        setElements((els) => removeElements(elementsToRemove, els));
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: null
        });
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
                    points={inheritancePolygon}
                    cx={polygonTargetX}
                    cy={polygonTargetY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.inheritanceShape}
                />
            )}
            {(data.type === OATRelationshipHandleName ||
                data.type === OATUntargetedRelationshipName) &&
                showRelationships && (
                    <polygon
                        points={relationshipPolygon}
                        cx={polygonTargetX}
                        cy={polygonTargetY}
                        r={3}
                        strokeWidth={1.5}
                        className={graphViewerStyles.edgePath}
                    />
                )}
            {data.type === OATComponentHandleName && showComponents && (
                <polygon
                    points={componentPolygon}
                    cx={polygonSourceX}
                    cy={polygonSourceY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.componentShape}
                />
            )}
        </>
    );
};

export default OATGraphCustomEdge;
