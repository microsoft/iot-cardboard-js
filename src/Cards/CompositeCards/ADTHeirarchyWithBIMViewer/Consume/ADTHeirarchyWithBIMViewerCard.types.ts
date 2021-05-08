import { ADTAdapter } from '../../../../Adapters';
import {
    IADTAdapter,
    IConsumeCompositeCardProps,
    IHierarchyNode
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBIMViewerCardProps
    extends IConsumeCompositeCardProps {
    adapter: ADTAdapter;
    bimTwinId: string;
    getHierarchyNodeProperties: (node: IHierarchyNode) => string[];
}
