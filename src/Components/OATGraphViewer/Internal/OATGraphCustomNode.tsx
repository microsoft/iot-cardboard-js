import React, { useState, useContext } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { Icon, ActionButton, Label, TooltipHost } from '@fluentui/react';
import { Handle } from 'react-flow-renderer';
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
    OATInterfaceType
} from '../../../Models/Constants/Constants';
import {
    SET_OAT_SELECTED_MODEL,
    SET_OAT_CONFIRM_DELETE_OPEN,
    SET_OAT_MODELS,
    SET_OAT_MODELS_POSITIONS
} from '../../../Models/Constants/ActionTypes';
import {
    getPropertyDisplayName,
    isDisplayNameDefined
} from '../../OATPropertyEditor/Utils';
import OATTextFieldDisplayName from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldId from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';
import IconRelationship from '../../../Resources/Static/relationshipTargeted.svg';
import IconUntargeted from '../../../Resources/Static/relationshipUntargeted.svg';
import IconInheritance from '../../../Resources/Static/relationshipInheritance.svg';
import IconComponent from '../../../Resources/Static/relationshipComponent.svg';
import Svg from 'react-inlinesvg';
import {
    deepCopy,
    getNewModelNewModelsAndNewPositionsFromId
} from '../../../Models/Services/Utils';

const OATGraphCustomNode: React.FC<IOATGraphCustomNodeProps> = ({
    data,
    isConnectable
}) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(getPropertyDisplayName(data));
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState(data.id);
    const { dispatch, state, currentHovered, currentNodeIdRef } = useContext(
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
    const { model, models, modelPositions } = state;

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
        const deletion = () => {
            const dispatchDelete = () => {
                // Remove the model from the list
                const newModels = deepCopy(models);
                const index = newModels.findIndex(
                    (element) => element['@id'] === model['@id']
                );
                newModels.splice(index, 1);
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: newModels
                });
                // Dispatch selected model to null
                dispatch({
                    type: SET_OAT_SELECTED_MODEL,
                    payload: null
                });
            };
            dispatch({
                type: SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
        };

        if (!state.modified) {
            execute(deletion, undoDeletion);
        }
    };

    const onDisplayNameCommit = (value: string) => {
        const update = () => {
            setNameEditor(false);
            const modelCopy = deepCopy(model);
            modelCopy.displayName = value;
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: modelCopy
            });
            setNameText(value);
        };

        const undoUpdate = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
        };

        execute(update, undoUpdate);
    };

    const onIdCommit = (value: string) => {
        const commit = () => {
            const modelData = getNewModelNewModelsAndNewPositionsFromId(
                value,
                model,
                models,
                modelPositions
            );

            dispatch({
                type: SET_OAT_MODELS_POSITIONS,
                payload: modelData.positions
            });

            dispatch({
                type: SET_OAT_MODELS,
                payload: modelData.models
            });

            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: modelData.model
            });
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_MODELS_POSITIONS,
                payload: modelPositions
            });
        };

        if (value) {
            execute(commit, undoCommit);
        }

        setIdText(value);
        setIdEditor(false);
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
            <div
                className={
                    model &&
                    currentNodeIdRef &&
                    currentNodeIdRef.current === data.id
                        ? graphViewerStyles.selectedNode
                        : graphViewerStyles.node
                }
            >
                <ActionButton styles={actionButtonStyles} onClick={onDelete}>
                    <Icon iconName="Delete" styles={iconStyles} />
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
                                    value={idText}
                                    model={model}
                                    models={models}
                                    onCommit={onIdCommit}
                                    autoFocus
                                />
                            )}
                        </div>
                        <div className={graphViewerStyles.nodeContainer}>
                            <span>{t('OATGraphViewer.name')}:</span>
                            {!nameEditor && (
                                <Label
                                    className={
                                        isDisplayNameDefined(data.name)
                                            ? ''
                                            : graphViewerStyles.placeholderText
                                    }
                                    onDoubleClick={onNameClick}
                                >
                                    {isDisplayNameDefined(data.name)
                                        ? getPropertyDisplayName(data)
                                        : t('OATPropertyEditor.displayName')}
                                </Label>
                            )}
                            {nameEditor && (
                                <OATTextFieldDisplayName
                                    value={nameText}
                                    model={model}
                                    onCommit={onDisplayNameCommit}
                                    autoFocus
                                    placeholder={t(
                                        'OATPropertyEditor.displayName'
                                    )}
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
            {data.type === OATInterfaceType && (
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
