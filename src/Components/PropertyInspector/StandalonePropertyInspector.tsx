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
                  props.inputData.relationship
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
                targetNode.value = newValue;
                targetNode.isSet = true;
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

    return (
        <div className="cb-standalone-property-inspector-container">
            <div className="cb-standalone-property-inspector-header">
                <h3 style={{ marginLeft: 20 }}>
                    {isTwin(props.inputData)
                        ? props.inputData.twin['$dtId']
                        : props.inputData.relationship['$relationshipId']}
                </h3>
                <button
                    onClick={() =>
                        PropertyInspectorModelRef.current.generatePatchData(
                            isTwin(props.inputData)
                                ? props.inputData.twin
                                : props.inputData.relationship,
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
