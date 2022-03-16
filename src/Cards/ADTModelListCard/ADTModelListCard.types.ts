import {
    IStandaloneConsumeCardProps,
    IADTAdapter,
    IHierarchyNode,
} from '../..';

export interface ADTModelListCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter;
    onModelClick?: (node: IHierarchyNode) => void;
    onNewModelClick?: () => void;
    selectedModelId?: string;
    newlyAddedModelIds?: Array<string>;
}

export interface ADTModelListCardConsumeState {
    nodes: Record<string, IHierarchyNode>;
    selectedModelId: string;
    searchTerm: string;
}
