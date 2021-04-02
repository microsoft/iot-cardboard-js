import {
    IADTAdapter,
    IConsumeCompositeCardProps,
    IHierarchyNode
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithLKVProcessGraphicsCardProps
    extends IConsumeCompositeCardProps {
    adapter: IADTAdapter; // for now only ADT adapter
    pollingIntervalMillis: number;
    getHierarchyNodeProperties: (node: IHierarchyNode) => string[];
}
