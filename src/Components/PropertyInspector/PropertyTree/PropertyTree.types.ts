import { DTDLType } from '../../../Models/Classes/DTDL';
import { dtdlPropertyTypesEnum } from '../../../Models/Constants/Constants';
import { DTwinPatch } from '../../../Models/Constants/Interfaces';

type PrimitiveValueTypes = boolean | string | number;
export interface PropertyTreeNode {
    children?: Array<PropertyTreeNode>;
    name: string;
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
