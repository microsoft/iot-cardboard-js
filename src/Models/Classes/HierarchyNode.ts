import { IADTModel, IADTTwin, IHierarchyNode } from '../Constants/Interfaces';

export class HierarchyNode implements IHierarchyNode {
    name: string;
    id: string;
    parentId?: string;
    nodeData: any;
    children?: Record<string, IHierarchyNode>;
    isCollapsed?: boolean;

    public static fromADTModels = (
        models: Array<IADTModel>
    ): Record<string, IHierarchyNode> | Record<string, never> => {
        return models
            ? models.reduce((p, c: IADTModel) => {
                  p[c.displayName.en] = {
                      name: c.displayName.en,
                      id: c.id,
                      nodeData: c,
                      children: {},
                      isCollapsed: true
                  } as IHierarchyNode;
                  return p;
              }, {})
            : {};
    };

    public static fromADTTwins = (
        twins: Array<IADTTwin>,
        modelId: string
    ): Record<string, IHierarchyNode> | Record<string, never> => {
        return twins
            ? twins.reduce((p, c: IADTTwin) => {
                  p[c.$dtId] = {
                      name: c.$dtId,
                      id: c.$dtId,
                      parentId: modelId,
                      nodeData: c
                  } as IHierarchyNode;
                  return p;
              }, {})
            : {};
    };
}
