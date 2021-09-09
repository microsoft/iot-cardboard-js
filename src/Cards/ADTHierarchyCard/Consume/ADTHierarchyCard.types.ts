import {
    IADTAdapter,
    IHierarchyNode,
    IStandaloneConsumeCardProps,
    TwinLookupStatus
} from '../../../Models/Constants';

export interface ADTHierarchyCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter;
    onParentNodeClick?: (node: IHierarchyNode) => void;
    onChildNodeClick?: (
        parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => void;
    nodeFilter?: (
        nodes: Record<string, IHierarchyNode>
    ) => Record<string, IHierarchyNode>;
    lookupTwinId?: string;
}

export interface ADTHierarchyCardConsumeState {
    hierarchyNodes: Record<string, IHierarchyNode>; // first level is models, second level is twins
    searchTerm: string;
    selectedTwin: { modelId: string; twinId: string };
    twinLookupStatus: TwinLookupStatus;
}
