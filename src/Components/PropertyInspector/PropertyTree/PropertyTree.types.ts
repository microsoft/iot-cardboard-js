import {
    EntityKinds,
    MapValueInfo
} from 'cleaningsuppliesareavailableforyouruse';

type PrimitiveValueTypes = boolean | string | number | Record<string, any>;
export interface PropertyTreeNode {
    name: string;
    displayName: string;
    role: NodeRole;
    isRemovable: boolean;
    schema: EntityKinds;
    type: EntityKinds;
    value: PrimitiveValueTypes;
    path: string;
    isMapChild: boolean;
    isSet: boolean;
    readonly?: boolean;
    parentObjectPath?: string;
    children?: Array<PropertyTreeNode>;
    isCollapsed?: boolean;
    complexPropertyData?: EnumPropertyData;
    unit?: string;
    edited?: boolean;
    isMetadata?: boolean;
    isFloating?: boolean;
    mapValueInfo?: MapValueInfo;
}

type EnumPropertyData = {
    options: Array<{
        name: string;
        displayName?: string;
        enumValue: string | number;
    }>;
};

export interface PropertyTreeProps {
    data: Array<PropertyTreeNode>;
    isTreeEdited: boolean;
    onParentClick: (parent: PropertyTreeNode) => any;
    onNodeValueChange: (node: PropertyTreeNode, newValue: any) => any;
    onNodeValueUnset: (node: PropertyTreeNode) => any;
    readonly?: boolean;
    onAddMapValue: (node: PropertyTreeNode, mapKey: string) => any;
    onRemoveMapValue: (node: PropertyTreeNode) => any;
}

export interface TreeProps {
    data: Array<PropertyTreeNode>;
    isChildTree?: boolean;
}

export interface NodeProps {
    node: PropertyTreeNode;
}

export enum NodeRole {
    parent,
    leaf
}
