import {
    IADTAdapter,
    IConsumeCompositeCardProps,
    IHierarchyNode
} from '../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithLKVProcessGraphicsCardProps
    extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    pollingIntervalMillis: number;
    getHierarchyNodeProperties: (node: IHierarchyNode) => string[];
}
