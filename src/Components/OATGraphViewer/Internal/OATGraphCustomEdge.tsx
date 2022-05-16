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

export enum modelTypes {
    relationship = 'Relationship',
    untargeted = 'Untargeted'
}

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
    const [nameText, setNameText] = useState(
        typeof data.name === 'string' ? data.name : Object.values(data.name)[0]
    );
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

    const element = elements.find((x) => x.id === id);
    if (element) {
        const sourceNode = elements.find((x) => x.id === element.source);
        const sourceNodeSize = (sourceX - sourceNode.position.x) * 2;
        const targetNode = elements.find((x) => x.id === element.target);
        const targetNodeSize = (targetX - targetNode.position.x) * 2;
        const connection = 3;
        const sources = elements.filter(
            (x) =>
                x.source === element.source &&
                x.sourceHandle === element.sourceHandle
        );
        if (sources.length > 1) {
            const separation = sourceNodeSize / connection / sources.length;
            const sourceRange = (separation * (sources.length - 1)) / 2;
            sourceX = sourceX - sourceRange;
            const indexX = sources.findIndex((x) => x.id === id);
            sourceX = indexX * separation + sourceX;
            sourceY = sourceY - connection;
        }
        const targets = elements.filter((x) => x.target === element.target);
        if (targets.length > 1) {
            const separation = targetNodeSize / targets.length;
            const targetRange = (separation * (targets.length - 1)) / 2;
            targetX = targetX - targetRange;
            const indexY = targets.findIndex((x) => x.id === id);
            targetX = indexY * separation + targetX;
            targetY = targetY + connection;
        }
    }

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
        const relationshipData = {
            '@id': element.data.id,
            id,
            '@type': element.data.type,
            '@context': element.data.context,
            displayName:
                typeof element.data.name === 'string'
                    ? evt.target.value
                    : {
                          ...element.data.name,
                          [Object.keys(data.name)[0]]: evt.target.value
                      },
            contents: element.data.content ? element.data.content : []
        };
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: relationshipData
        });
    };

    const onNameClick = () => {
        setNameEditor(true);
        if (
            element.data.type !== modelTypes.relationship &&
            element.data.type !== modelTypes.untargeted
        ) {
            setCurrentNode(null);
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: null
            });
            return;
        }

        const clickedRelationship = {
            '@id': element.data.id,
            id,
            '@type': element.data.type,
            '@context': element.data.context,
            displayName:
                typeof element.data.name === 'string'
                    ? element.data.name
                    : {
                          ...element.data.name,
                          [Object.keys(element.data.name)[0]]: Object.values(
                              element.data.name
                          )[0]
                      },
            contents: element.data.content ? element.data.content : []
        };
        setCurrentNode(element.id);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: clickedRelationship
        });
    }; //

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
            ? `M${bezierPath[3]} C${bezierPath[2]} ${bezierPath[1]} ${bezierPath[0]}`
            : `M${bezierPath[0]} C${bezierPath[1]} ${bezierPath[2]} ${bezierPath[3]}`;
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
        setModel(null);
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
            {!nameEditor && (
                <text>
                    <textPath
                        href={`#${id}`}
                        className={graphViewerStyles.textPath}
                        startOffset="50%"
                        textAnchor="middle"
                        onClick={onNameClick}
                    >
                        {typeof data.name === 'string'
                            ? data.name
                            : Object.values(data.name)[0]}
                    </textPath>
                </text>
            )}
            {data.type === OATExtendHandleName && showInheritances && (
                <polygon
                    points={`${targetX - 5},${targetY - 10} ${targetX + 5},${
                        targetY - 10
                    } ${targetX},${targetY}`}
                    cx={targetX}
                    cy={targetY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.inheritanceShape}
                />
            )}
            {(data.type === OATRelationshipHandleName ||
                data.type === OATUntargetedRelationshipName) &&
                showRelationships && (
                    <polygon
                        points={`${targetX - 5},${
                            targetY - 5
                        } ${targetX},${targetY} ${targetX + 5},${
                            targetY - 5
                        } ${targetX},${targetY}`}
                        cx={targetX}
                        cy={targetY}
                        r={3}
                        strokeWidth={1.5}
                        className={graphViewerStyles.edgePath}
                    />
                )}
            {data.type === OATComponentHandleName && showComponents && (
                <polygon
                    points={`${sourceX + 5},${sourceY + 5} ${sourceX},${
                        sourceY + 10
                    } ${sourceX - 5},${sourceY + 5} ${sourceX},${sourceY}`}
                    cx={sourceX}
                    cy={sourceY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.componentShape}
                />
            )}
        </>
    );
};

export default OATGraphCustomEdge;
