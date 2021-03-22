import {
    IConsumeCompositeCardProps,
    IHierarchyNode
} from '../../../Models/Constants/Interfaces';

export interface HierarchyWithLKVProcessGraphicsCardProps
    extends IConsumeCompositeCardProps {
    getHierarchyNodeProperties: (node: IHierarchyNode) => string[];
    images: Record<
        string,
        { src: string; propertyPositions: Record<string, any> }
    >;
}
