import { DTDLType } from '../../../Models/Classes/DTDL';
import { DtdlProperty } from '../../../Models/Constants';
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
    isMapChild: boolean;
    isInherited: boolean;
    writable: boolean;
    isSet: boolean;
    parentObjectPath?: string;
    children?: Array<PropertyTreeNode>;
    isCollapsed?: boolean;
    complexPropertyData?: EnumPropertyData;
    unit?: string;
    edited?: boolean;
    isMetadata?: boolean;
    mapDefinition?: DtdlProperty;
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
    onAddObjectOrMap: (node: PropertyTreeNode) => any;
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
