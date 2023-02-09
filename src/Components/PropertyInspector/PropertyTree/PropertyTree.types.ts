import { DTDLType } from '../../../Models/Classes/DTDL';
import { DtdlInterfaceSchema, DtdlProperty } from '../../../Models/Constants';
import { dtdlPropertyTypesEnum } from '../../../Models/Constants/Constants';
import { IDataHistoryExplorerModalControlProps } from '../../DataHistoryExplorerModal/DataHistoryExplorerModalControl/DataHistoryExplorerModalControl.types';

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
    isArrayItem: boolean;
    isInherited: boolean;
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
    mapDefinition?: DtdlProperty;
    mapSchemas?: DtdlInterfaceSchema[];
    childSchema?: string;
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
    onAddArrayItem: (node: PropertyTreeNode) => any;
    onRemoveArrayItem: (node: PropertyTreeNode) => any;
    onClearArray: (node: PropertyTreeNode) => any;
    dataHistoryControlProps?: IDataHistoryExplorerModalControlProps;
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
