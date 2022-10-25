import React, { useMemo, useState, useContext } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { Icon, ActionButton, Label, TooltipHost } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Handle, Position } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { IOATGraphCustomNodeProps } from '../../../Models/Constants/Interfaces';
import {
    getGraphViewerStyles,
    getGraphViewerIconStyles,
    getGraphViewerActionButtonStyles
} from '../OATGraphViewer.styles';
import {
    OAT_RELATIONSHIP_HANDLE_NAME,
    OAT_COMPONENT_HANDLE_NAME,
    OAT_EXTEND_HANDLE_NAME,
    OAT_UNTARGETED_RELATIONSHIP_NAME,
    OAT_INTERFACE_TYPE
} from '../../../Models/Constants/Constants';
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
import { updateModelId } from '../../../Models/Services/OatUtils';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';

const OATGraphCustomNode: React.FC<IOATGraphCustomNodeProps> = (props) => {
    const { id, data, isConnectable } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [
        isHovered,
        { setTrue: setIsHoveredTrue, setFalse: setIsHoveredFalse }
    ] = useBoolean(false);
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(getDisplayName(data.displayName));
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState(data['@id']);
    const [handleHoverRelationship, setHandleHoverRelationship] = useState(
        false
    );
    const [handleHoverComponent, setHandleHoverComponent] = useState(false);
    const [handleHoverExtend, setHandleHoverExtend] = useState(false);
    const [handleHoverUntargeted, setHandleHoverUntargeted] = useState(false);

    // data
    const isSelected = useMemo(
        () =>
            oatPageState.selection &&
            oatPageState.selection.modelId === id &&
            !oatPageState.selection.contentId,
        [id, oatPageState.selection]
    );

    const onNameClick = () => {
        if (!oatPageState.modified) {
            setNameText(getDisplayName(data.displayName));
            setNameEditor(true);
        }
    };

    const onIdClick = () => {
        if (!oatPageState.modified) {
            setIdEditor(true);
        }
    };

    const onDelete = () => {
        const deletion = () => {
            const dispatchDelete = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.DELETE_MODEL,
                    payload: { id: id }
                });
            };
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            oatPageDispatch({
                type: OatPageContextActionType.DELETE_MODEL_UNDO,
                payload: {
                    models: oatPageState.currentOntologyModels,
                    positions: oatPageState.currentOntologyModelPositions,
                    selection: oatPageState.selection
                }
            });
        };

        if (!oatPageState.modified) {
            execute(deletion, undoDeletion);
        }
    };

    const onDisplayNameCommit = (value: string) => {
        const update = () => {
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const model = modelsCopy.find((model) => model['@id'] === id);
            if (model) {
                model.displayName = value;
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS,
                    payload: { models: modelsCopy }
                });
            }
            setNameText(value);
            setNameEditor(false);
        };

        const undoUpdate = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(update, undoUpdate);
    };

    const onIdCommit = (value: string) => {
        const commit = () => {
            const {
                models: modelsCopy,
                positions: modelPositionsCopy
            } = updateModelId(
                id,
                value,
                oatPageState.currentOntologyModels,
                oatPageState.currentOntologyModelPositions
            );

            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS,
                payload: { positions: modelPositionsCopy }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: modelsCopy }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: { modelId: value } }
            });
        };

        const undoCommit = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS,
                payload: {
                    positions: oatPageState.currentOntologyModelPositions
                }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: oatPageState.selection }
            });
        };

        if (value) {
            execute(commit, undoCommit);
        }

        setIdText(value);
        setIdEditor(false);
    };

    // styles
    const graphViewerStyles = getGraphViewerStyles();
    const iconStyles = getGraphViewerIconStyles();
    const actionButtonStyles = getGraphViewerActionButtonStyles();

    return (
        <div
            onMouseEnter={setIsHoveredTrue}
            onFocus={setIsHoveredTrue}
            onMouseLeave={setIsHoveredFalse}
            onBlur={setIsHoveredFalse}
        >
            {data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME && (
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
                {data['@type'] !== OAT_UNTARGETED_RELATIONSHIP_NAME && (
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
                                    models={oatPageState.currentOntologyModels}
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
                {data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME && (
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
            {data['@type'] === OAT_INTERFACE_TYPE && (
                <>
                    <TooltipHost
                        content={OAT_COMPONENT_HANDLE_NAME}
                        id={`${OAT_COMPONENT_HANDLE_NAME}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${getDisplayName(
                                data.displayName
                            )}${OAT_COMPONENT_HANDLE_NAME}`
                        }}
                    >
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={OAT_COMPONENT_HANDLE_NAME}
                            className={
                                isHovered
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
                                    !handleHoverComponent && isHovered
                                        ? graphViewerStyles.handleContentComponent
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconComponent}
                                id={`${getDisplayName(
                                    data.displayName
                                )}${OAT_COMPONENT_HANDLE_NAME}`}
                                className={
                                    handleHoverComponent
                                        ? graphViewerStyles.handleContentIcon
                                        : graphViewerStyles.handleContentIconHidden
                                }
                            />
                        </Handle>
                    </TooltipHost>
                    <TooltipHost
                        content={OAT_RELATIONSHIP_HANDLE_NAME}
                        id={`${OAT_RELATIONSHIP_HANDLE_NAME}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${getDisplayName(
                                data.displayName
                            )}${OAT_RELATIONSHIP_HANDLE_NAME}`
                        }}
                    >
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={OAT_RELATIONSHIP_HANDLE_NAME}
                            className={
                                isHovered
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
                                    !handleHoverRelationship && isHovered
                                        ? graphViewerStyles.handleContentRelationship
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconRelationship}
                                id={`${getDisplayName(
                                    data.displayName
                                )}${OAT_RELATIONSHIP_HANDLE_NAME}`}
                                className={
                                    handleHoverRelationship
                                        ? graphViewerStyles.handleContentIcon
                                        : graphViewerStyles.handleContentIconHidden
                                }
                            />
                        </Handle>
                    </TooltipHost>
                    <TooltipHost
                        content={OAT_UNTARGETED_RELATIONSHIP_NAME}
                        id={`${OAT_UNTARGETED_RELATIONSHIP_NAME}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${getDisplayName(
                                data.displayName
                            )}${OAT_UNTARGETED_RELATIONSHIP_NAME}`
                        }}
                    >
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={OAT_UNTARGETED_RELATIONSHIP_NAME}
                            className={
                                isHovered
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
                                    !handleHoverUntargeted && isHovered
                                        ? graphViewerStyles.handleContentRelationship
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconUntargeted}
                                id={`${getDisplayName(
                                    data.displayName
                                )}${OAT_UNTARGETED_RELATIONSHIP_NAME}`}
                                className={
                                    handleHoverUntargeted
                                        ? graphViewerStyles.handleContentIcon
                                        : graphViewerStyles.handleContentIconHidden
                                }
                            />
                        </Handle>
                    </TooltipHost>
                    <TooltipHost
                        content={OAT_EXTEND_HANDLE_NAME}
                        id={`${OAT_EXTEND_HANDLE_NAME}ToolTip`}
                        calloutProps={{
                            gapSpace: 6,
                            target: `#${getDisplayName(
                                data.displayName
                            )}${OAT_EXTEND_HANDLE_NAME}`
                        }}
                    >
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={OAT_EXTEND_HANDLE_NAME}
                            className={
                                isHovered
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
                                    !handleHoverExtend && isHovered
                                        ? graphViewerStyles.handleContentExtend
                                        : graphViewerStyles.handleContentHidden
                                }
                            />

                            <Svg
                                src={IconInheritance}
                                id={`${getDisplayName(
                                    data.displayName
                                )}${OAT_EXTEND_HANDLE_NAME}`}
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
        </div>
    );
};

export default OATGraphCustomNode;
