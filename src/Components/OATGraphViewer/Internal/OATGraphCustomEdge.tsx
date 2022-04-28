import React, { useContext, useState } from 'react';
import { getBezierPath, getEdgeCenter } from 'react-flow-renderer';
import { IOATGraphCustomEdgeProps } from '../../Models/Constants/Interfaces';
import { getGraphViewerStyles } from '../OATGraphViewer.styles';
import { ElementsContext } from './OATContext';
import {
    UntargetedRelationshipName,
    RelationshipHandleName,
    ComponentHandleName,
    ExtendHandleName
} from '../../../Models/Constants/Constants';

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
    const { elements, setElements } = useContext(ElementsContext);
    const graphViewerStyles = getGraphViewerStyles();

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
    };

    const onNameClick = () => {
        setNameEditor(true);
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

    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    });
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY
    });

    return (
        <>
            {data.type === ExtendHandleName && (
                <path
                    id={id}
                    className={graphViewerStyles.inheritancePath}
                    d={edgePath}
                    onClick={onNameClick}
                    markerEnd={markerEnd}
                />
            )}
            {(data.type === RelationshipHandleName ||
                data.type === UntargetedRelationshipName) && (
                <path
                    id={id}
                    className={graphViewerStyles.edgePath}
                    d={edgePath}
                    onClick={onNameClick}
                    markerEnd={markerEnd}
                />
            )}
            {data.type === ComponentHandleName && (
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
                        <input
                            id="text"
                            name="text"
                            onChange={onNameChange}
                            value={nameText}
                            onBlur={onNameBlur}
                            onKeyDown={onKeyDown}
                            autoFocus
                        />
                    </body>
                </foreignObject>
            )}
            {!nameEditor && (
                <text>
                    <textPath
                        href={`#${id}`}
                        style={{ fontSize: '12px' }}
                        className={graphViewerStyles.textPath}
                        startOffset="50%"
                        textAnchor="middle"
                        onClick={onNameClick}
                    >
                        {data.name}
                    </textPath>
                </text>
            )}
            {data.type === ExtendHandleName && (
                <polygon
                    points={`${targetX - 5},${targetY - 10} ${targetX + 5},${
                        targetY - 10
                    } ${targetX},${targetY}`}
                    cx={targetX}
                    cy={targetY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.inheritancePath}
                />
            )}
            {(data.type === RelationshipHandleName ||
                data.type === UntargetedRelationshipName) && (
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
            {data.type === ComponentHandleName && (
                <polygon
                    points={`${sourceX + 5},${sourceY + 5} ${sourceX},${
                        sourceY + 10
                    } ${sourceX - 5},${sourceY + 5} ${sourceX},${sourceY}`}
                    cx={sourceX}
                    cy={sourceY}
                    r={3}
                    strokeWidth={1.5}
                    className={graphViewerStyles.componentPath}
                />
            )}
        </>
    );
};

export default OATGraphCustomEdge;
