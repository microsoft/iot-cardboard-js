import React, { useState, useContext } from 'react';
import { Icon, ActionButton, Label } from '@fluentui/react';
import { Handle, removeElements } from 'react-flow-renderer';
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
    OATUntargetedRelationshipName
} from '../../../Models/Constants/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../Models/Constants/ActionTypes';
import { getPropertyDisplayName } from '../../OATPropertyEditor/Utils';
import OATTextFieldDisplayName from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';

import OATTextFieldId from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';

const OATGraphCustomNode: React.FC<IOATGraphCustomNodeProps> = ({
    data,
    isConnectable
}) => {
    const { t } = useTranslation();
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(getPropertyDisplayName(data));
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState(data.id);
    const { setElements, dispatch, state, currentHovered } = useContext(
        ElementsContext
    );
    const graphViewerStyles = getGraphViewerStyles();
    const iconStyles = getGraphViewerIconStyles();
    const actionButtonStyles = getGraphViewerActionButtonStyles();
    const { model } = state;

    const onNameClick = () => {
        if (!state.modified) {
            setNameText(getPropertyDisplayName(data));
            setNameEditor(true);
        }
    };

    const onIdClick = () => {
        if (!state.modified) {
            setIdEditor(true);
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
                            <span>{t('OATGraphViewer.id')}:</span>
                            {!idEditor && (
                                <Label onDoubleClick={onIdClick}>
                                    {data.id}
                                </Label>
                            )}
                            {idEditor && (
                                <OATTextFieldId
                                    id={idText}
                                    setId={setIdText}
                                    dispatch={dispatch}
                                    state={state}
                                    onCommitCallback={() => {
                                        setIdEditor(false);
                                    }}
                                    autoFocus
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
                                <OATTextFieldDisplayName
                                    displayName={nameText}
                                    setDisplayName={setNameText}
                                    dispatch={dispatch}
                                    model={model}
                                    onCommitCallback={() => {
                                        setNameEditor(false);
                                    }}
                                    autoFocus
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
