import {
    IADTAdapter,
    IHierarchyNode,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

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
