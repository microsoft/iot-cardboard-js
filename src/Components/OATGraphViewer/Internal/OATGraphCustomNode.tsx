import React, { useMemo, useState, useContext } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { Icon, ActionButton, Label, TooltipHost } from '@fluentui/react';
import { Handle, Position } from 'react-flow-renderer';
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
    getDisplayName,
    isDisplayNameDefined
} from '../../OATPropertyEditor/Utils';
import OATTextFieldDisplayName from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldId from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';
import IconRelationship from '../../../Resources/Static/relationshipTargeted.svg';
import IconUntargeted from '../../../Resources/Static/relationshipUntargeted.svg';
import IconInheritance from '../../../Resources/Static/relationshipInheritance.svg';
import IconComponent from '../../../Resources/Static/relationshipComponent.svg';
import Svg from 'react-inlinesvg';
import { deepCopy } from '../../../Models/Services/Utils';
import {
    deleteOatModel,
    updateModelId
} from '../../../Models/Services/OatUtils';

const OATGraphCustomNode: React.FC<IOATGraphCustomNodeProps> = ({
    id,
    data,
    isConnectable
}) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(getDisplayName(data.displayName));
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState(data['@id']);
    const { dispatch, state, currentHovered } = useContext(ElementsContext);
    const graphViewerStyles = getGraphViewerStyles();
    const iconStyles = getGraphViewerIconStyles();
    const actionButtonStyles = getGraphViewerActionButtonStyles();
    const [handleHoverRelationship, setHandleHoverRelationship] = useState(
        false
    );
    const [handleHoverComponent, setHandleHoverComponent] = useState(false);
    const [handleHoverExtend, setHandleHoverExtend] = useState(false);
    const [handleHoverUntargeted, setHandleHoverUntargeted] = useState(false);
    const { selection, models, modelPositions } = state;
    const isSelected = useMemo(
        () => selection && selection.modelId === id && !selection.contentId,
        [id, selection]
    );

    const onNameClick = () => {
        if (!state.modified) {
            setNameText(getDisplayName(data.displayName));
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
                const modelsCopy = deleteOatModel(id, data, models);
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: modelsCopy
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
                payload: selection
            });
        };

        if (!state.modified) {
            execute(deletion, undoDeletion);
        }
    };

    const onDisplayNameCommit = (value: string) => {
        const update = () => {
            const modelsCopy = deepCopy(models);
            const model = modelsCopy.find((model) => model['@id'] === id);
            if (model) {
                model.displayName = value;
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: modelsCopy
                });
            }
            setNameText(value);
            setNameEditor(false);
        };

        const undoUpdate = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
        };

        execute(update, undoUpdate);
    };

    const onIdCommit = (value: string) => {
        const commit = () => {
            const [modelsCopy, modelPositionsCopy] = updateModelId(
                id,
                value,
                models,
                modelPositions
            );

            dispatch({
                type: SET_OAT_MODELS_POSITIONS,
                payload: modelPositionsCopy
            });
            dispatch({
                type: SET_OAT_MODELS,
                payload: modelsCopy
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: { modelId: value }
            });
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_MODELS_POSITIONS,
                payload: modelPositions
            });
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: selection
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
            {data['@type'] === OATUntargetedRelationshipName && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className={graphViewerStyles.handle}
                    isConnectable={isConnectable}
                />
            )}
            <div
                className={
                    isSelected
                        ? graphViewerStyles.selectedNode
                        : graphViewerStyles.node
                }
            >
                <ActionButton styles={actionButtonStyles} onClick={onDelete}>
                    <Icon iconName="Delete" styles={iconStyles} />
                </ActionButton>
                {data['@type'] !== OATUntargetedRelationshipName && (
                    <>
                        <div className={graphViewerStyles.nodeContainer}>
                            <span>{t('OATGraphViewer.id')}:</span>
                            {!idEditor && (
                                <Label onDoubleClick={onIdClick}>
                                    {data['@id']}
                                </Label>
                            )}
                            {idEditor && (
                                <OATTextFieldId
                                    value={idText}
                                    model={data}
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
                                        isDisplayNameDefined(data.displayName)
                                            ? ''
                                            : graphViewerStyles.placeholderText
                                    }
                                    onDoubleClick={onNameClick}
                                >
                                    {isDisplayNameDefined(data.displayName)
                                        ? getDisplayName(data.displayName)
                                        : t('OATPropertyEditor.displayName')}
                                </Label>
                            )}
                            {nameEditor && (
                                <OATTextFieldDisplayName
                                    value={nameText}
                                    model={data}
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
                {data['@type'] === OATUntargetedRelationshipName && (
                    <>
                        <div
                            className={
                                graphViewerStyles.untargetedNodeContainer
                            }
                        >
                            <Label>{data['@type']}</Label>
                        </div>
                    </>
                )}
            </div>
            {data['@type'] === OATInterfaceType && (
                <>
                    <TooltipHost
                        content={OATComponentHandleName}
                        id={`${OATComponentHandleName}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${getDisplayName(
                                data.displayName
                            )}${OATComponentHandleName}`
                        }}
                    >
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={OATComponentHandleName}
                            className={
                                currentHovered &&
                                currentHovered.id === data['@id']
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
                                    currentHovered.id === data['@id']
                                        ? graphViewerStyles.handleContentComponent
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconComponent}
                                id={`${getDisplayName(
                                    data.displayName
                                )}${OATComponentHandleName}`}
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
                            target: `#${getDisplayName(
                                data.displayName
                            )}${OATRelationshipHandleName}`
                        }}
                    >
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={OATRelationshipHandleName}
                            className={
                                currentHovered &&
                                currentHovered.id === data['@id']
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
                                    currentHovered.id === data['@id']
                                        ? graphViewerStyles.handleContentRelationship
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconRelationship}
                                id={`${getDisplayName(
                                    data.displayName
                                )}${OATRelationshipHandleName}`}
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
                            target: `#${getDisplayName(
                                data.displayName
                            )}${OATUntargetedRelationshipName}`
                        }}
                    >
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={OATUntargetedRelationshipName}
                            className={
                                currentHovered &&
                                currentHovered.id === data['@id']
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
                                    currentHovered.id === data['@id']
                                        ? graphViewerStyles.handleContentRelationship
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconUntargeted}
                                id={`${getDisplayName(
                                    data.displayName
                                )}${OATUntargetedRelationshipName}`}
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
                            target: `#${getDisplayName(
                                data.displayName
                            )}${OATExtendHandleName}`
                        }}
                    >
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={OATExtendHandleName}
                            className={
                                currentHovered &&
                                currentHovered.id === data['@id']
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
                                    currentHovered.id === data['@id']
                                        ? graphViewerStyles.handleContentExtend
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconInheritance}
                                id={`${getDisplayName(
                                    data.displayName
                                )}${OATExtendHandleName}`}
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
