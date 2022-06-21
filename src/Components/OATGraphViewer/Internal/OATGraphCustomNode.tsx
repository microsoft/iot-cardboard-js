import React, { useState, useContext } from 'react';
import { Icon, ActionButton, Label, TooltipHost } from '@fluentui/react';
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
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_DELETED_MODEL_ID,
    SET_OAT_CONFIRM_DELETE_OPEN
} from '../../../Models/Constants/ActionTypes';
import { getPropertyDisplayName } from '../../OATPropertyEditor/Utils';
import OATTextFieldDisplayName from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldId from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';
import IconRelationship from '../../../Resources/Static/relationshipTargeted.svg';
import IconUntargeted from '../../../Resources/Static/relationshipUntargeted.svg';
import IconInheritance from '../../../Resources/Static/relationshipInheritance.svg';
import IconComponent from '../../../Resources/Static/relationshipComponent.svg';
import Svg from 'react-inlinesvg';

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
    const [handleHoverRelationship, setHandleHoverRelationship] = useState(
        false
    );
    const [handleHoverComponent, setHandleHoverComponent] = useState(false);
    const [handleHoverExtend, setHandleHoverExtend] = useState(false);
    const [handleHoverUntargeted, setHandleHoverUntargeted] = useState(false);
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
            const dispatchDelete = () => {
                dispatch({
                    type: SET_OAT_DELETED_MODEL_ID,
                    payload: data.id
                });
            };
            dispatch({
                type: SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
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
                                    onCommit={() => {
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
                                    onCommit={() => {
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
                    <TooltipHost
                        content={OATComponentHandleName}
                        id={`${OATComponentHandleName}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${data.name}${OATComponentHandleName}`
                        }}
                    >
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
                            onMouseOver={() => {
                                setHandleHoverComponent(true);
                            }}
                            onMouseLeave={() => {
                                setHandleHoverComponent(false);
                            }}
                        >
                            <div
                                className={
                                    !handleHoverComponent &&
                                    currentHovered &&
                                    currentHovered.id === data.id
                                        ? graphViewerStyles.handleContentComponent
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconComponent}
                                id={`${data.name}${OATComponentHandleName}`}
                                className={
                                    handleHoverComponent
                                        ? graphViewerStyles.handleContentIcon
                                        : graphViewerStyles.handleContentIconHidden
                                }
                            />
                        </Handle>
                    </TooltipHost>
                    <TooltipHost
                        content={OATRelationshipHandleName}
                        id={`${OATRelationshipHandleName}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${data.name}${OATRelationshipHandleName}`
                        }}
                    >
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
                            onMouseOver={() => {
                                setHandleHoverRelationship(true);
                            }}
                            onMouseLeave={() => {
                                setHandleHoverRelationship(false);
                            }}
                        >
                            <div
                                className={
                                    !handleHoverRelationship &&
                                    currentHovered &&
                                    currentHovered.id === data.id
                                        ? graphViewerStyles.handleContentRelationship
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconRelationship}
                                id={`${data.name}${OATRelationshipHandleName}`}
                                className={
                                    handleHoverRelationship
                                        ? graphViewerStyles.handleContentIcon
                                        : graphViewerStyles.handleContentIconHidden
                                }
                            />
                        </Handle>
                    </TooltipHost>
                    <TooltipHost
                        content={OATUntargetedRelationshipName}
                        id={`${OATUntargetedRelationshipName}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${data.name}${OATUntargetedRelationshipName}`
                        }}
                    >
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
                            onMouseOver={() => {
                                setHandleHoverUntargeted(true);
                            }}
                            onMouseLeave={() => {
                                setHandleHoverUntargeted(false);
                            }}
                        >
                            <div
                                className={
                                    !handleHoverUntargeted &&
                                    currentHovered &&
                                    currentHovered.id === data.id
                                        ? graphViewerStyles.handleContentRelationship
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconUntargeted}
                                id={`${data.name}${OATUntargetedRelationshipName}`}
                                className={
                                    handleHoverUntargeted
                                        ? graphViewerStyles.handleContentIcon
                                        : graphViewerStyles.handleContentIconHidden
                                }
                            />
                        </Handle>
                    </TooltipHost>
                    <TooltipHost
                        content={OATExtendHandleName}
                        id={`${OATExtendHandleName}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${data.name}${OATExtendHandleName}`
                        }}
                    >
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
                            onMouseOver={() => {
                                setHandleHoverExtend(true);
                            }}
                            onMouseLeave={() => {
                                setHandleHoverExtend(false);
                            }}
                        >
                            <div
                                className={
                                    !handleHoverExtend &&
                                    currentHovered &&
                                    currentHovered.id === data.id
                                        ? graphViewerStyles.handleContentExtend
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconInheritance}
                                id={`${data.name}${OATExtendHandleName}`}
                                className={
                                    handleHoverExtend
                                        ? graphViewerStyles.handleContentIcon
                                        : graphViewerStyles.handleContentIconHidden
                                }
                            />
                        </Handle>
                    </TooltipHost>
                </>
            )}
        </>
    );
};

export default OATGraphCustomNode;
