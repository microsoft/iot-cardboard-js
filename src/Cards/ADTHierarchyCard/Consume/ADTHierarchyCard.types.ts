import {
    IADTAdapter,
    IHierarchyNode,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants';

export interface ADTHierarchyCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter; // for now only ADT
    onParentNodeClick?: (node: IHierarchyNode) => void;
    onChildNodeClick?: (parentId: string, node: IHierarchyNode) => void;
}
