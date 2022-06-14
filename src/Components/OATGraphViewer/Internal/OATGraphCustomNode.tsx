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
import { ModelTypes } from '../../../Models/Constants/Enums';

import {
    OATDisplayNameLengthLimit,
    OATIdLengthLimit
} from '../../../Models/Constants/Constants';

const enterKeyCode = 13;

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
    const [errorDisplayNameLength, setErrorDisplayNameLength] = useState(null);
    const [errorIdAlreadyUsed, setErrorIdAlreadyUsed] = useState(null);
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
    const { models } = state;

    const onNameChange = (evt) => {
        const currentValue = evt.target.value;
        // Check length of display name
        if (currentValue.length <= OATDisplayNameLengthLimit) {
            setErrorDisplayNameLength(null);
            setNameText(currentValue);
        } else {
            setErrorDisplayNameLength(true);
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
        if (
            typeof data.name === 'string' &&
            data.name !== nameText &&
            !errorDisplayNameLength
        ) {
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
        const currentValue = evt.target.value;
        // Check id length
        if (currentValue.length <= OATIdLengthLimit) {
            setIdLengthError(null);
            setIdText(currentValue);
            // Check id is valid DTMI
            if (DTMIRegex.test(currentValue)) {
                setIdValidDTMIError(null);
                // Check current value is not used by another model as @id within models
                const repeatedIdModel = models.find(
                    (model) =>
                        model['@id'] === currentValue &&
                        model['@type'] === ModelTypes.interface
                );
                if (repeatedIdModel) {
                    setErrorIdAlreadyUsed(true);
                } else {
                    setErrorIdAlreadyUsed(false);
                }
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
        // Only apply change if value is error free
        if (
            data.id !== idText &&
            !idLengthError &&
            !idValidDTMIError &&
            !errorIdAlreadyUsed
        ) {
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
        } else {
            setIdText(data.id);
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

    const getIdErrorMessage = () =>
        idLengthError
            ? t('OATGraphViewer.errorIdLength')
            : idValidDTMIError
            ? t('OATGraphViewer.errorIdValidDTMI')
            : errorIdAlreadyUsed
            ? t('OATGraphViewer.errorRepeatedId')
            : '';

    const handleOnKeyDownID = (keyCode) => {
        if (keyCode === enterKeyCode) {
            onIdBlur();
        }
    };
    const handleOnKeyDownDisplayName = (keyCode) => {
        if (keyCode === enterKeyCode) {
            onNameBlur();
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
                                    onKeyDown={(evt) => {
                                        handleOnKeyDownID(evt.keyCode);
                                    }}
                                    errorMessage={getIdErrorMessage()}
                                />
                            )}
                        </div>
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
                                    onKeyDown={(evt) => {
                                        handleOnKeyDownDisplayName(evt.keyCode);
                                    }}
                                    errorMessage={
                                        errorDisplayNameLength
                                            ? t(
                                                  'OATGraphViewer.errorDisplayNameLength'
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
