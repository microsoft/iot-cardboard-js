import { TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useState } from 'react';
import { DTDLSchemaType, DTDLType } from '../../Models/Classes/DTDL';
import { dtdlPrimitiveTypesList } from '../../Models/Constants/Constants';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import { DTwin, DTwinUpdateEvent } from '../../Models/Constants/Interfaces';
import PropertyTree from './PropertyTree/PropertyTree';
import { NodeRole, PropertyTreeNode } from './PropertyTree/PropertyTree.types';
import './StandalonePropertyInspector.scss';

interface StandalonePropertyInspectorProps {
    twin: DTwin;
    model: DtdlInterface;
    onCommitChanges?: (patch: DTwinUpdateEvent) => any;
}

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

const parsePropertyIntoNode = (property): PropertyTreeNode => {
    if (
        typeof property.schema === 'string' &&
        dtdlPrimitiveTypesList.indexOf(property.schema) !== -1
    ) {
        return {
            name: property.name,
            role: NodeRole.leaf,
            schema: property.schema
        };
    } else if (typeof property.schema === 'object') {
        switch (property.schema['@type']) {
            case DTDLSchemaType.Object:
                return {
                    name: property.name,
                    role: NodeRole.parent,
                    schema: DTDLSchemaType.Object,
                    children: property.schema.fields.map((field) =>
                        parsePropertyIntoNode(field)
                    ),
                    isCollapsed: true
                };
            case DTDLSchemaType.Enum: // TODO add enum values to node
                return {
                    name: property.name,
                    role: NodeRole.leaf,
                    schema: DTDLSchemaType.Enum
                };
            case DTDLSchemaType.Map: // TODO figure out how maps work
                return {
                    name: property.name,
                    role: NodeRole.leaf,
                    schema: DTDLSchemaType.Map
                };
            case DTDLSchemaType.Array: // TODO support arrays in future
            default:
                return null;
        }
    } else {
        return null;
    }
};

const parseModelIntoPropertyTree = (
    twin: DTwin,
    model: DtdlInterface
): PropertyTreeNode[] => {
    const treeNodes: PropertyTreeNode[] = [];

    model.contents.forEach((item) => {
        const type = Array.isArray(item['@type'])
            ? item['@type'][0]
            : item['@type'];

        let node: PropertyTreeNode;

        switch (type) {
            case DTDLType.Property:
                node = parsePropertyIntoNode(item);
                break;
            case DTDLType.Component:
            case DTDLType.Telemetry:
            case DTDLType.Command:
            case DTDLType.Relationship:
                return null;
        }

        if (node) {
            treeNodes.push({
                ...node,
                isSet: item.name in twin
            });
        }
    });

    return treeNodes;
};

const StandalonePropertyInspector: React.FC<StandalonePropertyInspectorProps> = ({
    twin,
    model,
    onCommitChanges = () => null
}) => {
    const [propertyTreeNodes, setPropertyTreeNodes] = useState<
        PropertyTreeNode[]
    >(parseModelIntoPropertyTree(twin, model));

    const onParentClick = (parent: PropertyTreeNode) => {
        setPropertyTreeNodes(
            produce((draft: PropertyTreeNode[]) => {
                let targetNode;

                const findNodeToCollapseToggle = (
                    nodes: PropertyTreeNode[]
                ) => {
                    for (let i = 0; i < nodes.length; i++) {
                        const node = nodes[i];
                        if (node.name === parent.name) {
                            targetNode = node;
                            return;
                        } else if (node.children) {
                            findNodeToCollapseToggle(node.children);
                        }
                    }
                };

                findNodeToCollapseToggle(draft);

                targetNode
                    ? (targetNode.isCollapsed = !targetNode.isCollapsed)
                    : null;
            })
        );
    };

    return (
        <div className="cb-standalone-property-inspector-container">
            <h3 style={{ marginLeft: 20 }}>{twin['$dtId']}</h3>
            <PropertyTree
                data={propertyTreeNodes}
                onParentClick={(parent) => onParentClick(parent)}
            />
        </div>
    );
};

export default StandalonePropertyInspector;
