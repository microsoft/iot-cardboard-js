import { DTDLType } from '../../../Models/Classes/DTDL';
import { dtdlPropertyTypesEnum } from '../../../Models/Constants/Constants';

type PrimitiveValueTypes = boolean | string | number | Record<string, any>;
export interface PropertyTreeNode {
    children?: Array<PropertyTreeNode>;
    name: string;
    displayName: string;
    role: NodeRole;
    isSet?: boolean;
    schema?: dtdlPropertyTypesEnum;
    type?: DTDLType;
    isCollapsed?: boolean;
    readonly?: boolean;
    value?: PrimitiveValueTypes;
    complexPropertyData?: EnumPropertyData;
    parent?: PropertyTreeNode;
    path: string;
    isObjectChild?: boolean;
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
    onParentClick: (parent: PropertyTreeNode) => any;
    onNodeValueChange: (node: PropertyTreeNode, newValue: any) => any;
    onNodeValueUnset: (node: PropertyTreeNode) => any;
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
