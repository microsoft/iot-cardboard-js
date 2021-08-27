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

    const undoAllChanges = () => {
        setPropertyTreeNodes(originalTree());
    };

    const onParentClick = (parent: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    parent
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
                    node
                );
                const originalNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    originalTree(),
                    node
                );
                targetNode.value = newValue;
                targetNode.isSet = true;
                if (originalNode.value !== targetNode.value) {
                    targetNode.edited = true;
                } else {
                    targetNode.edited = false;
                }
            })
        );
    };

    const onObjectAdd = (node: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    node
                );
                const originalNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    originalTree(),
                    node
                );
                targetNode.isSet = true;
                if (originalNode.isSet !== targetNode.isSet) {
                    targetNode.edited = true;
                } else {
                    targetNode.edited = false;
                }
            })
        );
    };

    const onNodeValueUnset = (node: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    draft,
                    node
                );
                const originalNode = PropertyInspectorModelRef.current.findPropertyTreeNodeRefRecursively(
                    originalTree(),
                    node
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
                    if (nodeToUnset.children) {
                        // Unsetting object should set all children values to default
                        nodeToUnset.children.forEach((child) => {
                            setNodeToDefaultValue(child, true);
                        });
                    }
                };

                setNodeToDefaultValue(targetNode);
                targetNode.isSet = false;

                if (originalNode.isSet !== targetNode.isSet) {
                    targetNode.edited = true;
                } else {
                    targetNode.edited = false;
                }
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
                    />
                    <PropertyTree
                        data={propertyTreeNodes}
                        onParentClick={(parent) => onParentClick(parent)}
                        onNodeValueChange={onNodeValueChange}
                        onNodeValueUnset={onNodeValueUnset}
                        onObjectAdd={onObjectAdd}
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
};

const StandalonePropertyInspectorCommandBar: React.FC<StandalonePropertyInspectorCommandBarProps> = ({
    setIsTreeCollapsed,
    onCommitChanges,
    undoAllChanges,
    commandBarTitle
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
                        onClick: () => undoAllChanges()
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
                        onClick: () => onCommitChanges()
                    }
                ]}
            />
        </div>
    );
};

export default StandalonePropertyInspector;
