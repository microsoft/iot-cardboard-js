export interface PropertyTreeNode {
    children?: Array<PropertyTreeNode>;
    name: string;
    role: NodeRole;
    isSet?: boolean;
    schema: string;
    isCollapsed?: boolean;
}

export interface PropertyTreeProps {
    data: Array<PropertyTreeNode>;
    onParentClick: (parent: PropertyTreeNode) => any;
}

export interface TreeProps {
    data: Array<PropertyTreeNode>;
}

export interface NodeProps {
    node: PropertyTreeNode;
}

export enum NodeRole {
    parent,
    leaf
}
