import {
    IADTAdapter,
    IConsumeCompositeCardProps,
    IHierarchyNode
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBIMViewerCardProps
    extends IConsumeCompositeCardProps {
    adapter: IADTAdapter; // for now only ADT adapter
    getHierarchyNodeProperties: (node: IHierarchyNode) => string[];
}
