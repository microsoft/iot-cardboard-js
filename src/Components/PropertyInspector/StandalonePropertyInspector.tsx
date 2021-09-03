import produce from 'immer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropertyTree from './PropertyTree/PropertyTree';
import { PropertyTreeNode } from './PropertyTree/PropertyTree.types';
import './StandalonePropertyInspector.scss';
import {
    isTwin,
    StandalonePropertyInspectorProps,
    TwinParams
} from './StandalonePropertyInspector.types';
import PropertyInspectorModel from './PropertyInspectoryModel';
import {
    ADTPatch,
    dtdlPropertyTypesEnum,
    PropertyInspectorPatchMode,
    Theme
} from '../../Models/Constants';
import { CommandBar } from '@fluentui/react/lib/components/CommandBar/CommandBar';
import { useTranslation } from 'react-i18next';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import { ThemeProvider } from '../../Theming/ThemeProvider';
import i18n from '../../i18n';

/**
 *  StandalonePropertyInspector takes full resolved model and twin or relationship data.
 *  This component constructs a property tree and generates a JSON delta patch on save.
 */
const StandalonePropertyInspector: React.FC<StandalonePropertyInspectorProps> = (
    props
) => {
    const { t } = useTranslation();
    const PropertyInspectorModelRef = useRef(
        new PropertyInspectorModel(
            (props.inputData as TwinParams)?.expandedModels
        )
    );

    // Reset property inspector when input data changes
    useEffect(() => {
        PropertyInspectorModelRef.current = new PropertyInspectorModel(
            (props.inputData as TwinParams)?.expandedModels
        );
        setPropertyTreeNodes(originalTree());
    }, [props.inputData]);

    const originalTree = useCallback(() => {
        return isTwin(props.inputData)
            ? PropertyInspectorModelRef.current.parseTwinIntoPropertyTree({
                  isInherited: false,
                  path: '/',
                  rootModel: props.inputData.rootModel,
                  twin: props.inputData.twin
              })
            : PropertyInspectorModelRef.current.parseRelationshipIntoPropertyTree(
                  props.inputData.relationship,
                  props.inputData.relationshipDefinition
              );
    }, [props.inputData]);

    const [propertyTreeNodes, setPropertyTreeNodes] = useState<
        PropertyTreeNode[]
    >(originalTree());

    const [editStatus, setEditStatus] = useState<Record<string, boolean>>({});

    const undoAllChanges = () => {
        setPropertyTreeNodes(originalTree());
        setEditStatus({});
    };

    const setNodeEditedFlag = (
        originalNode: PropertyTreeNode,
        newNode: PropertyTreeNode
    ) => {
        if (
            (!originalNode && newNode) ||
            originalNode.value !== newNode.value ||
            originalNode.isSet !== newNode.isSet ||
            originalNode.children?.length !== newNode.children?.length
        ) {
            newNode.edited = true;
            setEditStatus(
                produce((draft) => {
                    draft[newNode.path] = true;
                })
            );
        } else {
            newNode.edited = false;
            setEditStatus(
                produce((draft) => {
                    delete draft[newNode.path];
                })
            );
        }
    };

    const onParentClick = (parent: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    parent.path
                );
                targetNode
                    ? (targetNode.isCollapsed = !targetNode.isCollapsed)
                    : null;
            })
        );
    };

    const onNodeValueChange = (node: PropertyTreeNode, newValue: any) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    node.path
                );
                const originalNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    originalTree(),
                    node.path
                );
                targetNode.value = newValue;
                targetNode.isSet = true;
                setNodeEditedFlag(originalNode, targetNode);
            })
        );
    };

    const onAddObjectOrMap = (node: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    node.path
                );
                const originalNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    originalTree(),
                    node.path
                );
                targetNode.isSet = true;
                setNodeEditedFlag(originalNode, targetNode);
            })
        );
    };

    const onAddMapValue = (mapNode: PropertyTreeNode, mapKey: string) => {
        // Construct empty tree node
        const newTreeNode = PropertyInspectorModelRef.current.parsePropertyIntoNode(
            {
                isInherited: mapNode.isInherited,
                isObjectChild: !!mapNode.parentObjectPath,
                path: mapNode.path + '/',
                mapInfo: { key: mapKey },
                propertySourceObject: {},
                modelProperty: (mapNode.mapDefinition.schema as any).mapValue,
                isMapChild: true,
                forceSet: true
            }
        );

        // Add new node to map and expand map node
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    mapNode.path
                );
                if (Array.isArray(targetNode.children)) {
                    targetNode.children = [...targetNode.children, newTreeNode];
                } else {
                    targetNode.children = [newTreeNode];
                }
                targetNode.isCollapsed = false;
                if (newTreeNode?.children) {
                    newTreeNode.isCollapsed = false;
                }
                setNodeEditedFlag(mapNode, targetNode);
            })
        );
    };

    const onRemoveMapValue = (node: PropertyTreeNode) => {
        // Add new node to map and expand map node
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const mapNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    node.path.slice(0, node.path.lastIndexOf('/'))
                );
                const originalNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    originalTree(),
                    node.path.slice(0, node.path.lastIndexOf('/'))
                );

                const childToRemoveIdx = mapNode.children.findIndex(
                    (el) => el.path === node.path
                );

                if (childToRemoveIdx !== -1) {
                    mapNode.children.splice(childToRemoveIdx, 1);
                }

                setNodeEditedFlag(originalNode, mapNode);
            })
        );
    };

    const onNodeValueUnset = (node: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    node.path
                );
                const originalNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    originalTree(),
                    node.path
                );

                const setNodeToDefaultValue = (
                    nodeToUnset: PropertyTreeNode,
                    isChildNode = false
                ) => {
                    if (isChildNode) {
                        nodeToUnset.edited = false;
                    }
                    nodeToUnset.value = PropertyInspectorModelRef.current.getEmptyValueForNode(
                        nodeToUnset.schema
                    );
                    nodeToUnset.isSet = false;
                    if (nodeToUnset.children) {
                        // Unsetting object should set all children values to default
                        nodeToUnset.children.forEach((child) => {
                            setNodeToDefaultValue(child, true);
                        });
                    }
                };

                setNodeToDefaultValue(targetNode);

                // On maps, clear map values
                if (targetNode.schema === dtdlPropertyTypesEnum.Map) {
                    targetNode.children = null;
                }
                targetNode.isSet = false;
                setNodeEditedFlag(originalNode, targetNode);
            })
        );
    };

    const setIsTreeCollapsed = (isCollapsed: boolean) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                PropertyInspectorModelRef.current.setIsTreeCollapsed(
                    draft,
                    isCollapsed
                );
            })
        );
    };

    const onCommitChanges = () => {
        const patchData = PropertyInspectorModelRef.current.generatePatchData(
            isTwin(props.inputData)
                ? props.inputData.twin
                : props.inputData.relationship,
            propertyTreeNodes
        );
        if (isTwin(props.inputData)) {
            props.onCommitChanges({
                patchMode: PropertyInspectorPatchMode.twin,
                id: props.inputData.twin.$dtId,
                patches: patchData as Array<ADTPatch>
            });
        } else {
            props.onCommitChanges({
                patchMode: PropertyInspectorPatchMode.relationship,
                id: props.inputData.relationship.$relationshipId,
                patches: patchData as Array<ADTPatch>,
                sourceTwinId: props.inputData.relationship.$sourceId
            });
        }
    };

    return (
        <I18nProviderWrapper
            locale={props.locale}
            localeStrings={props.localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={props.theme ?? Theme.Light}>
                <div className="cb-standalone-property-inspector-container">
                    <StandalonePropertyInspectorCommandBar
                        setIsTreeCollapsed={setIsTreeCollapsed}
                        onCommitChanges={onCommitChanges}
                        undoAllChanges={undoAllChanges}
                        commandBarTitle={
                            isTwin(props.inputData)
                                ? t('propertyInspector.commandBarTitleTwin')
                                : t(
                                      'propertyInspector.commandBarTitleRelationship'
                                  )
                        }
                        editStatus={editStatus}
                    />
                    <PropertyTree
                        data={propertyTreeNodes}
                        onParentClick={(parent) => onParentClick(parent)}
                        onNodeValueChange={onNodeValueChange}
                        onNodeValueUnset={onNodeValueUnset}
                        onAddMapValue={onAddMapValue}
                        onRemoveMapValue={onRemoveMapValue}
                        onAddObjectOrMap={onAddObjectOrMap}
                        readonly={!!props.readonly}
                    />
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

type StandalonePropertyInspectorCommandBarProps = {
    setIsTreeCollapsed: (isCollapsed: boolean) => any;
    onCommitChanges: () => any;
    undoAllChanges: () => any;
    commandBarTitle: string;
    editStatus: Record<string, boolean>;
};

const StandalonePropertyInspectorCommandBar: React.FC<StandalonePropertyInspectorCommandBarProps> = ({
    setIsTreeCollapsed,
    onCommitChanges,
    undoAllChanges,
    commandBarTitle,
    editStatus
}) => {
    const { t } = useTranslation();

    return (
        <div className="cb-standalone-property-inspector-header">
            <div className="cb-standalone-property-inspector-header-label">
                {commandBarTitle}
            </div>
            <CommandBar
                items={[]}
                farItems={[
                    {
                        key: 'undoAll',
                        text: t('propertyInspector.commandBar.undoAll'),
                        ariaLabel: t('propertyInspector.commandBar.undoAll'),
                        iconOnly: true,
                        iconProps: { iconName: 'Undo' },
                        onClick: () => undoAllChanges(),
                        disabled: Object.keys(editStatus).length === 0
                    },
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
                    {
                        key: 'save',
                        text: t('propertyInspector.commandBar.save'),
                        ariaLabel: t('propertyInspector.commandBar.save'),
                        iconOnly: true,
                        iconProps: { iconName: 'Save' },
                        onClick: () => onCommitChanges(),
                        disabled: Object.keys(editStatus).length === 0
                    }
                ]}
            />
        </div>
    );
};

export default StandalonePropertyInspector;
