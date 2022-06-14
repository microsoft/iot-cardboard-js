import React, { useState, useContext, useEffect } from 'react';
import { Icon, ActionButton, TextField, Label } from '@fluentui/react';
import { Handle, removeElements, useStoreState } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { IOATGraphCustomNodeProps } from '../../../Models/Constants/Interfaces';
import {
    getGraphViewerStyles,
    getGraphViewerIconStyles,
    getGraphViewerActionButtonStyles
} from '../OATGraphViewer.styles';
import { ElementsContext } from './OATContext';
import {
    OATRelationshipHandleName,
    OATComponentHandleName,
    OATExtendHandleName,
    OATUntargetedRelationshipName,
    DTMIRegex
} from '../../../Models/Constants/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../Models/Constants/ActionTypes';
import { DTDLModel } from '../../../Models/Classes/DTDL';
import { getPropertyDisplayName } from '../../OATPropertyEditor/Utils';

import {
    OATDisplayNameLengthLimit,
    OATIdLengthLimit
} from '../../../Models/Constants/Constants';

const OATGraphCustomNode: React.FC<IOATGraphCustomNodeProps> = ({
    data,
    isConnectable
}) => {
    const { t } = useTranslation();
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(
        data.name === 'string' ? data.name : Object.values(data.name)[0]
    );
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState(data.id);
    const [displayNameError, setDisplayNameError] = useState(false);
    const [idLengthError, setIdLengthError] = useState(false);
    const [idValidDTMIError, setIdValidDTMIError] = useState(null);
    const {
        elements,
        setElements,
        setCurrentNode,
        dispatch,
        state,
        currentHovered
    } = useContext(ElementsContext);
    const graphViewerStyles = getGraphViewerStyles();
    const iconStyles = getGraphViewerIconStyles();
    const actionButtonStyles = getGraphViewerActionButtonStyles();

    const onNameChange = (evt) => {
        if (evt.target.value.length <= OATDisplayNameLengthLimit) {
            setNameText(evt.target.value);
            setDisplayNameError(null);
        } else {
            setDisplayNameError(true);
        }
    };

    const onNameClick = () => {
        if (!state.modified) {
            setNameText(getPropertyDisplayName(data));
            setNameEditor(true);
        }
    };

    const onNameBlur = () => {
        setNameEditor(false);
        if (typeof data.name === 'string' && data.name !== nameText) {
            elements.find(
                (element) => element.id === data.id
            ).data.name = nameText;
            setElements([...elements]);
            const updatedModel = new DTDLModel(
                data.id,
                nameText,
                data.description,
                data.comment,
                data.content,
                data.relationships,
                data.components
            );
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: updatedModel
            });
        }
        if (typeof data.name === 'object' && data.name !== nameText) {
            elements.find((element) => element.id === data.id).data.name[
                Object.keys(data.name)[0]
            ] = nameText;
            const updatedName = {
                ...data.name,
                [Object.keys(data.name)[0]]: Object.values(data.name)[0]
            };
            setElements([...elements]);
            const updatedModel = new DTDLModel(
                data.id,
                updatedName,
                data.description,
                data.comment,
                data.content,
                data.relationships,
                data.components
            );
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: updatedModel
            });
        }
    };

    const onIdChange = (evt) => {
        if (evt.target.value.length <= OATIdLengthLimit) {
            setIdLengthError(null);
            if (DTMIRegex.test(evt.target.value)) {
                setIdValidDTMIError(null);
                setIdText(evt.target.value);
            } else {
                setIdValidDTMIError(true);
            }
        } else {
            setIdLengthError(true);
        }
    };

    const onIdClick = () => {
        if (!state.modified) {
            setIdEditor(true);
        }
    };

    const onIdBlur = () => {
        setIdEditor(false);
        const prevId = data.id;
        if (data.id !== idText) {
            elements
                .filter((x) => x.source === data.id)
                .forEach((x) => (x.source = idText));
            elements
                .filter((x) => x.target === data.id)
                .forEach((x) => (x.target = idText));
            elements.find((element) => element.id === prevId).data.id = idText;
            elements.find((element) => element.id === prevId).id = idText;
            setElements([...elements]);
            const updatedModel = new DTDLModel(
                data.id,
                data.name,
                data.description,
                data.comment,
                data.content,
                data.relationships,
                data.components
            );
            setCurrentNode(idText);
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: updatedModel
            });
        }
    };

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
            {data.type === OATUntargetedRelationshipName && (
                <Handle
                    type="target"
                    position="top"
                    className={graphViewerStyles.handle}
                    isConnectable={isConnectable}
                />
            )}
            <div className={graphViewerStyles.node}>
                <ActionButton styles={actionButtonStyles} onClick={onDelete}>
                    <Icon iconName="Cancel" styles={iconStyles} />
                </ActionButton>
                {data.type !== OATUntargetedRelationshipName && (
                    <>
                        <div className={graphViewerStyles.nodeContainer}>
                            <span>{t('OATGraphViewer.name')}:</span>
                            {!nameEditor && (
                                <Label onDoubleClick={onNameClick}>
                                    {getPropertyDisplayName(data)}
                                </Label>
                            )}
                            {nameEditor && (
                                <TextField
                                    id="text"
                                    name="text"
                                    onChange={onNameChange}
                                    value={nameText}
                                    onBlur={onNameBlur}
                                    autoFocus
                                    errorMessage={
                                        displayNameError
                                            ? t(
                                                  'OATGraphViewer.errorDisplayName'
                                              )
                                            : ''
                                    }
                                />
                            )}
                        </div>
                        <div className={graphViewerStyles.nodeContainer}>
                            <span>{t('OATGraphViewer.id')}:</span>
                            {!idEditor && (
                                <Label onDoubleClick={onIdClick}>
                                    {data.id}
                                </Label>
                            )}
                            {idEditor && (
                                <TextField
                                    id="text"
                                    name="text"
                                    onChange={onIdChange}
                                    value={idText}
                                    onBlur={onIdBlur}
                                    autoFocus
                                    errorMessage={
                                        idLengthError
                                            ? t('OATGraphViewer.errorIdLength')
                                            : idValidDTMIError
                                            ? t(
                                                  'OATGraphViewer.errorIdValidDTMI'
                                              )
                                            : ''
                                    }
                                />
                            )}
                        </div>
                    </>
                )}
                {data.type === OATUntargetedRelationshipName && (
                    <>
                        <div
                            className={
                                graphViewerStyles.untargetedNodeContainer
                            }
                        >
                            <Label>{data.type}</Label>
                        </div>
                    </>
                )}
            </div>
            {data.type === 'Interface' && (
                <>
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATComponentHandleName}
                        className={
                            currentHovered && currentHovered.id === data.id
                                ? graphViewerStyles.componentHandleFocus
                                : graphViewerStyles.componentHandleHidden
                        }
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATRelationshipHandleName}
                        className={
                            currentHovered && currentHovered.id === data.id
                                ? graphViewerStyles.relationshipHandleFocus
                                : graphViewerStyles.relationshipHandleHidden
                        }
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATUntargetedRelationshipName}
                        className={
                            currentHovered && currentHovered.id === data.id
                                ? graphViewerStyles.untargetRelationshipHandleFocus
                                : graphViewerStyles.untargetRelationshipHandleHidden
                        }
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATExtendHandleName}
                        className={
                            currentHovered && currentHovered.id === data.id
                                ? graphViewerStyles.extendHandleFocus
                                : graphViewerStyles.extendHandleHidden
                        }
                        isConnectable={isConnectable}
                    />
                </>
            )}
        </>
    );
};

export default OATGraphCustomNode;
