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

const foreignObjectSize = 180;

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
    const [nameText, setNameText] = useState(data.name);
    const { elements, setElements, dispatch, setCurrentNode } = useContext(
        ElementsContext
    );
    const graphViewerStyles = getGraphViewerStyles();
    const theme = useTheme();
    sourceY = sourceY - 6;

    const element = elements.find((x) => x.id === id);
    const sourceNode = elements.find((x) => x.id === element.source);
    const sourceNodeSizeX = (sourceX - sourceNode.position.x) * 2;
    const sourceNodeSizeY = (sourceY - sourceNode.position.y) * 2;
    const targetNode = elements.find((x) => x.id === element.target);
    const targetNodeSizeX = (targetX - targetNode.position.x) * 2;
    const targetNodeSizeY = (targetY - targetNode.position.y) * 2;
    /*if (element) {
        const connection = 3;
        const sources = elements.filter(
            (x) => x.source === element.source && x.target === element.target
        );
        if (sources.length > 1) {
            const separation = sourceNodeSizeX / sources.length;
            const sourceRange = (separation * (sources.length - 1)) / 2;
            sourceX = sourceX - sourceRange;
            const indexX = sources.findIndex((x) => x.id === id);
            sourceX = indexX * separation + sourceX;
            sourceY = sourceY - connection;
        }
        const targets = elements.filter(
            (x) => x.source === element.source && x.target === element.target
        );
        if (targets.length > 1) {
            const separation = targetNodeSizeX / targets.length;
            const targetRange = (separation * (targets.length - 1)) / 2;
            targetX = targetX - targetRange;
            const indexY = targets.findIndex((x) => x.id === id);
            targetX = indexY * separation + targetX;
            targetY = targetY + connection;
        }
    }*/
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
    let polygonSourceX = 0;
    let polygonSourceY = 0;
    let componentPolygon = '';
    if (betaAngle < sourceBetaAngle) {
        newHeight = sourceHeight;
        const newHypotenuse = newHeight / Math.sin(alphaAngle);
        newBase = Math.sqrt(
            newHypotenuse * newHypotenuse - newHeight * newHeight
        );
        polygonSourceX = sourceX + newBase * baseVector;
        polygonSourceY = sourceY + newHeight * heightVector;
        componentPolygon = `${polygonSourceX + 5 * baseVector},${
            polygonSourceY + 5 * heightVector
        } ${polygonSourceX},${polygonSourceY + 10 * heightVector} ${
            polygonSourceX - 5 * baseVector
        },${
            polygonSourceY + 5 * heightVector
        } ${polygonSourceX},${polygonSourceY}`;
    } else {
        newBase = sourceBase;
        const newHypotenuse = newBase / Math.sin(betaAngle);
        newHeight = Math.sqrt(
            newHypotenuse * newHypotenuse - newBase * newBase
        );
        polygonSourceX = sourceX + newBase * baseVector;
        polygonSourceY = sourceY + newHeight * heightVector;
        componentPolygon = `${polygonSourceX + 5 * baseVector},${
            polygonSourceY - 5 * heightVector
        } ${polygonSourceX + 10 * baseVector},${polygonSourceY} ${
            polygonSourceX + 5 * baseVector
        },${
            polygonSourceY + 5 * heightVector
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
    let polygonTargetX = 0;
    let polygonTargetY = 0;
    let inheritancePolygon = '';
    let relationshipPolygon = '';
    if (betaAngle < targetBetaAngle) {
        newHeight = targetHeight;
        const newHypotenuse = newHeight / Math.sin(alphaAngle);
        newBase = Math.sqrt(
            newHypotenuse * newHypotenuse - newHeight * newHeight
        );
        polygonTargetX = targetX + newBase * baseVector;
        polygonTargetY = targetY + newHeight * heightVector;
        inheritancePolygon = `${polygonTargetX + 5 * baseVector},${
            polygonTargetY + 10 * heightVector
        } ${polygonTargetX - 5 * baseVector},${
            polygonTargetY + 10 * heightVector
        } ${polygonTargetX},${polygonTargetY}`;
        relationshipPolygon = `${polygonTargetX + 5 * heightVector},${
            polygonTargetY + 10 * heightVector
        } ${polygonTargetX},${polygonTargetY} ${
            polygonTargetX - 5 * heightVector
        },${
            polygonTargetY + 10 * heightVector
        } ${polygonTargetX},${polygonTargetY}`;
    } else {
        newBase = targetBase;
        const newHypotenuse = newBase / Math.sin(betaAngle);
        newHeight = Math.sqrt(
            newHypotenuse * newHypotenuse - newBase * newBase
        );
        polygonTargetX = targetX + newBase * baseVector;
        polygonTargetY = targetY + newHeight * heightVector;
        inheritancePolygon = `${polygonTargetX + 10 * baseVector},${
            polygonTargetY + 5 * heightVector
        } ${polygonTargetX + 10 * baseVector},${
            polygonTargetY - 5 * heightVector
        } ${polygonTargetX},${polygonTargetY}`;
        relationshipPolygon = `${polygonTargetX + 10 * baseVector},${
            polygonTargetY - 5 * heightVector
        } ${polygonTargetX},${polygonTargetY} ${
            polygonTargetX + 10 * baseVector
        },${
            polygonTargetY + 5 * heightVector
        } ${polygonTargetX},${polygonTargetY}`;
    }

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
    };

    const onNameClick = () => {
        setNameEditor(true);
        const clickedRelationship = {
            '@id': element.data.id,
            id,
            '@type': element.data.type,
            '@context': element.data.context,
            displayName: element.data.name,
            contents: element.data.content ? element.data.content : []
        };
        setCurrentNode(element.id);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: clickedRelationship
        });
    };

    const onNameBlur = () => {
        setNameEditor(false);
        if (data.name !== nameText) {
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
            {data.type === OATExtendHandleName && (
                <path
                    id={id}
                    className={graphViewerStyles.inheritancePath}
                    d={edgePath}
                    onClick={onNameClick}
                    markerEnd={markerEnd}
                />
            )}
            {(data.type === OATRelationshipHandleName ||
                data.type === OATUntargetedRelationshipName) && (
                <path
                    id={id}
                    className={graphViewerStyles.edgePath}
                    d={edgePath}
                    onClick={onNameClick}
                    markerEnd={markerEnd}
                />
            )}
            {data.type === OATComponentHandleName && (
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
            {!nameEditor && (
                <text>
                    <textPath
                        href={`#${id}`}
                        className={graphViewerStyles.textPath}
                        startOffset="50%"
                        textAnchor="middle"
                        onClick={onNameClick}
                    >
                        {data.name}
                    </textPath>
                </text>
            )}
            {data.type === OATExtendHandleName && (
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
                data.type === OATUntargetedRelationshipName) && (
                <polygon
                    points={relationshipPolygon}
                    cx={targetX}
                    cy={targetY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.edgePath}
                />
            )}
            {data.type === OATComponentHandleName && (
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
