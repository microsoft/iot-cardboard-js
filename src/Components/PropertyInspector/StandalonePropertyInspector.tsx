import React, { useEffect, useMemo, useReducer } from 'react';
import PropertyTree from './PropertyTree/PropertyTree';
import { PropertyTreeNode } from './PropertyTree/PropertyTree.types';
import './StandalonePropertyInspector.scss';
import {
    isTwin,
    StandalonePropertyInspectorProps
} from './StandalonePropertyInspector.types';
import PropertyInspectorModel from './PropertyInspectoryModel';
import { ADTPatch, PropertyInspectorPatchMode } from '../../Models/Constants';
import { CommandBar, MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import StandalonePropertyInspectorReducer, {
    defaultStandalonePropertyInspectorState,
    spiActionType
} from './StandalonePropertyInspector.state';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import BaseComponent from '../BaseComponent/BaseComponent';
import {
    CommandBarButton,
    IButtonProps,
    mergeStyleSets
} from '@fluentui/react';

/**
 *  StandalonePropertyInspector takes full resolved model and twin or relationship data.
 *  This component constructs a property tree and generates a JSON delta patch on save.
 */
const StandalonePropertyInspector: React.FC<StandalonePropertyInspectorProps> = (
    props
) => {
    const { t, i18n } = useTranslation();

    const originalTree = useMemo(() => {
        return isTwin(props.inputData)
            ? PropertyInspectorModel.parseTwinIntoPropertyTree({
                  isInherited: false,
                  path: '',
                  rootModel: props.inputData.rootModel,
                  twin: props.inputData.twin,
                  expandedModels: props.inputData.expandedModels
              })
            : PropertyInspectorModel.parseRelationshipIntoPropertyTree(
                  props.inputData.relationship,
                  props.inputData.relationshipModel
              );
    }, [props.inputData, i18n.language]);

    const [state, dispatch] = useReducer(StandalonePropertyInspectorReducer, {
        ...defaultStandalonePropertyInspectorState,
        propertyTreeNodes: originalTree,
        originalPropertyTreeNodes: originalTree.map((el) =>
            Object.assign({}, el)
        )
    });

    // Reset property inspector when input data changes
    useEffect(() => {
        dispatch({
            type: spiActionType.SET_PROPERTY_TREE_NODES,
            nodes: originalTree
        });
    }, [props.inputData, i18n.language]);

    const undoAllChanges = () => {
        dispatch({
            type: spiActionType.SET_PROPERTY_TREE_NODES,
            nodes: originalTree
        });
        dispatch({
            type: spiActionType.RESET_EDIT_STATUS
        });
    };

    const onParentClick = (parentNode: PropertyTreeNode) => {
        dispatch({
            type: spiActionType.TOGGLE_PARENT_NODE_COLLAPSE_STATE,
            parentNode
        });
    };

    const onNodeValueChange = (node: PropertyTreeNode, newValue: any) => {
        dispatch({
            type: spiActionType.ON_NODE_VALUE_CHANGED,
            node,
            newValue
        });
    };

    const onAddMapValue = (mapNode: PropertyTreeNode, mapKey: string) => {
        dispatch({
            type: spiActionType.ON_ADD_MAP_VALUE,
            mapKey,
            mapNode
        });
    };

    const onRemoveMapValue = (mapChildToRemove: PropertyTreeNode) => {
        dispatch({
            type: spiActionType.ON_REMOVE_MAP_VALUE,
            mapChildToRemove
        });
    };
    const onRemoveArrayItem = (arrayItemToRemove: PropertyTreeNode) => {
        dispatch({
            type: spiActionType.ON_REMOVE_ARRAY_ITEM,
            arrayItemToRemove
        });
    };

    const onAddArrayItem = (arrayNode: PropertyTreeNode) => {
        dispatch({
            type: spiActionType.ON_ADD_ARRAY_ITEM,
            arrayNode
        });
    };
    const onClearArray = (arrayNode: PropertyTreeNode) => {
        dispatch({
            type: spiActionType.ON_CLEAR_ARRAY,
            arrayNode
        });
    };

    const onNodeValueUnset = (node: PropertyTreeNode) => {
        dispatch({
            type: spiActionType.ON_NODE_VALUE_UNSET,
            node
        });
    };

    const setIsTreeCollapsed = (isCollapsed: boolean) => {
        dispatch({
            type: spiActionType.SET_IS_TREE_COLLAPSED,
            isCollapsed
        });
    };

    const onCommitChanges = () => {
        let patchData;

        if (isTwin(props.inputData)) {
            patchData = PropertyInspectorModel.generatePatchData(
                props.inputData.twin,
                state.propertyTreeNodes as PropertyTreeNode[]
            );
            props.onCommitChanges({
                patchMode: PropertyInspectorPatchMode.twin,
                id: props.inputData.twin.$dtId,
                patches: patchData as Array<ADTPatch>
            });
        } else {
            patchData = PropertyInspectorModel.generatePatchData(
                props.inputData.relationship,
                state.propertyTreeNodes as PropertyTreeNode[],
                true
            );
            props.onCommitChanges({
                patchMode: PropertyInspectorPatchMode.relationship,
                id: props.inputData.relationship.$relationshipId,
                patches: patchData as Array<ADTPatch>,
                sourceTwinId: props.inputData.relationship.$sourceId
            });
        }
    };

    return (
        <BaseComponent
            locale={props.locale}
            localeStrings={props.localeStrings}
            theme={props.theme}
        >
            <div
                className={`cb-standalone-property-inspector-container ${
                    props.parentHandlesScroll ? ' cb-scroll-handled' : ''
                }`}
            >
                <StandalonePropertyInspectorCommandBar
                    setIsTreeCollapsed={setIsTreeCollapsed}
                    onCommitChanges={onCommitChanges}
                    undoAllChanges={undoAllChanges}
                    commandBarTitle={
                        isTwin(props.inputData)
                            ? t('propertyInspector.commandBarTitleTwin')
                            : t('propertyInspector.commandBarTitleRelationship')
                    }
                    customTitleSpan={props.customCommandBarTitleSpan}
                    editStatus={state.editStatus}
                    readonly={props.readonly}
                    onRefresh={props.onRefresh}
                />
                <div
                    className={`cb-property-inspector-scrollable-container ${
                        props.parentHandlesScroll ? ' cb-scroll-handled' : ''
                    }`}
                >
                    <PropertyInspectorMessaging
                        {...props}
                        nodes={state.propertyTreeNodes}
                    />
                    <PropertyTree
                        data={state.propertyTreeNodes as PropertyTreeNode[]}
                        onParentClick={(parent) => onParentClick(parent)}
                        onNodeValueChange={onNodeValueChange}
                        onNodeValueUnset={onNodeValueUnset}
                        onAddMapValue={onAddMapValue}
                        onRemoveMapValue={onRemoveMapValue}
                        onRemoveArrayItem={onRemoveArrayItem}
                        onAddArrayItem={onAddArrayItem}
                        onClearArray={onClearArray}
                        readonly={!!props.readonly}
                        isTreeEdited={Object.keys(state.editStatus).length > 0}
                        isWithDataHistory={props.isWithDataHistory}
                    />
                </div>
            </div>
        </BaseComponent>
    );
};

const PropertyInspectorMessaging: React.FC<
    StandalonePropertyInspectorProps & { nodes: PropertyTreeNode[] }
> = (props) => {
    const { t } = useTranslation();
    const showMissingModelsWarning =
        props.missingModelIds && props.missingModelIds.length > 0;
    const showUnmodelledPropertiesWarning = PropertyInspectorModel.getAreUnmodelledPropertiesPresent(
        props.nodes
    );

    if (!showMissingModelsWarning && !showUnmodelledPropertiesWarning)
        return null;

    return (
        <div className="cb-property-inspector-warning-container">
            {showMissingModelsWarning && (
                <div className="cb-property-inspector-warning-missing-models">
                    <MessageBar
                        messageBarType={MessageBarType.severeWarning}
                        isMultiline={false}
                        truncated={true}
                    >
                        {t('propertyInspector.modelNotFound', {
                            piMode: isTwin(props.inputData)
                                ? 'Twin'
                                : 'Relationship'
                        })}{' '}
                        <span className="cb-missing-model-id-list">
                            {props.missingModelIds.map((mmid, idx) => (
                                <span key={idx}>
                                    <i>{mmid}</i>
                                    {idx < props.missingModelIds.length - 1 &&
                                        ', '}
                                </span>
                            ))}
                        </span>
                    </MessageBar>
                </div>
            )}
            {showUnmodelledPropertiesWarning && (
                <div
                    className={`cb-property-inspector-warning-unmodelled-properties${
                        showMissingModelsWarning &&
                        showUnmodelledPropertiesWarning
                            ? ' cb-property-inspector-warning-spacing'
                            : ''
                    }`}
                >
                    <MessageBar
                        messageBarType={MessageBarType.severeWarning}
                        isMultiline={false}
                        truncated={true}
                    >
                        {t('propertyInspector.unmodelledPropertyWarning', {
                            piMode: isTwin(props.inputData)
                                ? 'Twin'
                                : 'Relationship'
                        })}
                    </MessageBar>
                </div>
            )}
        </div>
    );
};

type StandalonePropertyInspectorCommandBarProps = {
    setIsTreeCollapsed: (isCollapsed: boolean) => any;
    onCommitChanges: () => any;
    undoAllChanges: () => any;
    commandBarTitle: string;
    editStatus: Record<string, boolean>;
    readonly: boolean;
    customTitleSpan?: React.ReactNode;
    onRefresh?: () => any;
};

const PropertyInspectorCommandBarButton: React.FC<IButtonProps> = (props) => {
    const buttonStyles = mergeStyleSets(props.styles, {
        root: { background: 'transparent' }
    });

    return <CommandBarButton {...props} styles={buttonStyles} />;
};

const StandalonePropertyInspectorCommandBar: React.FC<StandalonePropertyInspectorCommandBarProps> = ({
    setIsTreeCollapsed,
    onCommitChanges,
    undoAllChanges,
    commandBarTitle,
    editStatus,
    readonly,
    customTitleSpan,
    onRefresh
}) => {
    const { t } = useTranslation();

    return (
        <div className="cb-standalone-property-inspector-header">
            <div
                className="cb-standalone-property-inspector-header-label"
                title={!customTitleSpan ? commandBarTitle : null}
            >
                {customTitleSpan ? customTitleSpan : commandBarTitle}
            </div>
            <CommandBar
                items={[]}
                styles={{
                    root: {
                        background: 'transparent',
                        paddingRight: 0,
                        paddingLeft: 8
                    }
                }}
                buttonAs={PropertyInspectorCommandBarButton}
                farItems={[
                    ...(!readonly
                        ? [
                              {
                                  key: 'undoAll',
                                  text: t(
                                      'propertyInspector.commandBar.undoAll'
                                  ),
                                  ariaLabel: t(
                                      'propertyInspector.commandBar.undoAll'
                                  ),
                                  iconOnly: true,
                                  iconProps: { iconName: 'Undo' },
                                  onClick: () => undoAllChanges(),
                                  disabled: Object.keys(editStatus).length === 0
                              }
                          ]
                        : []),
                    {
                        key: 'expandTree',
                        text: t('propertyInspector.commandBar.expandTree'),
                        ariaLabel: t('propertyInspector.commandBar.expandTree'),
                        iconOnly: true,
                        iconProps: { iconName: 'ExploreContent' },
                        onClick: () => setIsTreeCollapsed(false)
                    },
                    {
                        key: 'collapseTree',
                        text: t('propertyInspector.commandBar.collapseTree'),
                        ariaLabel: t(
                            'propertyInspector.commandBar.collapseTree'
                        ),
                        iconOnly: true,
                        iconProps: { iconName: 'CollapseContent' },
                        onClick: () => setIsTreeCollapsed(true)
                    },
                    ...(onRefresh
                        ? [
                              {
                                  key: 'refresh',
                                  text: t(
                                      'propertyInspector.commandBar.refresh'
                                  ),
                                  ariaLabel: t(
                                      'propertyInspector.commandBar.refresh'
                                  ),
                                  iconOnly: true,
                                  iconProps: { iconName: 'Refresh' },
                                  onClick: () => onRefresh()
                              }
                          ]
                        : []),
                    ...(!readonly
                        ? [
                              {
                                  key: 'save',
                                  text: t('propertyInspector.commandBar.save'),
                                  ariaLabel: t(
                                      'propertyInspector.commandBar.save'
                                  ),
                                  iconOnly: true,
                                  iconProps: { iconName: 'Save' },
                                  onClick: () => onCommitChanges(),
                                  disabled: Object.keys(editStatus).length === 0
                              }
                          ]
                        : [])
                ]}
            />
        </div>
    );
};

export default withErrorBoundary(StandalonePropertyInspector);
