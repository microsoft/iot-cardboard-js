import React, { useState, useContext } from 'react';
import { Icon, ActionButton, TextField, Label } from '@fluentui/react';
import { Handle, removeElements } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { IOATGraphCustomNodeProps } from '../../Models/Constants/Interfaces';
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
    OATUntargetedRelationshipName
} from '../../../Models/Constants/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../Models/Constants/ActionTypes';
import { DTDLModel } from '../../../Models/Classes/DTDL';
import { getPropertyDisplayName } from '../../OATPropertyEditor/Utils';

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
    const { elements, setElements, setCurrentNode, dispatch } = useContext(
        ElementsContext
    );
    const graphViewerStyles = getGraphViewerStyles();
    const iconStyles = getGraphViewerIconStyles();
    const actionButtonStyles = getGraphViewerActionButtonStyles();

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
    };

    const onNameClick = () => {
        setNameText(getPropertyDisplayName(data));
        setNameEditor(true);
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
            return;
        }
        elements.find((element) => element.id === data.id).data.name[
            Object.keys(data.name)[0]
        ] = nameText;
        const displayName = {
            ...data.name,
            [Object.keys(data.name)[0]]: Object.values(data.name)[0]
        };
        setElements([...elements]);
        const updatedModel = new DTDLModel(
            data.id,
            displayName,
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
    };

    const onIdChange = (evt) => {
        setIdText(evt.target.value);
    };

    const onIdClick = () => {
        setIdEditor(true);
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
        const elementsToRemove = [
            {
                id: data.id
            }
        ];

        setElements((els) => removeElements(elementsToRemove, els));
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: null });
    };

    return (
        <>
            <Handle
                type="target"
                position="top"
                className={graphViewerStyles.handle}
                isConnectable={isConnectable}
            />
            <div className={graphViewerStyles.node}>
                <ActionButton styles={actionButtonStyles} onClick={onDelete}>
                    <Icon iconName="Cancel" styles={iconStyles} />
                </ActionButton>
                {data.type !== OATUntargetedRelationshipName && (
                    <>
                        <div className={graphViewerStyles.nodeContainer}>
                            <label>{t('OATGraphViewer.name')}:</label>
                            {!nameEditor && (
                                <Label onClick={onNameClick}>
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
                                />
                            )}
                        </div>
                        <div className={graphViewerStyles.nodeContainer}>
                            {t('OATGraphViewer.id')}:
                            {!idEditor && (
                                <Label onClick={onIdClick}>{data.id}</Label>
                            )}
                            {idEditor && (
                                <TextField
                                    id="text"
                                    name="text"
                                    onChange={onIdChange}
                                    value={idText}
                                    onBlur={onIdBlur}
                                    autoFocus
                                />
                            )}
                        </div>
                    </>
                )}
                {data.type === OATUntargetedRelationshipName && (
                    <>
                        <div>
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
                        className={graphViewerStyles.componentHandle}
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATRelationshipHandleName}
                        className={graphViewerStyles.relationshipHandle}
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATExtendHandleName}
                        className={graphViewerStyles.extendHandle}
                        isConnectable={isConnectable}
                    />
                </>
            )}
        </>
    );
};

export default OATGraphCustomNode;
