import produce from 'immer';
import React, { useMemo, useState } from 'react';
import PropertyTree from './PropertyTree/PropertyTree';
import { PropertyTreeNode } from './PropertyTree/PropertyTree.types';
import './StandalonePropertyInspector.scss';
import {
    isTwin,
    RelationshipStandalonePropertyInspectorProps,
    TwinStandalonePropertyInspectorProps
} from './StandalonePropertyInspector.types';
import PropertyInspectorUtilities from './PropertyInspectoryUtilities';

/**
 *  StandalonePropertyInspector takes a resolved Twin, Model, and array of components, its parent component
 *  should handle the fetching and transformation of these objects
 */
const StandalonePropertyInspector: React.FC<
    | TwinStandalonePropertyInspectorProps
    | RelationshipStandalonePropertyInspectorProps
> = (props) => {
    const originalTree = useMemo(() => {
        return isTwin(props)
            ? PropertyInspectorUtilities.parseTwinIntoPropertyTree(
                  props.twin,
                  props.expandedModel,
                  props.rootModel,
                  '/'
              )
            : PropertyInspectorUtilities.parseRelationshipIntoPropertyTree(
                  props.relationship
              );
    }, []);

    const [propertyTreeNodes, setPropertyTreeNodes] = useState<
        PropertyTreeNode[]
    >(originalTree);

    const onParentClick = (parent: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorUtilities.findPropertyTreeNodeRefRecursively(
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
                const targetNode = PropertyInspectorUtilities.findPropertyTreeNodeRefRecursively(
                    draft,
                    node
                );
                targetNode.value = newValue;
                targetNode.isSet = true;
            })
        );
    };

    const onObjectAdd = (node: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = PropertyInspectorUtilities.findPropertyTreeNodeRefRecursively(
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
                const targetNode = PropertyInspectorUtilities.findPropertyTreeNodeRefRecursively(
                    draft,
                    node
                );

                const setNodeToDefaultValue = (
                    nodeToUnset: PropertyTreeNode
                ) => {
                    nodeToUnset.value = PropertyInspectorUtilities.getEmptyValueForNode(
                        nodeToUnset.schema
                    );
                    if (nodeToUnset.children) {
                        nodeToUnset.children.forEach((child) => {
                            setNodeToDefaultValue(child);
                        });
                    }
                };

                // Unsetting object should set all children values to default
                setNodeToDefaultValue(targetNode);
                targetNode.isSet = false;
            })
        );
    };

    return (
        <div className="cb-standalone-property-inspector-container">
            <div className="cb-standalone-property-inspector-header">
                <h3 style={{ marginLeft: 20 }}>
                    {isTwin(props)
                        ? props.twin['$dtId']
                        : props.relationship['$relationshipId']}
                </h3>
                <button
                    onClick={() =>
                        PropertyInspectorUtilities.generatePatchData(
                            isTwin(props) ? props.twin : props.relationship,
                            propertyTreeNodes
                        )
                    }
                >
                    Commit changes
                </button>
            </div>
            <PropertyTree
                data={propertyTreeNodes}
                onParentClick={(parent) => onParentClick(parent)}
                onNodeValueChange={onNodeValueChange}
                onNodeValueUnset={onNodeValueUnset}
                onObjectAdd={onObjectAdd}
            />
        </div>
    );
};

export default StandalonePropertyInspector;
