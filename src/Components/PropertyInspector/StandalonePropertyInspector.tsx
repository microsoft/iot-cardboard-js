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

// TODO, support extended models

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
                  props.model,
                  '/',
                  props.components
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
            />
        </div>
    );
};

export default StandalonePropertyInspector;
