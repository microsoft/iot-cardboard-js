import { primitiveDtdlEntityKinds } from '../../Models/Constants/Constants';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import { DTwin, IADTRelationship } from '../../Models/Constants/Interfaces';
import { NodeRole, PropertyTreeNode } from './PropertyTree/PropertyTree.types';
import { compare, Operation } from 'fast-json-patch';
import {
    getModelContentUnit,
    parsePropertyTreeDisplayName
} from '../../Models/Services/Utils';
import {
    ModelParserFactory,
    ModelParsingOption,
    ModelDict,
    InterfaceInfo,
    EntityKind,
    PropertyInfo,
    ObjectInfo,
    EnumInfo,
    MapValueInfo,
    MapInfo,
    RelationshipInfo,
    ComponentInfo
} from 'azure-iot-parser-node';

/** Utility class for standalone property inspector.  This class is responsible for:
 *  - Merging set and modelled properties and constructing property tree nodes;
 *  - Finding nodes in the property tree
 *  - Comparing edited and original data to generate JSON patch delta
 *  - Various utitilies to do with PropertyInspector model
 */
abstract class PropertyInspectorModel {
    static parseDtdl = async (dtdlModels: DtdlInterface[]) => {
        const parser = ModelParserFactory.create(
            ModelParsingOption.PermitAnyTopLevelElement
        );
        const modelDict = await parser.parse(
            dtdlModels.map((m) => JSON.stringify(m))
        );
        return modelDict;
    };

