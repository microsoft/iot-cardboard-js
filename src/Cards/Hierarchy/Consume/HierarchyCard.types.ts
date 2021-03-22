import {
    IADTAdapter,
    IHierarchyNode,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants';

export interface HierarchyCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter;
    onParentNodeClick?: (node: IHierarchyNode) => void;
    onChildNodeClick?: (parentId: string, node: IHierarchyNode) => void;
}
