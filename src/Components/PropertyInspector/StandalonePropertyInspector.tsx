import produce from 'immer';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DTDLSchemaType, DTDLType } from '../../Models/Classes/DTDL';
import {
    dtdlPropertyTypesEnum,
    dtdlPrimitiveTypesList
} from '../../Models/Constants/Constants';
import {
    DtdlInterface,
    DtdlRelationship
} from '../../Models/Constants/dtdlInterfaces';
import { DTwin, DTwinPatch } from '../../Models/Constants/Interfaces';
import PropertyTree from './PropertyTree/PropertyTree';
import { NodeRole, PropertyTreeNode } from './PropertyTree/PropertyTree.types';
import './StandalonePropertyInspector.scss';
import {
    isTwin,
    RelationshipStandalonePropertyInspectorProps,
    TwinStandalonePropertyInspectorProps
} from './StandalonePropertyInspector.types';

// Build up patch array -- single source of truth for patches -- push to or update existing when user changes form fields
/*
        [
            {
                "op": "replace",
                "path": "/property1",
                "value": 1
            },
            {
                "op": "add",
                "path": "/property2/subProperty1",
                "value": 1
            },
            {
                "op": "remove",
                "path": "/property3"
            }
        ]
    */

const getTwinValueOrDefault = (property, twin) => {
    return twin[property.name] ?? undefined;
};

const parsePropertyIntoNode = (modelProperty, twin, path): PropertyTreeNode => {
    if (
        typeof modelProperty.schema === 'string' &&
        dtdlPrimitiveTypesList.indexOf(modelProperty.schema) !== -1
    ) {
        return {
            name: modelProperty.displayName ?? modelProperty.name,
            role: NodeRole.leaf,
            schema: modelProperty.schema,
            type: DTDLType.Property,
            value: getTwinValueOrDefault(modelProperty, twin),
            path: path + modelProperty.name
        };
    } else if (typeof modelProperty.schema === 'object') {
        switch (modelProperty.schema['@type']) {
            case DTDLSchemaType.Object:
                return {
                    name: modelProperty.displayName ?? modelProperty.name,
                    role: NodeRole.parent,
                    schema: dtdlPropertyTypesEnum.Object,
                    children: modelProperty.schema.fields.map((field) =>
                        parsePropertyIntoNode(
                            field,
                            twin,
                            `${path + modelProperty.name}/`
                        )
                    ),
                    isCollapsed: true,
                    type: DTDLType.Property,
                    path: path + modelProperty.name
                };
            case DTDLSchemaType.Enum: {
                // TODO add enum values to node
                return {
                    name: modelProperty.displayName ?? modelProperty.name,
                    role: NodeRole.leaf,
                    schema: dtdlPropertyTypesEnum.Enum,
                    type: DTDLType.Property,
                    value: getTwinValueOrDefault(modelProperty, twin),
                    complexPropertyData: {
                        options: modelProperty.schema.enumValues.map((ev) => ({
                            ...ev
                        }))
                    },
                    path: path + modelProperty.name
                };
            }
            case DTDLSchemaType.Map: // TODO figure out how maps work
                return {
                    name: modelProperty.displayName ?? modelProperty.name,
                    role: NodeRole.leaf,
                    schema: dtdlPropertyTypesEnum.Map,
                    type: DTDLType.Property,
                    path: path + modelProperty.name
                };
            case DTDLSchemaType.Array: // TODO support arrays in future
            default:
                return null;
        }
    } else {
        return null;
    }
};

const parseRelationshipIntoPropertyTree = (
    relationship: DtdlRelationship
): PropertyTreeNode[] => {
    const treeNodes: PropertyTreeNode[] = [];

    // Push readonly properties to tree
    Object.keys(relationship).forEach((key) => {
        if (key !== 'properties') {
            treeNodes.push({
                name: key,
                role: NodeRole.leaf,
                readonly: true,
                schema: dtdlPropertyTypesEnum.string,
                value: relationship[key] ?? undefined,
                path: `/${key}`
            });
        }
    });

    return treeNodes;
};

const parseTwinIntoPropertyTree = (
    twin: DTwin,
    model: DtdlInterface,
    components?: DtdlInterface[]
): PropertyTreeNode[] => {
    const treeNodes: PropertyTreeNode[] = [];

    model.contents.forEach((modelItem) => {
        const type = Array.isArray(modelItem['@type'])
            ? modelItem['@type'][0]
            : modelItem['@type'];

        let node: PropertyTreeNode;

        switch (type) {
            case DTDLType.Property:
                node = parsePropertyIntoNode(modelItem, twin, '/');
                break;
            case DTDLType.Component: {
                const componentInterface = components?.find(
                    (c) => c['@id'] === modelItem.schema
                );
                if (componentInterface) {
                    node = {
                        name: modelItem.name,
                        role: NodeRole.parent,
                        type: DTDLType.Component,
                        isCollapsed: true,
                        children: parseTwinIntoPropertyTree(
                            twin,
                            componentInterface,
                            components
                        ),
                        path: modelItem.name
                    };
                }
                break;
            }
            case DTDLType.Telemetry:
            case DTDLType.Command:
            case DTDLType.Relationship:
                return null;
        }

        if (node) {
            treeNodes.push({
                ...node,
                ...(node.type === DTDLType.Property && {
                    isSet: modelItem.name in twin
                })
            });
        }
    });

    return treeNodes;
};

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
            ? parseTwinIntoPropertyTree(
                  props.twin,
                  props.model,
                  props.components
              )
            : parseRelationshipIntoPropertyTree(props.relationship);
    }, []);

    const [propertyTreeNodes, setPropertyTreeNodes] = useState<
        PropertyTreeNode[]
    >(originalTree);

    const originalTreeRef = useRef(originalTree);

    const [patchData, setPatchData] = useState<DTwinPatch[]>(null);

    const findNodeRefRecursively = (
        nodes: PropertyTreeNode[],
        targetNode: PropertyTreeNode
    ) => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.name === targetNode.name) {
                return node;
            } else if (node.children) {
                const childNodeFound = findNodeRefRecursively(
                    node.children,
                    targetNode
                );
                if (childNodeFound) return childNodeFound;
            }
        }
        return null;
    };

    const onParentClick = (parent: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                const targetNode = findNodeRefRecursively(draft, parent);
                targetNode
                    ? (targetNode.isCollapsed = !targetNode.isCollapsed)
                    : null;
            })
        );
    };

    const onNodeValueChange = (node: PropertyTreeNode, newValue: any) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                findNodeRefRecursively(draft, node).value = newValue;
            })
        );
    };

    return (
        <div className="cb-standalone-property-inspector-container">
            <h3 style={{ marginLeft: 20 }}>
                {isTwin(props)
                    ? props.twin['$dtId']
                    : props.relationship['$relationshipId']}
            </h3>
            <PropertyTree
                data={propertyTreeNodes}
                onParentClick={(parent) => onParentClick(parent)}
                onNodeValueChange={onNodeValueChange}
            />
        </div>
    );
};

export default StandalonePropertyInspector;
