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
import { AdtPatch, propertyInspectorPatchMode } from '../../Models/Constants';
import { CommandBar } from '@fluentui/react/lib/components/CommandBar/CommandBar';

/**
 *  StandalonePropertyInspector takes a Twin, target model, and expanded model array containing
 *  all base and component models, its parent component should handle the fetching and transformation
 *  of these objects
 */
const StandalonePropertyInspector: React.FC<StandalonePropertyInspectorProps> = (
    props
) => {
    const PropertyInspectorModelRef = useRef(
        new PropertyInspectorModel(
            (props.inputData as TwinParams)?.expandedModel
        )
    );

    // Reset property inspector when input data changes
    useEffect(() => {
        PropertyInspectorModelRef.current = new PropertyInspectorModel(
            (props.inputData as TwinParams)?.expandedModel
        );
        setPropertyTreeNodes(originalTree());
    }, [props.inputData]);

    const originalTree = useCallback(() => {
        return isTwin(props.inputData)
            ? PropertyInspectorModelRef.current.parseTwinIntoPropertyTree({
                  inherited: false,
                  path: '/',
                  rootModel: props.inputData.rootModel,
                  twin: props.inputData.twin
              })
            : PropertyInspectorModelRef.current.parseRelationshipIntoPropertyTree(
                  props.inputData.relationship,
                  props.inputData.relationshipModel
              );
    }, [props.inputData]);

    const [propertyTreeNodes, setPropertyTreeNodes] = useState<
        PropertyTreeNode[]
    >(originalTree());

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
                targetNode.isSet = true;
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

                const setNodeToDefaultValue = (
                    nodeToUnset: PropertyTreeNode
                ) => {
                    nodeToUnset.value = PropertyInspectorModelRef.current.getEmptyValueForNode(
                        nodeToUnset.schema
                    );
                    if (nodeToUnset.children) {
                        // Unsetting object should set all children values to default
                        nodeToUnset.children.forEach((child) => {
                            setNodeToDefaultValue(child);
                        });
                    }
                };

                setNodeToDefaultValue(targetNode);
                targetNode.isSet = false;
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
                patchMode: propertyInspectorPatchMode.twin,
                id: props.inputData.twin.$dtId,
                patches: patchData as Array<AdtPatch>
            });
        } else {
            props.onCommitChanges({
                patchMode: propertyInspectorPatchMode.relationship,
                id: props.inputData.relationship.$relationshipId,
                patches: patchData as Array<AdtPatch>,
                sourceTwinId: props.inputData.relationship.$sourceId
            });
        }
    };

    return (
        <div className="cb-standalone-property-inspector-container">
            <StandalonePropertyInspectorCommandBar
                setIsTreeCollapsed={setIsTreeCollapsed}
                onCommitChanges={onCommitChanges}
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
    );
};

type StandalonePropertyInspectorCommandBarProps = {
    setIsTreeCollapsed: (isCollapsed: boolean) => any;
    onCommitChanges: () => any;
};

const StandalonePropertyInspectorCommandBar: React.FC<StandalonePropertyInspectorCommandBarProps> = ({
    setIsTreeCollapsed,
    onCommitChanges
}) => {
    return (
        <div className="cb-standalone-property-inspector-header">
            <div className="cb-standalone-property-inspector-header-label">
                PROPERTIES
            </div>
            <CommandBar
                items={[]}
                farItems={[
                    {
                        key: 'expandTree',
                        text: 'Expand tree',
                        ariaLabel: 'Expand tree',
                        iconOnly: true,
                        iconProps: { iconName: 'ExploreContent' },
                        onClick: () => setIsTreeCollapsed(false)
                    },
                    {
                        key: 'collapseTree',
                        text: 'Collapse tree',
                        ariaLabel: 'Collapse tree',
                        iconOnly: true,
                        iconProps: { iconName: 'CollapseContent' },
                        onClick: () => setIsTreeCollapsed(true)
                    },
                    {
                        key: 'save',
                        text: 'Save',
                        ariaLabel: 'Save',
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
