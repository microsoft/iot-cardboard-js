import produce, { setAutoFreeze } from 'immer';
import { dtdlPropertyTypesEnum } from '../../Models/Constants/Constants';
import PropertyInspectorModel from './PropertyInspectoryModel';
import { PropertyTreeNode } from './PropertyTree/PropertyTree.types';
setAutoFreeze(false);

export enum spiActionType {
    SET_PROPERTY_TREE_NODES,
    RESET_EDIT_STATUS,
    TOGGLE_PARENT_NODE_COLLAPSE_STATE,
    ON_NODE_VALUE_CHANGED,
    ON_ADD_MAP_VALUE,
    ON_REMOVE_MAP_VALUE,
    ON_NODE_VALUE_UNSET,
    SET_IS_TREE_COLLAPSED
}

type Action =
    | {
          type: spiActionType.SET_PROPERTY_TREE_NODES;
          nodes: PropertyTreeNode[];
      }
    | {
          type: spiActionType.RESET_EDIT_STATUS;
      }
    | {
          type: spiActionType.TOGGLE_PARENT_NODE_COLLAPSE_STATE;
          parentNode: PropertyTreeNode;
      }
    | {
          type: spiActionType.ON_NODE_VALUE_CHANGED;
          node: PropertyTreeNode;
          newValue: any;
      }
    | {
          type: spiActionType.ON_ADD_MAP_VALUE;
          mapNode: PropertyTreeNode;
          mapKey: string;
      }
    | {
          type: spiActionType.ON_REMOVE_MAP_VALUE;
          mapChildToRemove: PropertyTreeNode;
      }
    | {
          type: spiActionType.ON_NODE_VALUE_UNSET;
          node: PropertyTreeNode;
      }
    | {
          type: spiActionType.SET_IS_TREE_COLLAPSED;
          isCollapsed: boolean;
      };

interface IStandalonePropertyInspectorState {
    propertyTreeNodes: PropertyTreeNode[];
    originalPropertyTreeNodes: PropertyTreeNode[];
    editStatus: Record<string, boolean>;
}

export const defaultStandalonePropertyInspectorState: IStandalonePropertyInspectorState = {
    propertyTreeNodes: [],
    originalPropertyTreeNodes: [],
    editStatus: {}
};

const StandalonePropertyInspectorReducer = produce(
    (draft: IStandalonePropertyInspectorState, action: Action) => {
        switch (action.type) {
            case spiActionType.SET_PROPERTY_TREE_NODES: {
                const { nodes } = action;
                draft.propertyTreeNodes = nodes;
                draft.originalPropertyTreeNodes = nodes.map((el) =>
                    Object.assign({}, el)
                );
                break;
            }
            case spiActionType.RESET_EDIT_STATUS:
                draft.editStatus = {};
                break;
            case spiActionType.TOGGLE_PARENT_NODE_COLLAPSE_STATE: {
                const { parentNode } = action;
                const targetNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    draft.propertyTreeNodes,
                    parentNode.path
                );
                targetNode
                    ? (targetNode.isCollapsed = !targetNode.isCollapsed)
                    : null;
                break;
            }
            case spiActionType.ON_NODE_VALUE_CHANGED: {
                const { newValue, node } = action;
                const targetNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    draft.propertyTreeNodes,
                    node.path
                );
                const originalNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    draft.originalPropertyTreeNodes,
                    node.path
                );
                targetNode.value = newValue;
                targetNode.isSet = true;
                setNodeEditedFlag(draft, originalNode, targetNode);

                if (targetNode.parentObjectPath) {
                    autoSetParentObjects(draft, targetNode.parentObjectPath);
                }
                break;
            }
            case spiActionType.ON_ADD_MAP_VALUE: {
                const { mapKey, mapNode } = action;

                // Construct empty tree node
                const newTreeNode = PropertyInspectorModel.parsePropertyIntoNode(
                    {
                        isInherited: mapNode.isInherited,
                        isObjectChild: !!mapNode.parentObjectPath,
                        path: mapNode.path,
                        mapInfo: { key: mapKey },
                        propertySourceObject: {},
                        modelProperty: (mapNode.mapDefinition.schema as any)
                            .mapValue,
                        isMapChild: true,
                        forceSet: true
                    }
                );

                newTreeNode.edited = true;

                // Add new node to map and expand map node
                const targetNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    draft.propertyTreeNodes,
                    mapNode.path
                );

                if (Array.isArray(targetNode.children)) {
                    targetNode.children = [...targetNode.children, newTreeNode];
                } else {
                    targetNode.children = [newTreeNode];
                }

                targetNode.isSet = true;
                targetNode.isCollapsed = false;

                if (newTreeNode?.children) {
                    newTreeNode.isCollapsed = false;
                }

                setNodeEditedFlag(draft, mapNode, targetNode);
                break;
            }
            case spiActionType.ON_REMOVE_MAP_VALUE: {
                const { mapChildToRemove } = action;

                const mapNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    draft.propertyTreeNodes,
                    mapChildToRemove.path.slice(
                        0,
                        mapChildToRemove.path.lastIndexOf('/')
                    )
                );

                const originalNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    draft.originalPropertyTreeNodes,
                    mapChildToRemove.path.slice(
                        0,
                        mapChildToRemove.path.lastIndexOf('/')
                    )
                );

                const childToRemoveIdx = mapNode.children.findIndex(
                    (el) => el.path === mapChildToRemove.path
                );

                if (childToRemoveIdx !== -1) {
                    mapNode.children.splice(childToRemoveIdx, 1);
                }

                // Remove all edit status flags for map children
                Object.keys(draft.editStatus).forEach((key) => {
                    if (key.startsWith(mapNode.path)) {
                        delete draft.editStatus[key];
                    }
                });

                setNodeEditedFlag(draft, originalNode, mapNode);

                break;
            }
            case spiActionType.ON_NODE_VALUE_UNSET: {
                const { node } = action;

                const targetNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    draft.propertyTreeNodes,
                    node.path
                );
                const originalNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                    draft.originalPropertyTreeNodes,
                    node.path
                );

                const setNodeToDefaultValue = (
                    nodeToUnset: PropertyTreeNode,
                    isChildNode = false
                ) => {
                    if (isChildNode) {
                        nodeToUnset.edited = false;
                    }
                    nodeToUnset.value = PropertyInspectorModel.getEmptyValueForNode(
                        nodeToUnset.schema
                    );
                    nodeToUnset.isSet = false;
                    if (nodeToUnset.children) {
                        // Unsetting object should set all children values to default
                        nodeToUnset.children.forEach((child) => {
                            setNodeToDefaultValue(child, true);
                        });
                    }
                };

                setNodeToDefaultValue(targetNode);

                // On maps, clear map values
                if (targetNode.schema === dtdlPropertyTypesEnum.Map) {
                    targetNode.children = null;
                }
                targetNode.isSet = false;

                setNodeEditedFlag(draft, originalNode, targetNode);
                break;
            }
            case spiActionType.SET_IS_TREE_COLLAPSED: {
                const { isCollapsed } = action;
                setIsTreeCollapsed(draft.propertyTreeNodes, isCollapsed);
                break;
            }
            default:
                return;
        }
    }
);

