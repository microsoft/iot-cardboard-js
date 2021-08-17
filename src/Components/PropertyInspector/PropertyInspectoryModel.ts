import { DTDLSchemaType, DTDLType } from '../../Models/Classes/DTDL';
import {
    dtdlPropertyTypesEnum,
    dtdlPrimitiveTypesList
} from '../../Models/Constants/Constants';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlProperty,
    DtdlRelationship
} from '../../Models/Constants/dtdlInterfaces';
import { DTwin, IADTRelationship } from '../../Models/Constants/Interfaces';
import { NodeRole, PropertyTreeNode } from './PropertyTree/PropertyTree.types';
import { compare, Operation } from 'fast-json-patch';
import {
    getModelContentUnit,
    getModelContentType
} from '../../Models/Services/Utils';

class PropertyInspectorModel {
    expandedModel: DtdlInterface[];

    constructor(expandedModel?: DtdlInterface[]) {
        this.expandedModel = expandedModel;
    }

    getPropertyValueOrDefault = (
        property: DtdlInterfaceContent,
        propertySourceObject: Record<string, any>,
        schema: dtdlPropertyTypesEnum
    ) => {
        return (
            propertySourceObject?.[property.name] ??
            this.getEmptyValueForNode(schema)
        );
    };

    getEmptyValueForNode = (schema: dtdlPropertyTypesEnum) => {
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

    parsePropertyIntoNode = ({
        inherited,
        isObjectChild,
        modelProperty,
        path,
        propertySourceObject
    }: {
        modelProperty: DtdlProperty;
        propertySourceObject: Record<string, any>;
        path: string;
        isObjectChild: boolean;
        inherited: boolean;
    }): PropertyTreeNode => {
        if (
            typeof modelProperty.schema === 'string' &&
            dtdlPrimitiveTypesList.indexOf(modelProperty.schema) !== -1
        ) {
            return {
                name: modelProperty.name,
                displayName: modelProperty.displayName ?? modelProperty.name,
                role: NodeRole.leaf,
                schema: modelProperty.schema as dtdlPropertyTypesEnum,
                type: DTDLType.Property,
                value: this.getPropertyValueOrDefault(
                    modelProperty,
                    propertySourceObject,
                    modelProperty.schema as dtdlPropertyTypesEnum
                ),
                path: path + modelProperty.name,
                isObjectChild,
                isRemovable: !isObjectChild && !!modelProperty.writable,
                isSet: modelProperty.name in propertySourceObject,
                inherited,
                writable: !!modelProperty?.writable || isObjectChild,
                unit: getModelContentUnit(modelProperty['@type'], modelProperty)
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
                            this.parsePropertyIntoNode({
                                modelProperty: field,
                                propertySourceObject:
                                    propertySourceObject?.[
                                        modelProperty.name
                                    ] ?? {},
                                inherited,
                                path: `${path + modelProperty.name}/`,
                                isObjectChild: true
                            })
                        ),
                        isCollapsed: true,
                        type: DTDLType.Property,
                        path: path + modelProperty.name,
                        isObjectChild,
                        isRemovable:
                            !isObjectChild && !!modelProperty?.writable,
                        inherited,
                        isSet: modelProperty.name in propertySourceObject,
                        value: undefined,
                        writable: !!modelProperty?.writable,
                        unit: getModelContentUnit(
                            modelProperty['@type'],
                            modelProperty
                        )
                    };
                case DTDLSchemaType.Enum: {
                    return {
                        name: modelProperty.name,
                        displayName:
                            modelProperty.displayName ?? modelProperty.name,
                        role: NodeRole.leaf,
                        schema: dtdlPropertyTypesEnum.Enum,
                        type: DTDLType.Property,
                        value: this.getPropertyValueOrDefault(
                            modelProperty,
                            propertySourceObject,
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
                        isObjectChild,
                        inherited,
                        isRemovable:
                            !isObjectChild && !!modelProperty?.writable,
                        isSet: modelProperty.name in propertySourceObject,
                        writable: !!modelProperty?.writable,
                        unit: getModelContentUnit(
                            modelProperty['@type'],
                            modelProperty
                        )
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
                        inherited,
                        isRemovable:
                            !isObjectChild && !!modelProperty?.writable,
                        value: undefined,
                        isSet: modelProperty.name in propertySourceObject,
                        writable: !!modelProperty?.writable,
                        unit: getModelContentUnit(
                            modelProperty['@type'],
                            modelProperty
                        )
                    };
                case DTDLSchemaType.Array: // TODO support arrays in future
                default:
                    return null;
            }
        } else {
            return null;
        }
    };

    parseRelationshipIntoPropertyTree = (
        relationship: IADTRelationship,
        relationshipModel: DtdlRelationship
    ): PropertyTreeNode[] => {
        const treeNodes: PropertyTreeNode[] = [];

        // Push readonly properties to tree
        Object.keys(relationship).forEach((key) => {
            if (key.startsWith('$')) {
                treeNodes.push({
                    name: key,
                    displayName: relationship[key]?.displayName ?? key,
                    role: NodeRole.leaf,
                    writable: false,
                    schema: dtdlPropertyTypesEnum.string,
                    value: relationship[key] ?? undefined,
                    path: `/${key}`,
                    type: DTDLType.Property,
                    isObjectChild: false,
                    inherited: false,
                    isRemovable: false,
                    isSet: true
                });
            }
        });

        if (relationshipModel.properties) {
            // Merge relationship model with active relationship properties
            relationshipModel.properties.forEach((relationshipProperty) => {
                const node = this.parsePropertyIntoNode({
                    inherited: false,
                    isObjectChild: false,
                    modelProperty: relationshipProperty,
                    path: '/',
                    propertySourceObject: relationship
                });

                treeNodes.push(node);
            });
        }

        return treeNodes;
    };

    parseModelContentsIntoNodes = ({
        contents,
        path,
        inherited,
        twin
    }: {
        contents: DtdlInterfaceContent[];
        twin: DTwin;
        path: string;
        inherited: boolean;
    }): PropertyTreeNode[] => {
        const treeNodes: PropertyTreeNode[] = [];

        contents.forEach((modelItem) => {
            const type = getModelContentType(modelItem['@type']);
            let node: PropertyTreeNode;

            switch (type) {
                case DTDLType.Property:
                    node = this.parsePropertyIntoNode({
                        inherited,
                        isObjectChild: false,
                        propertySourceObject: twin,
                        modelProperty: modelItem,
                        path
                    });
                    break;
                case DTDLType.Component: {
                    if (this.expandedModel) {
                        const componentInterface = this.expandedModel?.find(
                            (m) => m['@id'] === modelItem.schema
                        );

                        if (componentInterface) {
                            node = {
                                name: modelItem.name,
                                displayName:
                                    modelItem?.displayName ?? modelItem.name,
                                role: NodeRole.parent,
                                type: DTDLType.Component,
                                schema: undefined,
                                isCollapsed: true,
                                children: this.parseTwinIntoPropertyTree({
                                    inherited,
                                    path: `${path + modelItem.name}/`,
                                    rootModel: componentInterface,
                                    twin: twin[modelItem.name]
                                }),
                                path: path + modelItem.name,
                                isSet: true,
                                inherited,
                                value: undefined,
                                isObjectChild: false,
                                isRemovable: false,
                                writable: false
                            };
                        }
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

    parseTwinIntoPropertyTree = ({
        inherited,
        path,
        rootModel,
        twin
    }: {
        twin: DTwin;
        rootModel: DtdlInterface;
        path: string;
        inherited: boolean;
    }): PropertyTreeNode[] => {
        let treeNodes: PropertyTreeNode[] = [];

        const parseMetaDataIntoPropertyTreeNodes = ({
            node,
            key,
            path,
            isObjectChild
        }: {
            node: any;
            key: string;
            path: string;
            isObjectChild: boolean;
        }): PropertyTreeNode => {
            // Parse ADT metadata $ into nodes
            if (typeof node === 'object') {
                return {
                    displayName: key,
                    name: key,
                    path: path + key,
                    role: NodeRole.parent,
                    isSet: true,
                    writable: false,
                    isCollapsed: true,
                    children: Object.keys(node).map((childKey) =>
                        parseMetaDataIntoPropertyTreeNodes({
                            node: node[childKey],
                            key: childKey,
                            path: `${path + key}/`,
                            isObjectChild: true
                        })
                    ),
                    schema: dtdlPropertyTypesEnum.Object,
                    type: DTDLType.Property,
                    value: undefined,
                    isObjectChild,
                    inherited,
                    isRemovable: false
                };
            } else {
                return {
                    displayName: key,
                    name: key,
                    path: path + key,
                    role: NodeRole.leaf,
                    writable: false,
                    isSet: true,
                    value: node,
                    schema: dtdlPropertyTypesEnum.string,
                    type: DTDLType.Property,
                    isObjectChild,
                    inherited,
                    isRemovable: false
                };
            }
        };

        // Parse meta data nodes
        const metaDataNodes = Object.keys(twin)
            .filter((p) => p.startsWith('$'))
            .map((metaDataKey) => {
                return parseMetaDataIntoPropertyTreeNodes({
                    isObjectChild: false,
                    node: twin[metaDataKey],
                    key: metaDataKey,
                    path
                });
            });

        // Parse root model
        const rootModelNodes = this.parseModelContentsIntoNodes({
            contents: rootModel.contents,
            twin,
            path,
            inherited
        });

        // Parse extended models
        const extendedModelNodes: PropertyTreeNode[] = [];

        let extendedModelIds = null;

        if (Array.isArray(rootModel.extends)) {
            extendedModelIds = [...rootModel.extends];
        } else if (typeof rootModel.extends === 'string') {
            extendedModelIds = [rootModel.extends];
        }
        if (extendedModelIds && this.expandedModel) {
            extendedModelIds.forEach((extendedModelId) => {
                const extendedModel = Object.assign(
                    {},
                    this.expandedModel.find(
                        (model) => model['@id'] === extendedModelId
                    )
                );

                if (extendedModel) {
                    extendedModelNodes.push(
                        ...this.parseModelContentsIntoNodes({
                            contents: extendedModel.contents,
                            inherited: true,
                            path,
                            twin
                        })
                    );
                }
            });
        }

        treeNodes = [
            ...metaDataNodes,
            ...[...rootModelNodes, ...extendedModelNodes].sort((a) =>
                a.isSet ? -1 : 1
            )
        ];
        return treeNodes;
    };

    findPropertyTreeNodeRefRecursively = (
        nodes: PropertyTreeNode[],
        targetNode: PropertyTreeNode
    ): PropertyTreeNode => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.path === targetNode.path) {
                return node;
            } else if (node.children) {
                const childNodeFound = this.findPropertyTreeNodeRefRecursively(
                    node.children,
                    targetNode
                );
                if (childNodeFound) return childNodeFound;
            }
        }
        return null;
    };

    verifyEveryChildHasValue = (tree: PropertyTreeNode[]) => {
        let everyChildHasValue = true;
        tree.forEach((node) => {
            if (!node.children && !node.value) everyChildHasValue = false;
            else if (node.children)
                everyChildHasValue = this.verifyEveryChildHasValue(
                    node.children
                );
        });
        return everyChildHasValue;
    };

    parseDataFromPropertyTree = (tree: PropertyTreeNode[], newJson = {}) => {
        tree.forEach((node) => {
            if (node.isSet || node.isObjectChild) {
                if (node.children) {
                    newJson[node.name] = {};
                    newJson[node.name] = this.parseDataFromPropertyTree(
                        node.children,
                        newJson[node.name]
                    );
                } else {
                    newJson[node.name] = node.value;
                }
            }
        });

        return newJson;
    };

    generatePatchData = (
        originalJson: any,
        newTree: PropertyTreeNode[]
    ): Operation[] => {
        // Recurse through new PropertyTreeNode[] and build a simple JSON representation of the data tree
        const newJson = this.parseDataFromPropertyTree(newTree);
        // Compare originalJson with the newly generated JSON using compare lib
        const delta = compare(originalJson, newJson);
        return delta;
    };
}

export default PropertyInspectorModel;