    /** Looks up property on Twin | Relationship or returns default value if unset */
    static getPropertyValueOrDefault = (
        propertyName: string,
        propertySourceObject: Record<string, any>,
        schema: EntityKind
    ) => {
        if (
            [
                EntityKind.INTEGER,
                EntityKind.FLOAT,
                EntityKind.DOUBLE,
                EntityKind.LONG
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
    static getEmptyValueForNode = (schema: EntityKind) => {
        switch (schema) {
            case EntityKind.STRING:
                return '';
            case EntityKind.ENUM:
                return 'cb-property-tree-enum-unset';
            case EntityKind.MAP:
            case EntityKind.OBJECT:
                return undefined;
            case EntityKind.BOOLEAN:
                return false;
            case EntityKind.DATE:
            case EntityKind.DATETIME:
            case EntityKind.DURATION:
            case EntityKind.TIME:
                return '';
            case EntityKind.DOUBLE:
            case EntityKind.INTEGER:
            case EntityKind.LONG:
            case EntityKind.FLOAT:
                return '';
            case EntityKind.ARRAY:
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
        isObjectChild,
        isMapChild,
        modelProperty,
        path,
        propertySourceObject,
        mapInfo = null,
        forceSet = false
    }: {
        modelProperty: PropertyInfo | MapValueInfo;
        propertySourceObject: Record<string, any>;
        path: string;
        isObjectChild: boolean;
        isMapChild: boolean;
        mapInfo?: { key: string };
        forceSet?: boolean;
    }): PropertyTreeNode => {
        // Safety checks
        if (!modelProperty) return null;

        const getSchemaEntityKind = () => {
            return modelProperty.schema?.entityKind;
        };

        const getCommonProperties = () => {
            // Safely construct name and displayName
            let name = modelProperty.id;
            let displayName = modelProperty.id;
            if (mapInfo?.key) {
                name = mapInfo.key;
                displayName = mapInfo.key;
            } else if (modelProperty.name) {
                name = modelProperty.name;
                displayName = parsePropertyTreeDisplayName(
                    modelProperty?.displayName,
                    modelProperty.name
                );
            }
            return {
                name,
                displayName,
                schema: getSchemaEntityKind(),
                type: EntityKind.PROPERTY,
                path: mapInfo
                    ? PropertyInspectorModel.buildPath(path, mapInfo.key)
                    : PropertyInspectorModel.buildPath(
                          path,
                          modelProperty.name
                      ),
                ...(isObjectChild && { parentObjectPath: path }),
                isMapChild,
                isRemovable: !isMapChild,
                isSet:
                    (propertySourceObject &&
                        modelProperty.name in propertySourceObject) ||
                    forceSet,
                ...('dtmi:dtdl:property:unit;2' in
                    modelProperty.supplementalProperties && {
                    unit: getModelContentUnit(
                        modelProperty.supplementalProperties[
                            'dtmi:dtdl:property:unit;2'
                        ]
                    )
                })
            };
        };

        if (
            primitiveDtdlEntityKinds.includes(modelProperty.schema?.entityKind)
        ) {
            return {
                ...getCommonProperties(),
                role: NodeRole.leaf,
                value: PropertyInspectorModel.getPropertyValueOrDefault(
                    mapInfo ? mapInfo.key : modelProperty.name,
                    propertySourceObject,
                    getSchemaEntityKind()
                )
            };
        } else if (modelProperty.schema?.entityKind === EntityKind.OBJECT) {
            return {
                ...getCommonProperties(),
                role: NodeRole.parent,
                children:
                    (modelProperty.schema as ObjectInfo)?.fields?.map((field) =>
                        PropertyInspectorModel.parsePropertyIntoNode({
                            modelProperty: field,
                            propertySourceObject: mapInfo
                                ? propertySourceObject?.[mapInfo.key] ?? {}
                                : propertySourceObject?.[modelProperty.name] ??
                                  {},
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
                value: undefined
            };
        } else if (modelProperty.schema?.entityKind === EntityKind.ENUM) {
            return {
                ...getCommonProperties(),
                role: NodeRole.leaf,
                value: PropertyInspectorModel.getPropertyValueOrDefault(
                    mapInfo ? mapInfo.key : modelProperty.name,
                    propertySourceObject,
                    EntityKind.ENUM
                ),
                complexPropertyData:
                    {
                        options: (modelProperty.schema as EnumInfo).enumValues?.map(
                            (ev) => ({
                                name: ev.name,
                                enumValue: ev.enumValue,
                                ...(ev.displayName && {
                                    displayName: parsePropertyTreeDisplayName(
                                        ev.displayName,
                                        ev.name
                                    )
                                })
                            })
                        )
                    } ?? null
            };
        } else if (modelProperty.schema?.entityKind === EntityKind.MAP) {
            const mapValue = PropertyInspectorModel.getPropertyValueOrDefault(
                mapInfo ? mapInfo.key : modelProperty.name,
                propertySourceObject,
                EntityKind.MAP
            );

            return {
                ...getCommonProperties(),
                role: NodeRole.parent,
                isCollapsed: true,
                value: undefined,
                mapValueInfo: (modelProperty.schema as MapInfo)?.mapValue,
                children:
                    mapValue && Object.keys(mapValue).length > 0
                        ? Object.keys(mapValue).map((key) => {
                              return PropertyInspectorModel.parsePropertyIntoNode(
                                  {
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
    };

    /** Merges relationship data returned by ADT API with the DTDL relationship model. */
    static parseRelationshipIntoPropertyTree = (
        relationship: IADTRelationship,
        modelDict: ModelDict
    ): PropertyTreeNode[] => {
        const modelledProperties = [];

        if (relationship && modelDict) {
            // Find relationship definition
            let relationshipInfo: RelationshipInfo = null;
            for (const key of Object.keys(modelDict)) {
                const modelDictEntity = modelDict[key];
                if (
                    modelDictEntity.entityKind === EntityKind.RELATIONSHIP &&
                    (modelDictEntity as RelationshipInfo).name ===
                        relationship.$relationshipName
                ) {
                    relationshipInfo = modelDictEntity;
                    break;
                }
            }

            if (relationshipInfo?.properties) {
                // Merge relationship model with active relationship properties
                relationshipInfo.properties.forEach((relationshipProperty) => {
                    const node = PropertyInspectorModel.parsePropertyIntoNode({
                        isObjectChild: false,
                        modelProperty: relationshipProperty,
                        path: '',
                        propertySourceObject: relationship,
                        isMapChild: false
                    });

                    if (node) {
                        modelledProperties.push(node);
                    }
                });
            }
        }

        const modelledPropertyNames = PropertyInspectorModel.getModelledPropertyNames(
            modelledProperties
        );

        let metaDataNodes: PropertyTreeNode[] = [];

        // Push readonly properties to tree
        Object.keys(relationship || {}).forEach((key) => {
            if (key.startsWith('$') || !modelledPropertyNames.includes(key)) {
                metaDataNodes.push(
                    PropertyInspectorModel.parseMetaDataIntoPropertyTreeNodes({
                        isFloating: !key.startsWith('$'),
                        isObjectChild: false,
                        path: '',
                        node: relationship?.[key],
                        key: key
                    })
                );
            }
        });

        const setNodes = modelledProperties
            .filter((n) => n.isSet)
            .sort(PropertyInspectorModel.nodeAlphaSorter);
        const unsetNodes = modelledProperties
            .filter((n) => !n.isSet)
            .sort(PropertyInspectorModel.nodeAlphaSorter);

        const unmodelledNodes = metaDataNodes
            .filter((n) => n.isFloating)
            .sort(PropertyInspectorModel.nodeAlphaSorter);
        metaDataNodes = metaDataNodes.filter((n) => !n.isFloating);

        return [
            ...metaDataNodes,
            ...unmodelledNodes,
            ...setNodes,
            ...unsetNodes
        ];
    };

    /** Parses DTDL Properties and Components into PropertyTreeNodes.
     *  Note: Telemetry, Commands, and Relationships are currently unupported */
    static parseModelContentsIntoNodes = ({
        interfaceInfo,
        path,
        twin
    }: {
        interfaceInfo: InterfaceInfo;
        twin: DTwin;
        path: string;
    }): PropertyTreeNode[] => {
        const treeNodes: PropertyTreeNode[] = [];

        if (interfaceInfo?.contents) {
            for (const key of Object.keys(interfaceInfo.contents)) {
                const modelContentValue = interfaceInfo.contents[key];
                let node: PropertyTreeNode;

                switch (modelContentValue.entityKind) {
                    case EntityKind.PROPERTY:
                        node = PropertyInspectorModel.parsePropertyIntoNode({
                            isObjectChild: false,
                            isMapChild: false,
                            propertySourceObject: twin,
                            modelProperty: modelContentValue as PropertyInfo,
                            path
                        });
                        break;
                    case EntityKind.COMPONENT: {
                        node = {
                            name: modelContentValue.name,
                            displayName: parsePropertyTreeDisplayName(
                                modelContentValue.displayName,
                                modelContentValue.name
                            ),
                            role: NodeRole.parent,
                            type: EntityKind.COMPONENT,
                            schema: undefined,
                            isCollapsed: true,
                            children: [
                                ...(!twin?.[modelContentValue.name] // If component not populated on twin, must add $metadata empty object {}
                                    ? [
                                          {
                                              displayName: '$metadata',
                                              name: '$metadata',
                                              path: PropertyInspectorModel.buildPath(
                                                  `path/${modelContentValue.name}`,
                                                  '$metadata'
                                              ),
                                              role: NodeRole.parent,
                                              isSet: true,
                                              readonly: true,
                                              isCollapsed: true,
                                              children: [],
                                              schema: EntityKind.OBJECT,
                                              type: EntityKind.PROPERTY,
                                              value: {},
                                              parentObjectPath: path,
                                              isMapChild: false,
                                              isRemovable: false,
                                              isMetadata: true
                                          }
                                      ]
                                    : []),
                                ...PropertyInspectorModel.parseTwinIntoPropertyTree(
                                    {
                                        path: PropertyInspectorModel.buildPath(
                                            path,
                                            modelContentValue.name
                                        ),
                                        interfaceInfo: (modelContentValue as ComponentInfo)
                                            .schema,
                                        twin: twin?.[modelContentValue.name]
                                    }
                                )
                            ],
                            path: PropertyInspectorModel.buildPath(
                                path,
                                modelContentValue.name
                            ),
                            isSet: true,
                            value: undefined,
                            isMapChild: false,
                            isRemovable: false,
                            readonly: true
                        };
                        break;
                    }
                    default:
                        break;
                }
                if (node) {
                    treeNodes.push({
                        ...node,
                        ...(node.type === EntityKind.PROPERTY && {
                            isSet:
                                typeof twin === 'object' &&
                                modelContentValue.name in twin
                        })
                    });
                }
            }
        }

        return treeNodes;
    };

    static parseMetaDataIntoPropertyTreeNodes = ({
        node,
        key,
        path,
        isObjectChild,
        isFloating = false
    }: {
        node: any;
        key: string;
        path: string;
        isObjectChild: boolean;
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
                        isFloating
                    })
                ),
                schema: EntityKind.OBJECT,
                type: EntityKind.PROPERTY,
                value: undefined,
                parentObjectPath: isObjectChild && path,
                isMapChild: false,
                isRemovable: false,
                isMetadata: !isFloating,
                isFloating
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
                schema: EntityKind.STRING,
                type: EntityKind.PROPERTY,
                parentObjectPath: isObjectChild && path,
                isMapChild: false,
                isRemovable: false,
                isMetadata: !isFloating,
                isFloating
            };
        }
    };

    /** Merges twin data returned by ADT API with the DTDL interfaces that the twin
     *  is an instance of. */
    static parseTwinIntoPropertyTree = ({
        twin,
        path,
        interfaceInfo
    }: {
        twin: DTwin;
        path: string;
        interfaceInfo: InterfaceInfo;
    }): PropertyTreeNode[] => {
        let treeNodes: PropertyTreeNode[] = [];

        let modelledNodes: PropertyTreeNode[] = [];

        // Parse DTDL model into tree nodes
        if (interfaceInfo) {
            modelledNodes = PropertyInspectorModel.parseModelContentsIntoNodes({
                interfaceInfo: interfaceInfo,
                twin,
                path
            });
        }

        const modelledPropertyNames = PropertyInspectorModel.getModelledPropertyNames(
            modelledNodes
        );

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
                        isFloating: !metaDataKey.startsWith('$')
                    }
                );
            });

        const idNode = metaDataNodes.find((n) => n.name === '$dtId');
        metaDataNodes = metaDataNodes.filter((n) => n.name !== '$dtId');

        const setNodes = modelledNodes
            .filter((n) => n.isSet)
            .sort(PropertyInspectorModel.nodeAlphaSorter);
        const unsetNodes = modelledNodes
            .filter((n) => !n.isSet)
            .sort(PropertyInspectorModel.nodeAlphaSorter);

        const unmodelledNodes = metaDataNodes
            .filter((n) => n.isFloating)
            .sort(PropertyInspectorModel.nodeAlphaSorter);
        metaDataNodes = metaDataNodes.filter((n) => !n.isFloating);

        treeNodes = [
            ...(idNode ? [idNode] : []),
            ...unmodelledNodes,
            ...setNodes,
            ...unsetNodes,
            ...metaDataNodes
        ];
        return treeNodes;
    };

    /** Sorts property tree nodes alphabetically based on name */
    static nodeAlphaSorter = (
        nodeA: PropertyTreeNode,
        nodeB: PropertyTreeNode
    ) => {
        const nodeAName = (typeof nodeA?.displayName === 'string'
            ? nodeA.displayName
            : nodeA.name
        ).toLocaleLowerCase();
        const nodeBName = (typeof nodeB?.displayName === 'string'
            ? nodeB.displayName
            : nodeB.name
        ).toLocaleLowerCase();
        if (nodeAName < nodeBName) {
            return -1;
        }
        if (nodeAName > nodeBName) {
            return 1;
        }
        return 0;
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
                            EntityKind.INTEGER,
                            EntityKind.FLOAT,
                            EntityKind.DOUBLE,
                            EntityKind.LONG
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

    static getModelledPropertyNames = (tree: PropertyTreeNode[]) => {
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

        return flatten(tree).map((node) => node.name);
    };

    static getAreUnmodelledPropertiesPresent = (tree: PropertyTreeNode[]) => {
        let areUnmodelledPropertiesPresent = false;

        const searchForFloatingProperty = (tree: PropertyTreeNode[]) => {
            for (const node of tree) {
                if (node.isFloating) {
                    areUnmodelledPropertiesPresent = true;
                    return;
                }
                if (node.children) {
                    searchForFloatingProperty(node.children);
                }
            }
        };

        searchForFloatingProperty(tree);
        return areUnmodelledPropertiesPresent;
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
