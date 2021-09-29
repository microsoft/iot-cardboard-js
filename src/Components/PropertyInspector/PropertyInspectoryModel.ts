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
abstract class PropertyInspectorModel {
    /** Looks up property on Twin | Relationship or returns default value if unset */
    static getPropertyValueOrDefault = (
        propertyName: string,
        propertySourceObject: Record<string, any>,
        schema: dtdlPropertyTypesEnum
    ) => {
        if (
            [
                dtdlPropertyTypesEnum.integer,
                dtdlPropertyTypesEnum.float,
                dtdlPropertyTypesEnum.double,
                dtdlPropertyTypesEnum.long,
                dtdlPropertyTypesEnum
            ].includes(schema)
        ) {
            return propertySourceObject?.[propertyName]
                ? String(propertySourceObject[propertyName])
                : PropertyInspectorModel.getEmptyValueForNode(schema);
        } else {
            return (
                propertySourceObject?.[propertyName] ??
                PropertyInspectorModel.getEmptyValueForNode(schema)
            );
        }
    };

    /** Returns default value that matches input schema
     *  Note: numeric types return empty string to represent empty input box
     */
    static getEmptyValueForNode = (schema: dtdlPropertyTypesEnum) => {
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

    static buildPath = (path, newRoute) => {
        return `${path}/${newRoute}`;
    };

    /** Parses all primitive and complex DTDL property types into PropertyTreeNode.
     *  This method is called recursively for nested types. Values which have been set
     *  are attached to nodes.
     */
    static parsePropertyIntoNode = ({
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
                value: PropertyInspectorModel.getPropertyValueOrDefault(
                    mapInfo ? mapInfo.key : modelProperty.name,
                    propertySourceObject,
                    modelProperty.schema as dtdlPropertyTypesEnum
                ),
                path: mapInfo
                    ? PropertyInspectorModel.buildPath(path, mapInfo.key)
                    : PropertyInspectorModel.buildPath(
                          path,
                          modelProperty.name
                      ),
                parentObjectPath: isObjectChild && path,
                isMapChild,
                isRemovable: !isMapChild,
                isSet:
                    (propertySourceObject &&
                        modelProperty.name in propertySourceObject) ||
                    forceSet,
                isInherited,
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
                                PropertyInspectorModel.parsePropertyIntoNode({
                                    modelProperty: field,
                                    propertySourceObject: mapInfo
                                        ? propertySourceObject?.[mapInfo.key] ??
                                          {}
                                        : propertySourceObject?.[
                                              modelProperty.name
                                          ] ?? {},
                                    isInherited,
                                    path: mapInfo
                                        ? PropertyInspectorModel.buildPath(
                                              path,
                                              mapInfo.key
                                          )
                                        : PropertyInspectorModel.buildPath(
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
                            ? PropertyInspectorModel.buildPath(
                                  path,
                                  mapInfo.key
                              )
                            : PropertyInspectorModel.buildPath(
                                  path,
                                  modelProperty.name
                              ),
                        parentObjectPath: isObjectChild && path,
                        isMapChild,
                        isRemovable: !isMapChild,
                        isInherited,
                        isSet:
                            (propertySourceObject &&
                                modelProperty.name in propertySourceObject) ||
                            forceSet,
                        value: undefined,
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
                        value: PropertyInspectorModel.getPropertyValueOrDefault(
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
                            ? PropertyInspectorModel.buildPath(
                                  path,
                                  mapInfo.key
                              )
                            : PropertyInspectorModel.buildPath(
                                  path,
                                  modelProperty.name
                              ),
                        parentObjectPath: isObjectChild && path,
                        isMapChild,
                        isInherited,
                        isRemovable: !isMapChild,
                        isSet:
                            (propertySourceObject &&
                                modelProperty.name in propertySourceObject) ||
                            forceSet,
                        unit: getModelContentUnit(
                            modelProperty['@type'],
                            modelProperty
                        )
                    };
                }
                case DTDLSchemaType.Map: {
                    const mapValue = PropertyInspectorModel.getPropertyValueOrDefault(
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
                            ? PropertyInspectorModel.buildPath(
                                  path,
                                  mapInfo.key
                              )
                            : PropertyInspectorModel.buildPath(
                                  path,
                                  modelProperty.name
                              ),
                        parentObjectPath: isObjectChild && path,
                        isInherited,
                        isMapChild,
                        isRemovable: !isMapChild,
                        value: undefined,
                        isSet:
                            (propertySourceObject &&
                                modelProperty.name in propertySourceObject) ||
                            forceSet,
                        unit: getModelContentUnit(
                            modelProperty['@type'],
                            modelProperty
                        ),
                        mapDefinition: modelProperty,
                        children:
                            mapValue && Object.keys(mapValue).length > 0
                                ? Object.keys(mapValue).map((key) => {
                                      return PropertyInspectorModel.parsePropertyIntoNode(
                                          {
                                              isInherited,
                                              isObjectChild,
                                              modelProperty: (modelProperty.schema as any)
                                                  .mapValue,
                                              path: PropertyInspectorModel.buildPath(
                                                  path,
                                                  modelProperty.name
                                              ),
                                              propertySourceObject: mapValue,
                                              mapInfo: { key },
                                              isMapChild: true,
                                              forceSet: true
                                          }
                                      );
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
    static parseRelationshipIntoPropertyTree = (
        relationship: IADTRelationship,
        relationshipDefinition: DtdlRelationship
    ): PropertyTreeNode[] => {
        const modelledProperties = [];

        if (relationshipDefinition?.properties) {
            // Merge relationship model with active relationship properties
            relationshipDefinition.properties.forEach(
                (relationshipProperty) => {
                    const node = PropertyInspectorModel.parsePropertyIntoNode({
                        isInherited: false,
                        isObjectChild: false,
                        modelProperty: relationshipProperty,
                        path: '',
                        propertySourceObject: relationship,
                        isMapChild: false
                    });

                    modelledProperties.push(node);
                }
            );
        }

        // Flatten all modelled property names into array, this is used to check for floating twin properties
        const flatten = (arr: PropertyTreeNode[]) => {
            return arr.reduce(
                (flat: PropertyTreeNode[], toFlatten: PropertyTreeNode) => {
                    return flat.concat(
                        Array.isArray(toFlatten.children)
                            ? [toFlatten, ...flatten(toFlatten.children)]
                            : toFlatten
                    );
                },
                []
            );
        };

        const modelledPropertyNames = flatten([...modelledProperties]).map(
            (node) => node.name
        );

        const metaDataNodes = [];

        // Push readonly properties to tree
        Object.keys(relationship || {}).forEach((key) => {
            if (key.startsWith('$') || !modelledPropertyNames.includes(key)) {
                metaDataNodes.push(
                    PropertyInspectorModel.parseMetaDataIntoPropertyTreeNodes({
                        isFloating: !key.startsWith('$'),
                        isInherited: false,
                        isObjectChild: false,
                        path: '',
                        node: relationship?.[key],
                        key: key
                    })
                );
            }
        });

        return [
            ...metaDataNodes,
            ...modelledProperties.sort((a) => (a.isSet ? -1 : 1))
        ];
    };

    /** Parses DTDL Properties and Components into PropertyTreeNodes.
     *  Note: Telemetry, Commands, and Relationships are currently unupported */
    static parseModelContentsIntoNodes = ({
        contents,
        expandedModels,
        path,
        isInherited,
        twin
    }: {
        contents: DtdlInterfaceContent[];
        expandedModels: DtdlInterface[];
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
                    node = PropertyInspectorModel.parsePropertyIntoNode({
                        isInherited,
                        isObjectChild: false,
                        isMapChild: false,
                        propertySourceObject: twin,
                        modelProperty: modelItem,
                        path
                    });
                    break;
                case DTDLType.Component: {
                    if (expandedModels) {
                        const componentInterface = expandedModels?.find(
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
                                children: [
                                    ...(!twin?.[modelItem.name] // If component not populated on twin, must add $metadata empty object {}
                                        ? [
                                              {
                                                  displayName: '$metadata',
                                                  name: '$metadata',
                                                  path: PropertyInspectorModel.buildPath(
                                                      `path/${modelItem.name}`,
                                                      '$metadata'
                                                  ),
                                                  role: NodeRole.parent,
                                                  isSet: true,
                                                  readonly: true,
                                                  isCollapsed: true,
                                                  children: [],
                                                  schema:
                                                      dtdlPropertyTypesEnum.Object,
                                                  type: DTDLType.Property,
                                                  value: {},
                                                  parentObjectPath: path,
                                                  isMapChild: false,
                                                  isInherited,
                                                  isRemovable: false,
                                                  isMetadata: true
                                              }
                                          ]
                                        : []),
                                    ...PropertyInspectorModel.parseTwinIntoPropertyTree(
                                        {
                                            isInherited,
                                            expandedModels,
                                            path: PropertyInspectorModel.buildPath(
                                                path,
                                                modelItem.name
                                            ),
                                            rootModel: componentInterface,
                                            twin: twin?.[modelItem.name]
                                        }
                                    )
                                ],
                                path: PropertyInspectorModel.buildPath(
                                    path,
                                    modelItem.name
                                ),
                                isSet: true,
                                isInherited,
                                value: undefined,
                                isMapChild: false,
                                isRemovable: false,
                                readonly: true
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
                        isSet:
                            typeof twin === 'object' && modelItem.name in twin
                    })
                });
            }
        });

        return treeNodes;
    };

    static parseMetaDataIntoPropertyTreeNodes = ({
        node,
        key,
        path,
        isObjectChild,
        isInherited,
        isFloating = false
    }: {
        node: any;
        key: string;
        path: string;
        isObjectChild: boolean;
        isInherited: boolean;
        isFloating: boolean;
    }): PropertyTreeNode => {
        // Parse ADT metadata $ into nodes
        if (typeof node === 'object') {
            return {
                displayName: key,
                name: key,
                path: PropertyInspectorModel.buildPath(path, key),
                role: NodeRole.parent,
                isSet: !isFloating,
                readonly: true,
                isCollapsed: true,
                children: Object.keys(node).map((childKey) =>
                    PropertyInspectorModel.parseMetaDataIntoPropertyTreeNodes({
                        node: node[childKey],
                        key: childKey,
                        path: PropertyInspectorModel.buildPath(path, key),
                        isObjectChild: true,
                        isFloating,
                        isInherited
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
                path: PropertyInspectorModel.buildPath(path, key),
                role: NodeRole.leaf,
                readonly: true,
                isSet: !isFloating,
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

    /** Merges twin data returned by ADT API with the DTDL interfaces that the twin
     *  is an instance of. */
    static parseTwinIntoPropertyTree = ({
        twin,
        rootModel,
        expandedModels,
        path,
        isInherited
    }: {
        twin: DTwin;
        rootModel: DtdlInterface;
        expandedModels: DtdlInterface[];
        path: string;
        isInherited: boolean;
    }): PropertyTreeNode[] => {
        let treeNodes: PropertyTreeNode[] = [];

        // Parse root model
        let rootModelNodes: PropertyTreeNode[] = [];
        if (rootModel?.contents) {
            rootModelNodes = PropertyInspectorModel.parseModelContentsIntoNodes(
                {
                    contents: rootModel.contents,
                    expandedModels,
                    twin,
                    path,
                    isInherited
                }
            );
        }

        // Parse extended models
        const extendedModelNodes: PropertyTreeNode[] = [];

        const parseExtendedModels = (modelIds) => {
            // Check if base model extends any models
            let extendedModelIds = null;

            if (Array.isArray(modelIds)) {
                extendedModelIds = [...modelIds];
            } else if (typeof modelIds === 'string') {
                extendedModelIds = [modelIds];
            }

            if (extendedModelIds && expandedModels) {
                extendedModelIds.forEach((extendedModelId) => {
                    const extendedModel = Object.assign(
                        {},
                        expandedModels.find(
                            (model) => model['@id'] === extendedModelId
                        )
                    );

                    if (extendedModel) {
                        // recursively add deeply extended models
                        parseExtendedModels(extendedModel?.extends);

                        // parse model
                        extendedModelNodes.push(
                            ...PropertyInspectorModel.parseModelContentsIntoNodes(
                                {
                                    contents: extendedModel.contents,
                                    expandedModels,
                                    isInherited: true,
                                    path,
                                    twin
                                }
                            )
                        );
                    }
                });
            }
        };

        parseExtendedModels(rootModel?.extends);

        // Flatten all modelled property names into array, this is used to check for floating twin properties
        const flatten = (arr: PropertyTreeNode[]) => {
            return arr.reduce(
                (flat: PropertyTreeNode[], toFlatten: PropertyTreeNode) => {
                    return flat.concat(
                        Array.isArray(toFlatten.children)
                            ? [toFlatten, ...flatten(toFlatten.children)]
                            : toFlatten
                    );
                },
                []
            );
        };

        const modelledPropertyNames = flatten([
            ...rootModelNodes,
            ...extendedModelNodes
        ]).map((node) => node.name);

        // Parse meta data nodes
        let metaDataNodes = Object.keys(twin || {})
            .filter(
                (p) => p.startsWith('$') || !modelledPropertyNames.includes(p)
            )
            .map((metaDataKey) => {
                return PropertyInspectorModel.parseMetaDataIntoPropertyTreeNodes(
                    {
                        isObjectChild: false,
                        node: twin[metaDataKey],
                        key: metaDataKey,
                        path,
                        isFloating: !metaDataKey.startsWith('$'),
                        isInherited
                    }
                );
            });

        const idNode = metaDataNodes.find((n) => n.name === '$dtId');
        metaDataNodes = metaDataNodes.filter((n) => n.name !== '$dtId');

        const nodeAlphaSorter = (
            nodeA: PropertyTreeNode,
            nodeB: PropertyTreeNode
        ) => {
            const nodeAName = (
                nodeA?.displayName ?? nodeA.name
            ).toLocaleLowerCase();
            const nodeBName = (
                nodeB?.displayName ?? nodeB.name
            ).toLocaleLowerCase();
            if (nodeAName < nodeBName) {
                return -1;
            }
            if (nodeAName > nodeBName) {
                return 1;
            }
            return 0;
        };

        const setNodes = [...rootModelNodes, ...extendedModelNodes]
            .filter((n) => n.isSet)
            .sort(nodeAlphaSorter);
        const unsetNodes = [...rootModelNodes, ...extendedModelNodes]
            .filter((n) => !n.isSet)
            .sort(nodeAlphaSorter);

        treeNodes = [
            ...(idNode ? [idNode] : []),
            ...setNodes,
            ...unsetNodes,
            ...metaDataNodes
        ];
        return treeNodes;
    };

    /** Recursively searches all nodes in the property tree to find a target node */
    static findPropertyTreeNodeRefRecursively = (
        nodes: PropertyTreeNode[],
        targetNodePath: string
    ): PropertyTreeNode => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.path === targetNodePath) {
                return node;
            } else if (node.children) {
                const childNodeFound = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    node.children,
                    targetNodePath
                );
                if (childNodeFound) return childNodeFound;
            }
        }
        return null;
    };

    /** Transforms property tree nodes into JSON, retaining values only*/
    static parseDataFromPropertyTree = (
        tree: PropertyTreeNode[],
        newJson = {}
    ) => {
        tree.forEach((node) => {
            if (node.isSet) {
                if (node.children) {
                    newJson[node.name] = {};
                    newJson[
                        node.name
                    ] = PropertyInspectorModel.parseDataFromPropertyTree(
                        node.children,
                        newJson[node.name]
                    );
                } else {
                    let finalValue = node.value;

                    // Transform numeric values from strings to numbers
                    if (
                        [
                            dtdlPropertyTypesEnum.integer,
                            dtdlPropertyTypesEnum.float,
                            dtdlPropertyTypesEnum.double,
                            dtdlPropertyTypesEnum.long,
                            dtdlPropertyTypesEnum
                        ].includes(node.schema)
                    ) {
                        try {
                            finalValue = Number(node.value);
                        } catch (err) {
                            console.error(err);
                        }
                    }

                    newJson[node.name] = finalValue;
                }
            }
        });

        return newJson;
    };

    static flattenRelationshipPatch = (
        originalJsonInput,
        newJson,
        delta: Operation[]
    ) => {
        const originalJson = Object.assign({}, originalJsonInput);
        const originalJsonClone = Object.assign({}, originalJson);

        // Loop over each delta operation
        delta.forEach((op) => {
            // If nested path found
            if (op.path.match(new RegExp('/', 'g')).length > 1) {
                // Remove root of nested path from originalJson
                delete originalJson[op.path.split('/')[1]];
            }
        });

        // Recompute delta
        const newDelta = compare(originalJson, newJson);

        // Loop over each delta operation
        newDelta.map((op) => {
            // if any ADD path key already already exists on originalJsonClone, change to REPLACE
            if (op.path.split('/')[1] in originalJsonClone && op.op === 'add') {
                (op.op as any) = 'replace';
            }
        });

        return newDelta;
    };

    /** Generates JSON patch using delta between original json and updated property tree */
    static generatePatchData = (
        originalJson: any,
        newTree: PropertyTreeNode[],
        isRelationship = false
    ): Operation[] => {
        // Recurse through new PropertyTreeNode[] and build a simple JSON representation of the data tree
        const newJson = PropertyInspectorModel.parseDataFromPropertyTree(
            newTree
        );

        // Compare originalJson with the newly generated JSON using compare lib
        let delta = compare(originalJson, newJson);

        // TODO remove this block once relationship sub-property patching is supported
        // by ADT API.
        // --------------------------------------------------------
        if (isRelationship) {
            delta = PropertyInspectorModel.flattenRelationshipPatch(
                originalJson,
                newJson,
                delta
            );
        }
        // --------------------------------------------------------

        return delta;
    };
}

export default PropertyInspectorModel;
