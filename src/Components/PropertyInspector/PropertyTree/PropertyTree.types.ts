import { DTDLType } from '../../../Models/Classes/DTDL';
import { dtdlPropertyTypesEnum } from '../../../Models/Constants/Constants';

type PrimitiveValueTypes = boolean | string | number | Record<string, any>;
export interface PropertyTreeNode {
    name: string;
    displayName: string;
    role: NodeRole;
    isRemovable: boolean;
    schema: dtdlPropertyTypesEnum;
    type: DTDLType;
    value: PrimitiveValueTypes;
    path: string;
    isObjectChild: boolean;
    isInherited: boolean;
    writable: boolean;
    isSet: boolean;
    children?: Array<PropertyTreeNode>;
    isCollapsed?: boolean;
    complexPropertyData?: EnumPropertyData;
    unit?: string;
    edited?: boolean;
    isMetadata?: boolean;
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
    onObjectAdd: (node: PropertyTreeNode) => any;
    readonly?: boolean;
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
