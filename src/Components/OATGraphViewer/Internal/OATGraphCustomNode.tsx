import React, { useState, useContext } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    Label,
    TooltipHost,
    FocusZone,
    Text,
    IconButton
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { useBoolean } from '@fluentui/react-hooks';
import { Handle, Position } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import {
    getGraphViewerStyles,
    getGraphViewerActionButtonStyles
} from '../OATGraphViewer.styles';
import {
    OAT_RELATIONSHIP_HANDLE_NAME,
    OAT_COMPONENT_HANDLE_NAME,
    OAT_EXTEND_HANDLE_NAME,
    OAT_UNTARGETED_RELATIONSHIP_NAME,
    OAT_INTERFACE_TYPE
} from '../../../Models/Constants/Constants';
import { getDisplayName } from '../../OATPropertyEditor/Utils';
import IconRelationship from '../../../Resources/Static/relationshipTargeted.svg';
import IconUntargeted from '../../../Resources/Static/relationshipUntargeted.svg';
import IconInheritance from '../../../Resources/Static/relationshipInheritance.svg';
import IconComponent from '../../../Resources/Static/relationshipComponent.svg';
import Svg from 'react-inlinesvg';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { IOATGraphCustomNodeProps } from './OATGraphCustomNode.types';
import { parseModelId } from '../../../Models/Services/OatUtils';
import { useOatGraphContext } from '../../../Models/Context/OatGraphContext/OatGraphContext';
import { GRAPH_NODE_WIDTH } from '../OATGraphViewer';
import { useExtendedTheme } from '../../../Models/Hooks/useExtendedTheme';

const OATGraphCustomNode: React.FC<IOATGraphCustomNodeProps> = (props) => {
    const { id, data, isConnectable } = props;

    // hooks
    const { t } = useTranslation();
    const nameLabelId = useId('name-label');
    const idLabelId = useId('id-label');
    const componentTooltipTargetId = useId('component-anchor');
    const untargetedTooltipTargetId = useId('untargeted-anchor');
    const relationshipTooltipTargetId = useId('relationship-anchor');
    const extendTooltipTargetId = useId('extend-anchor');

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();
    const { oatGraphState } = useOatGraphContext();

    // state
    const [
        isHovered,
        { setTrue: setIsHoveredTrue, setFalse: setIsHoveredFalse }
    ] = useBoolean(false);
    const [handleHoverRelationship, setHandleHoverRelationship] = useState(
        false
    );
    const [
        handleHoverComponent,
        {
            setFalse: setHandleHoverComponentFalse,
            setTrue: setHandleHoverComponentTrue
        }
    ] = useBoolean(false);
    const [
        handleHoverExtend,
        {
            setFalse: setHandleHoverExtendFalse,
            setTrue: setHandleHoverExtendTrue
        }
    ] = useBoolean(false);
    const [
        handleHoverUntargeted,
        {
            setFalse: setHandleHoverUntargetedFalse,
            setTrue: setHandleHoverUntargetedTrue
        }
    ] = useBoolean(false);

    // data
    const isSelected =
        oatPageState.selection &&
        oatPageState.selection.modelId === id &&
        !oatPageState.selection.contentId;

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
                type: OatPageContextActionType.GENERAL_UNDO,
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

    // styles
    const graphViewerStyles = getGraphViewerStyles();
    const actionButtonStyles = getGraphViewerActionButtonStyles(
        useExtendedTheme()
    );

    return (
        <FocusZone style={{ cursor: 'pointer' }}>
            <div
                onMouseEnter={setIsHoveredTrue}
                onFocus={setIsHoveredTrue}
                onMouseLeave={setIsHoveredFalse}
                onBlur={setIsHoveredFalse}
                style={{ maxWidth: GRAPH_NODE_WIDTH }}
            >
                {data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME && (
                    <Handle
                        type="target"
                        position={Position.Top}
                        className={graphViewerStyles.handle}
                        isConnectable={isConnectable}
                    />
                )}
                {oatGraphState.isEdgeDragging && (
                    <div
                        data-targetid={id}
                        style={{
                            height: '100%',
                            width: '100%',
                            position: 'absolute',
                            zIndex: 10
                        }}
                    ></div>
                )}
                <div
                    className={
                        isSelected
                            ? graphViewerStyles.selectedNode
                            : graphViewerStyles.node
                    }
                >
                    {data['@type'] !== OAT_UNTARGETED_RELATIONSHIP_NAME ? (
                        <div className={graphViewerStyles.nodeContainer}>
                            <div className={graphViewerStyles.nodeRow}>
                                <Label
                                    id={nameLabelId}
                                    className={graphViewerStyles.nodeLabel}
                                >
                                    {t('OATGraphViewer.name')}:
                                </Label>
                                <Text
                                    className={graphViewerStyles.nodeNameValue}
                                    aria-labelledby={nameLabelId}
                                >
                                    {parseModelId(id)?.name ?? ''}
                                </Text>
                            </div>
                            <div className={graphViewerStyles.nodeRow}>
                                <Label
                                    id={idLabelId}
                                    className={graphViewerStyles.nodeLabel}
                                >
                                    {t('OATGraphViewer.id')}:
                                </Label>
                                <Text
                                    aria-labelledby={idLabelId}
                                    className={graphViewerStyles.nodeIdValue}
                                >
                                    {data['@id']}
                                </Text>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={
                                graphViewerStyles.untargetedNodeContainer
                            }
                        >
                            <Label>{data['@type']}</Label>
                        </div>
                    )}
                    <IconButton
                        styles={actionButtonStyles}
                        onClick={onDelete}
                        iconProps={{ iconName: 'Delete' }}
                    />
                </div>
                {data['@type'] === OAT_INTERFACE_TYPE && (
                    <>
                        <TooltipHost
                            content={OAT_COMPONENT_HANDLE_NAME}
                            id={`${OAT_COMPONENT_HANDLE_NAME}ToolTip`}
                            calloutProps={{
                                gapSpace: 6,
                                target: `#${componentTooltipTargetId}`
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
                                onMouseOver={setHandleHoverComponentTrue}
                                onMouseLeave={setHandleHoverComponentFalse}
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
                                    id={componentTooltipTargetId}
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
                                target: `#${relationshipTooltipTargetId}`
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
                                target: `#${untargetedTooltipTargetId}`
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
                                onMouseOver={setHandleHoverUntargetedTrue}
                                onMouseLeave={setHandleHoverUntargetedFalse}
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
                                target: `#${extendTooltipTargetId}`
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
                                onMouseOver={setHandleHoverExtendTrue}
                                onMouseLeave={setHandleHoverExtendFalse}
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
        </FocusZone>
    );
};

export default React.memo(OATGraphCustomNode, (prevProps, nextProps) => {
    const areEqual = prevProps.id === nextProps.id;
    console.log(areEqual);
    return areEqual;
});
