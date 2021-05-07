import {
    IADTAdapter,
    IConsumeCompositeCardProps,
    IHierarchyNode
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBIMViewerCardProps
    extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    getHierarchyNodeProperties: (node: IHierarchyNode) => string[];
}
