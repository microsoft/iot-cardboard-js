import {
    IADTAdapter,
    IHierarchyNode,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants';

export interface ADTHierarchyCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter; // for now only ADT
    onParentNodeClick?: (node: IHierarchyNode) => void;
    onChildNodeClick?: (
        parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => void;
    nodeFilter?: (
        nodes: Record<string, IHierarchyNode>
    ) => Record<string, IHierarchyNode>;
}

export interface ADTHierarchyCardConsumeState {
    hierarchyNodes: Record<string, IHierarchyNode>; // first level is models, second level is twins
    searchTerm: string;
    selectedTwin: { modelId: string; twinId: string };
}
