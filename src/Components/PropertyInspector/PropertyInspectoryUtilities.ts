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
import { NodeRole, PropertyTreeNode } from './PropertyTree/PropertyTree.types';

class PropertyInspectorUtilities {
    static getTwinValueOrDefault = (property, twin) => {
        return twin[property.name] ?? undefined;
    };

    static parsePropertyIntoNode = (
        modelProperty,
        twin,
        path
    ): PropertyTreeNode => {
        if (
            typeof modelProperty.schema === 'string' &&
            dtdlPrimitiveTypesList.indexOf(modelProperty.schema) !== -1
        ) {
            return {
                name: modelProperty.displayName ?? modelProperty.name,
                role: NodeRole.leaf,
                schema: modelProperty.schema,
                type: DTDLType.Property,
                value: PropertyInspectorUtilities.getTwinValueOrDefault(
                    modelProperty,
                    twin
                ),
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
                            PropertyInspectorUtilities.parsePropertyIntoNode(
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
                        value: PropertyInspectorUtilities.getTwinValueOrDefault(
                            modelProperty,
                            twin
                        ),
                        complexPropertyData: {
                            options: modelProperty.schema.enumValues.map(
                                (ev) => ({
                                    ...ev
                                })
                            )
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

    static parseRelationshipIntoPropertyTree = (
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

    static parseTwinIntoPropertyTree = (
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
                    node = PropertyInspectorUtilities.parsePropertyIntoNode(
                        modelItem,
                        twin,
                        '/'
                    );
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
                            children: PropertyInspectorUtilities.parseTwinIntoPropertyTree(
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

    static findPropertyTreeNodeRefRecursively = (
        nodes: PropertyTreeNode[],
        targetNode: PropertyTreeNode
    ) => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.name === targetNode.name) {
                return node;
            } else if (node.children) {
                const childNodeFound = PropertyInspectorUtilities.findPropertyTreeNodeRefRecursively(
                    node.children,
                    targetNode
                );
                if (childNodeFound) return childNodeFound;
            }
        }
        return null;
    };

    // generatePatchData = () => {};

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
}

export default PropertyInspectorUtilities;
