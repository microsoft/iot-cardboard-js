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

/** Utility class for standalone property inspector.  This class is responsible for:
 *  - Merging set and modelled properties and constructing property tree nodes;
 *  - Finding nodes in the property tree
 *  - Comparing edited and original data to generate JSON patch delta
 *  - Various utitilies to do with PropertyInspector model
 */
class PropertyInspectorModel {
    expandedModels: DtdlInterface[];

    constructor(expandedModels?: DtdlInterface[]) {
        this.expandedModels = expandedModels;
    }

    /** Looks up property on Twin | Relationship or returns default value if unset */
    getPropertyValueOrDefault = (
        propertyName: string,
        propertySourceObject: Record<string, any>,
        schema: dtdlPropertyTypesEnum
    ) => {
        return (
            propertySourceObject?.[propertyName] ??
            this.getEmptyValueForNode(schema)
        );
    };

    /** Returns default value that matches input schema
     *  Note: numeric types return empty string to represent empty input box
     */
    getEmptyValueForNode = (schema: dtdlPropertyTypesEnum) => {
        switch (schema) {
            case dtdlPropertyTypesEnum.string:
                return '';
            case dtdlPropertyTypesEnum.Enum:
                return 'cb-property-tree-enum-unset';
            case dtdlPropertyTypesEnum.Map:
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

    buildPath = (path, newRoute) => {
        return `${path}/${newRoute}`;
    };

    /** Parses all primitive and complex DTDL property types into PropertyTreeNode.
     *  This method is called recursively for nested types. Values which have been set
     *  are attached to nodes.
     */
    parsePropertyIntoNode = ({
        isInherited,
        isObjectChild,
        isMapChild,
        modelProperty,
        path,
        propertySourceObject,
        mapInfo = null,
        forceSet = false
    }: {
        modelProperty: DtdlProperty;
        propertySourceObject: Record<string, any>;
        path: string;
        isObjectChild: boolean;
        isMapChild: boolean;
        isInherited: boolean;
        mapInfo?: { key: string };
        forceSet?: boolean;
    }): PropertyTreeNode => {
        if (
            typeof modelProperty.schema === 'string' &&
            dtdlPrimitiveTypesList.indexOf(modelProperty.schema) !== -1
        ) {
            return {
                name: mapInfo ? mapInfo.key : modelProperty.name,
                displayName: mapInfo
                    ? mapInfo.key
                    : modelProperty.displayName ?? modelProperty.name,
                role: NodeRole.leaf,
                schema: modelProperty.schema as dtdlPropertyTypesEnum,
                type: DTDLType.Property,
                value: this.getPropertyValueOrDefault(
                    mapInfo ? mapInfo.key : modelProperty.name,
                    propertySourceObject,
                    modelProperty.schema as dtdlPropertyTypesEnum
                ),
                path: mapInfo
                    ? this.buildPath(path, mapInfo.key)
                    : this.buildPath(path, modelProperty.name),
                parentObjectPath: isObjectChild && path,
                isMapChild,
                isRemovable: !isMapChild,
                isSet: modelProperty.name in propertySourceObject || forceSet,
                isInherited,
                writable: !!modelProperty?.writable || isObjectChild,
                unit: getModelContentUnit(modelProperty['@type'], modelProperty)
            };
        } else if (typeof modelProperty.schema === 'object') {
            switch (modelProperty.schema['@type']) {
                case DTDLSchemaType.Object:
                    return {
                        name: mapInfo ? mapInfo.key : modelProperty.name,
                        displayName: mapInfo
                            ? mapInfo.key
                            : modelProperty.displayName ?? modelProperty.name,
                        role: NodeRole.parent,
                        schema: dtdlPropertyTypesEnum.Object,
                        children:
                            modelProperty.schema?.fields?.map((field) =>
                                this.parsePropertyIntoNode({
                                    modelProperty: field,
                                    propertySourceObject: mapInfo
                                        ? propertySourceObject?.[mapInfo.key] ??
                                          {}
                                        : propertySourceObject?.[
                                              modelProperty.name
                                          ] ?? {},
                                    isInherited,
                                    path: mapInfo
                                        ? this.buildPath(path, mapInfo.key)
                                        : this.buildPath(
                                              path,
                                              modelProperty.name
                                          ),
                                    isObjectChild: true,
                                    isMapChild: false
                                })
                            ) ?? [],
                        isCollapsed: true,
                        type: DTDLType.Property,
                        path: mapInfo
                            ? this.buildPath(path, mapInfo.key)
                            : this.buildPath(path, modelProperty.name),
                        parentObjectPath: isObjectChild && path,
                        isMapChild,
                        isRemovable: !isMapChild,
                        isInherited,
                        isSet:
                            modelProperty.name in propertySourceObject ||
                            forceSet,
                        value: undefined,
                        writable: !!modelProperty?.writable,
                        unit: getModelContentUnit(
                            modelProperty['@type'],
                            modelProperty
                        )
                    };
                case DTDLSchemaType.Enum: {
                    return {
                        name: mapInfo ? mapInfo.key : modelProperty.name,
                        displayName: mapInfo
                            ? mapInfo.key
                            : modelProperty.displayName ?? modelProperty.name,
                        role: NodeRole.leaf,
                        schema: dtdlPropertyTypesEnum.Enum,
                        type: DTDLType.Property,
                        value: this.getPropertyValueOrDefault(
                            mapInfo ? mapInfo.key : modelProperty.name,
                            propertySourceObject,
                            dtdlPropertyTypesEnum.Enum
                        ),
                        complexPropertyData:
                            {
                                options: modelProperty.schema?.enumValues?.map(
                                    (ev) => ({
                                        ...ev
                                    })
                                )
                            } ?? null,
                        path: mapInfo
                            ? this.buildPath(path, mapInfo.key)
                            : this.buildPath(path, modelProperty.name),
                        parentObjectPath: isObjectChild && path,
                        isMapChild,
                        isInherited,
                        isRemovable: !isMapChild,
                        isSet:
                            modelProperty.name in propertySourceObject ||
                            forceSet,
                        writable: !!modelProperty?.writable,
                        unit: getModelContentUnit(
                            modelProperty['@type'],
                            modelProperty
                        )
                    };
                }
                case DTDLSchemaType.Map: {
                    const mapValue = this.getPropertyValueOrDefault(
                        mapInfo ? mapInfo.key : modelProperty.name,
                        propertySourceObject,
                        dtdlPropertyTypesEnum.Map
                    );

                    return {
                        name: mapInfo ? mapInfo.key : modelProperty.name,
                        displayName: mapInfo
                            ? mapInfo.key
                            : modelProperty.displayName ?? modelProperty.name,
                        role: NodeRole.parent,
                        schema: dtdlPropertyTypesEnum.Map,
                        isCollapsed: true,
                        type: DTDLType.Property,
                        path: mapInfo
                            ? this.buildPath(path, mapInfo.key)
                            : this.buildPath(path, modelProperty.name),
                        parentObjectPath: isObjectChild && path,
                        isInherited,
                        isMapChild,
                        isRemovable: !isMapChild,
                        value: undefined,
                        isSet:
                            modelProperty.name in propertySourceObject ||
                            forceSet,
                        writable: !!modelProperty?.writable,
                        unit: getModelContentUnit(
                            modelProperty['@type'],
                            modelProperty
                        ),
                        mapDefinition: modelProperty,
                        children:
                            mapValue && Object.keys(mapValue).length > 0
                                ? Object.keys(mapValue).map((key) => {
                                      return this.parsePropertyIntoNode({
                                          isInherited,
                                          isObjectChild,
                                          modelProperty: (modelProperty.schema as any)
                                              .mapValue,
                                          path: this.buildPath(
                                              path,
                                              modelProperty.name
                                          ),
                                          propertySourceObject: mapValue,
                                          mapInfo: { key },
                                          isMapChild: true,
                                          forceSet: true
                                      });
                                  })
                                : null
                    };
                }
                case DTDLSchemaType.Array: // TODO support arrays in future
                default:
                    return null;
            }
        } else {
            return null;
        }
    };

    /** Merges relationship data returned by ADT API with the DTDL relationship model. */
    parseRelationshipIntoPropertyTree = (
        relationship: IADTRelationship,
        relationshipDefinition: DtdlRelationship
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
                    isInherited: false,
                    isRemovable: false,
                    isSet: true,
                    isMetadata: true,
                    isMapChild: false
                });
            }
        });

        if (relationshipDefinition.properties) {
            // Merge relationship model with active relationship properties
            relationshipDefinition.properties.forEach(
                (relationshipProperty) => {
                    const node = this.parsePropertyIntoNode({
                        isInherited: false,
                        isObjectChild: false,
                        modelProperty: relationshipProperty,
                        path: '',
                        propertySourceObject: relationship,
                        isMapChild: false
                    });

                    treeNodes.push(node);
                }
            );
        }

        return treeNodes;
    };

    /** Parses DTDL Properties and Components into PropertyTreeNodes.
     *  Note: Telemetry, Commands, and Relationships are currently unupported */
    parseModelContentsIntoNodes = ({
        contents,
        path,
        isInherited,
        twin
    }: {
        contents: DtdlInterfaceContent[];
        twin: DTwin;
        path: string;
        isInherited: boolean;
    }): PropertyTreeNode[] => {
        const treeNodes: PropertyTreeNode[] = [];

        contents.forEach((modelItem) => {
            const type = getModelContentType(modelItem['@type']);
            let node: PropertyTreeNode;

            switch (type) {
                case DTDLType.Property:
                    node = this.parsePropertyIntoNode({
                        isInherited,
                        isObjectChild: false,
                        isMapChild: false,
                        propertySourceObject: twin,
                        modelProperty: modelItem,
                        path
                    });
                    break;
                case DTDLType.Component: {
                    if (this.expandedModels) {
                        const componentInterface = this.expandedModels?.find(
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
                                    isInherited,
                                    path: this.buildPath(path, modelItem.name),
                                    rootModel: componentInterface,
                                    twin: twin[modelItem.name]
                                }),
                                path: this.buildPath(path, modelItem.name),
                                isSet: true,
                                isInherited,
                                value: undefined,
                                isMapChild: false,
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

    /** Merges twin data returned by ADT API with the DTDL interfaces that the twin
     *  is an instance of. */
    parseTwinIntoPropertyTree = ({
        isInherited,
        path,
        rootModel,
        twin
    }: {
        twin: DTwin;
        rootModel: DtdlInterface;
        path: string;
        isInherited: boolean;
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
                    path: this.buildPath(path, key),
                    role: NodeRole.parent,
                    isSet: true,
                    writable: false,
                    isCollapsed: true,
                    children: Object.keys(node).map((childKey) =>
                        parseMetaDataIntoPropertyTreeNodes({
                            node: node[childKey],
                            key: childKey,
                            path: this.buildPath(path, key),
                            isObjectChild: true
                        })
                    ),
                    schema: dtdlPropertyTypesEnum.Object,
                    type: DTDLType.Property,
                    value: undefined,
                    parentObjectPath: isObjectChild && path,
                    isMapChild: false,
                    isInherited,
                    isRemovable: false,
                    isMetadata: true
                };
            } else {
                return {
                    displayName: key,
                    name: key,
                    path: this.buildPath(path, key),
                    role: NodeRole.leaf,
                    writable: false,
                    isSet: true,
                    value: node,
                    schema: dtdlPropertyTypesEnum.string,
                    type: DTDLType.Property,
                    parentObjectPath: isObjectChild && path,
                    isMapChild: false,
                    isInherited,
                    isRemovable: false,
                    isMetadata: true
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
            isInherited
        });

        // Parse extended models
        const extendedModelNodes: PropertyTreeNode[] = [];

        let extendedModelIds = null;

        if (Array.isArray(rootModel.extends)) {
            extendedModelIds = [...rootModel.extends];
        } else if (typeof rootModel.extends === 'string') {
            extendedModelIds = [rootModel.extends];
        }
        if (extendedModelIds && this.expandedModels) {
            extendedModelIds.forEach((extendedModelId) => {
                const extendedModel = Object.assign(
                    {},
                    this.expandedModels.find(
                        (model) => model['@id'] === extendedModelId
                    )
                );

                if (extendedModel) {
                    extendedModelNodes.push(
                        ...this.parseModelContentsIntoNodes({
                            contents: extendedModel.contents,
                            isInherited: true,
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

    /** Recursively searches all nodes in the property tree to find a target node */
    findPropertyTreeNodeRefRecursively = (
        nodes: PropertyTreeNode[],
        targetNodePath: string
    ): PropertyTreeNode => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.path === targetNodePath) {
                return node;
            } else if (node.children) {
                const childNodeFound = this.findPropertyTreeNodeRefRecursively(
                    node.children,
                    targetNodePath
                );
                if (childNodeFound) return childNodeFound;
            }
        }
        return null;
    };

    /** Toggles all parent nodes' collapsed state */
    setIsTreeCollapsed = (nodes: PropertyTreeNode[], isCollapsed: boolean) => {
        nodes.forEach((node) => {
            if (node.children) {
                // Exclude metadata properties from expanding
                if (!isCollapsed && !node.name.startsWith('$')) {
                    node.isCollapsed = isCollapsed;
                    this.setIsTreeCollapsed(node.children, isCollapsed);
                } else if (isCollapsed) {
                    node.isCollapsed = isCollapsed;
                    this.setIsTreeCollapsed(node.children, isCollapsed);
                }
            }
        });
    };

    /** Utility method for checking that all object children have values set */
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

    /** Transforms property tree nodes into JSON, retaining values only*/
    parseDataFromPropertyTree = (tree: PropertyTreeNode[], newJson = {}) => {
        tree.forEach((node) => {
            if (node.isSet) {
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

    /** Generates JSON patch using delta between original json and updated property tree */
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
