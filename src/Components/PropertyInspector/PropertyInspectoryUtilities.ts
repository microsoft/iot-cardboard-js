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
    static getTwinValueOrDefault = (
        property,
        twin,
        schema: dtdlPropertyTypesEnum
    ) => {
        return (
            twin[property.name] ??
            PropertyInspectorUtilities.getEmptyValueForNode(schema)
        );
    };

    static getEmptyValueForNode = (schema: dtdlPropertyTypesEnum) => {
        switch (schema) {
            case dtdlPropertyTypesEnum.string:
                return '';
            case dtdlPropertyTypesEnum.Enum:
                return 'enum-unset';
            case dtdlPropertyTypesEnum.Map:
                return {};
            case dtdlPropertyTypesEnum.Object:
                return undefined;
            case dtdlPropertyTypesEnum.boolean:
                return false;
            case dtdlPropertyTypesEnum.date:
            case dtdlPropertyTypesEnum.dateTime:
            case dtdlPropertyTypesEnum.duration:
            case dtdlPropertyTypesEnum.time:
                return '';
            case dtdlPropertyTypesEnum.double:
            case dtdlPropertyTypesEnum.integer:
            case dtdlPropertyTypesEnum.long:
            case dtdlPropertyTypesEnum.float:
                return '';
            case dtdlPropertyTypesEnum.Array:
            default:
                return null;
        }
    };

    static parsePropertyIntoNode = (
        modelProperty,
        twin,
        path,
        isObjectChild = false,
        inherited = false
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
                    twin,
                    modelProperty.schema
                ),
                path: path + modelProperty.name,
                ...(isObjectChild && { isObjectChild: true }),
                inherited
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
                                twin[modelProperty.name],
                                `${path + modelProperty.name}/`,
                                true
                            )
                        ),
                        isCollapsed: true,
                        type: DTDLType.Property,
                        path: path + modelProperty.name,
                        ...(isObjectChild && { isObjectChild: true }),
                        inherited
                    };
                case DTDLSchemaType.Enum: {
                    return {
                        name: modelProperty.name,
                        displayName:
                            modelProperty.displayName ?? modelProperty.name,
                        role: NodeRole.leaf,
                        schema: dtdlPropertyTypesEnum.Enum,
                        type: DTDLType.Property,
                        value: PropertyInspectorUtilities.getTwinValueOrDefault(
                            modelProperty,
                            twin,
                            dtdlPropertyTypesEnum.Enum
                        ),
                        complexPropertyData: {
                            options: modelProperty.schema.enumValues.map(
                                (ev) => ({
                                    ...ev
                                })
                            )
                        },
                        path: path + modelProperty.name,
                        ...(isObjectChild && { isObjectChild: true }),
                        inherited
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
                        path: path + modelProperty.name,
                        ...(isObjectChild && { isObjectChild: true }),
                        inherited
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
        path = '/',
        inherited = false
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
                        path,
                        inherited
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
                            isSet: true,
                            inherited: true
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
                            path,
                            true
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
            if (node.children && (node.isSet || node.isObjectChild)) {
                newJson[node.name] = {};
                newJson[
                    node.name
                ] = PropertyInspectorUtilities.parseDataFromPropertyTree(
                    node.children,
                    newJson[node.name]
                );
            } else if (
                node.value !== undefined &&
                (node.isSet || node.isObjectChild)
            ) {
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
