import { DTDLType } from '../../../Models/Classes/DTDL';
import { dtdlPropertyTypesEnum } from '../../../Models/Constants/Constants';

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