/**
 * Auto sets parent nodes, recursing upwards to topmost parent
 *
 * @remarks
 * This method is to be used as a utility method for the StandalonePropertyInspectorReducer.
 * The draft param should be the immer produce draft. Updates are made in place.
 *
 * @param draft - standalone property inspector state
 * @param parentPath - path of the parent node to flag as set
 */
const autoSetParentObjects = (
    draft: IStandalonePropertyInspectorState,
    parentPath: string
) => {
    const parentNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
        draft.propertyTreeNodes,
        parentPath
    );
    const originalNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
        draft.originalPropertyTreeNodes,
        parentPath
    );
    parentNode.isSet = true;

    setNodeEditedFlag(draft, originalNode, parentNode);
    if (parentNode.parentObjectPath) {
        autoSetParentObjects(draft, parentNode.parentObjectPath);
    }
};

/**
 * Flags a node as edited if updates have been made to the node, otherwise flags node as un-edited.
 * Also updates edit status state based on node paths.
 *
 * @remarks
 * This method is to be used as a utility method for the StandalonePropertyInspectorReducer.
 * The draft param should be the immer produce draft. Updates are made in place.
 *
 * @param draft - standalone property inspector state
 * @param originalNode - original tree node
 * @param newNode - updated tree node
 */
const setNodeEditedFlag = (
    draft: IStandalonePropertyInspectorState,
    originalNode: PropertyTreeNode,
    newNode: PropertyTreeNode
) => {
    const editPath = newNode.path;
    if (
        (!originalNode && newNode) ||
        originalNode.value !== newNode.value ||
        originalNode.isSet !== newNode.isSet ||
        originalNode.children?.length !== newNode.children?.length
    ) {
        newNode.edited = true;
        draft.editStatus[editPath] = true;
    } else {
        newNode.edited = false;
        delete draft.editStatus[editPath];
    }
};

/**
 * Toggles all parent nodes' collapsed state
 *
 * @remarks
 * This method is to be used as a utility method for the StandalonePropertyInspectorReducer.
 * The draftNodes param should be the the the immer produce draft. Updates are made in place.
 *
 * @param draftNodes - standalone property inspector nodes
 * @param isCollapsed - boolean indicating desired collapsed state
 */
const setIsTreeCollapsed = (
    draftNodes: PropertyTreeNode[],
    isCollapsed: boolean
) => {
    draftNodes.forEach((node) => {
        if (node.children) {
            // Exclude metadata properties from expanding
            if (!isCollapsed && !node.name.startsWith('$')) {
                node.isCollapsed = isCollapsed;
                setIsTreeCollapsed(node.children, isCollapsed);
            } else if (isCollapsed) {
                node.isCollapsed = isCollapsed;
                setIsTreeCollapsed(node.children, isCollapsed);
            }
        }
    });
};

export default StandalonePropertyInspectorReducer;
