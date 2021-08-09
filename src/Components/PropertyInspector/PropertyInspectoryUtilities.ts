import { DTDLSchemaType, DTDLType } from '../../Models/Classes/DTDL';
import {
    dtdlPropertyTypesEnum,
    dtdlPrimitiveTypesList
} from '../../Models/Constants/Constants';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlRelationship
} from '../../Models/Constants/dtdlInterfaces';
import { DTwin } from '../../Models/Constants/Interfaces';
import { NodeRole, PropertyTreeNode } from './PropertyTree/PropertyTree.types';
import { compare, Operation } from 'fast-json-patch';

abstract class PropertyInspectorUtilities {
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
                name: modelProperty.name,
                displayName: modelProperty.displayName ?? modelProperty.name,
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
                        name: modelProperty.name,
                        displayName:
                            modelProperty.displayName ?? modelProperty.name,
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
                        name: modelProperty.name,
                        displayName:
                            modelProperty.displayName ?? modelProperty.name,
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
                        name: modelProperty.name,
                        displayName:
                            modelProperty.displayName ?? modelProperty.name,
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
                    displayName: relationship[key]?.displayName ?? key,
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

    static parseModelContentsIntoNodes = (
        contents: DtdlInterfaceContent[],
        twin: DTwin,
        expandedModel: DtdlInterface[],
        path = '/'
    ): PropertyTreeNode[] => {
        const treeNodes: PropertyTreeNode[] = [];

        contents.forEach((modelItem) => {
            const type = Array.isArray(modelItem['@type'])
                ? modelItem['@type'][0]
                : modelItem['@type'];

            let node: PropertyTreeNode;

            switch (type) {
                case DTDLType.Property:
                    node = PropertyInspectorUtilities.parsePropertyIntoNode(
                        modelItem,
                        twin,
                        path
                    );
                    break;
                case DTDLType.Component: {
                    const componentInterface = expandedModel?.find(
                        (m) => m['@id'] === modelItem.schema
                    );
                    if (componentInterface) {
                        node = {
                            name: modelItem.name,
                            displayName:
                                modelItem?.displayName ?? modelItem.name,
                            role: NodeRole.parent,
                            type: DTDLType.Component,
                            isCollapsed: true,
                            children: PropertyInspectorUtilities.parseTwinIntoPropertyTree(
                                twin[modelItem.name],
                                expandedModel,
                                componentInterface,
                                `${path + modelItem.name}/`
                            ),
                            path: path + modelItem.name,
                            isSet: true
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

    static parseTwinIntoPropertyTree = (
        twin: DTwin,
        expandedModel: DtdlInterface[],
        rootModel: DtdlInterface,
        path = '/'
    ): PropertyTreeNode[] => {
        let treeNodes: PropertyTreeNode[] = [];

        const parseMetaDataIntoPropertyTreeNodes = (
            node: any,
            key: string,
            path: string
        ): PropertyTreeNode => {
            // Parse ADT metadata $ into nodes
            if (typeof node === 'object') {
                return {
                    displayName: key,
                    name: key,
                    path: path + key,
                    role: NodeRole.parent,
                    isSet: true,
                    readonly: true,
                    isCollapsed: true,
                    children: Object.keys(node).map((childKey) =>
                        parseMetaDataIntoPropertyTreeNodes(
                            node[childKey],
                            childKey,
                            `${path + key}/`
                        )
                    ),
                    schema: dtdlPropertyTypesEnum.Object
                };
            } else {
                return {
                    displayName: key,
                    name: key,
                    path: path + key,
                    role: NodeRole.leaf,
                    readonly: true,
                    isSet: true,
                    value: node,
                    schema: dtdlPropertyTypesEnum.string
                };
            }
        };

        // Parse meta data nodes
        const metaDataNodes = Object.keys(twin)
            .filter((p) => p.startsWith('$'))
            .map((metaDataKey) => {
                return parseMetaDataIntoPropertyTreeNodes(
                    twin[metaDataKey],
                    metaDataKey,
                    path
                );
            });

        // Parse root model
        const rootModelNodes = PropertyInspectorUtilities.parseModelContentsIntoNodes(
            rootModel.contents,
            twin,
            expandedModel,
            path
        );

        // Parse extended models
        const extendedModelNodes: PropertyTreeNode[] = [];

        let extendedModelIds = null;

        if (Array.isArray(rootModel.extends)) {
            extendedModelIds = [...rootModel.extends];
        } else if (typeof rootModel.extends === 'string') {
            extendedModelIds = [rootModel.extends];
        }
        if (extendedModelIds) {
            extendedModelIds.forEach((extendedModelId) => {
                const extendedModel = Object.assign(
                    {},
                    expandedModel.find(
                        (model) => model['@id'] === extendedModelId
                    )
                );

                if (extendedModel) {
                    extendedModelNodes.push(
                        ...PropertyInspectorUtilities.parseModelContentsIntoNodes(
                            extendedModel.contents,
                            twin,
                            expandedModel,
                            path
                        )
                    );
                }
            });
        }

        treeNodes = [
            ...rootModelNodes,
            ...extendedModelNodes,
            ...metaDataNodes
        ];
        return treeNodes;
    };

    static findPropertyTreeNodeRefRecursively = (
        nodes: PropertyTreeNode[],
        targetNode: PropertyTreeNode
    ): PropertyTreeNode => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.path === targetNode.path) {
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

    static verifyEveryChildHasValue = (tree: PropertyTreeNode[]) => {
        let everyChildHasValue = true;
        tree.forEach((node) => {
            if (!node.children && !node.value) everyChildHasValue = false;
            else if (node.children)
                everyChildHasValue = PropertyInspectorUtilities.verifyEveryChildHasValue(
                    node.children
                );
        });
        return everyChildHasValue;
    };

    static parseDataFromPropertyTree = (
        tree: PropertyTreeNode[],
        newJson = {}
    ) => {
        tree.forEach((node) => {
            if (
                node.children &&
                (node.isSet ||
                    PropertyInspectorUtilities.verifyEveryChildHasValue(
                        node.children
                    ))
            ) {
                newJson[node.name] = {};
                newJson[
                    node.name
                ] = PropertyInspectorUtilities.parseDataFromPropertyTree(
                    node.children,
                    newJson[node.name]
                );
            } else if (node.value !== undefined && node.isSet) {
                newJson[node.name] = node.value;
            }
        });

        return newJson;
    };

    static generatePatchData = (
        originalJson: any,
        newTree: PropertyTreeNode[]
    ): Operation[] => {
        // Recurse through new PropertyTreeNode[] and build a simple JSON representation of the data tree
        const newJson = PropertyInspectorUtilities.parseDataFromPropertyTree(
            newTree
        );
        // Compare originalJson with the newly generated JSON using compare lib
        const delta = compare(originalJson, newJson);
        console.log('New Json ---', newJson);
        console.log('Old Json ---', originalJson);
        console.log('Delta ---', delta);
        return delta;
    };
}

export default PropertyInspectorUtilities;
