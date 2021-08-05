import produce from 'immer';
import React, { useMemo, useRef, useState } from 'react';
import { DTwinPatch } from '../../Models/Constants/Interfaces';
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
                  props.model,
                  props.components
              )
            : PropertyInspectorUtilities.parseRelationshipIntoPropertyTree(
                  props.relationship
              );
    }, []);

    const [propertyTreeNodes, setPropertyTreeNodes] = useState<
        PropertyTreeNode[]
    >(originalTree);

    const originalTreeRef = useRef(originalTree);

    const [patchData, setPatchData] = useState<DTwinPatch[]>(null);

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
                PropertyInspectorUtilities.findPropertyTreeNodeRefRecursively(
                    draft,
                    node
                ).value = newValue;
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
                <button>Commit changes</button>
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
