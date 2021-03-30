import { IADTModel, IADTTwin, IHierarchyNode } from '../Constants/Interfaces';

export class HierarchyNode implements IHierarchyNode {
    name: string;
    id: string;
    parentNode?: IHierarchyNode;
    nodeData: any;
    children?: Record<string, IHierarchyNode>;
    isCollapsed?: boolean;
    isSelected?: boolean;

    public static fromADTModels = (
        models: Array<IADTModel>
    ): Record<string, IHierarchyNode> | Record<string, never> => {
        return models
            ? models.reduce((p, c: IADTModel) => {
                  p[c.id] = {
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
        modelNode: IHierarchyNode
    ): Record<string, IHierarchyNode> | Record<string, never> => {
        return twins
            ? twins.reduce((p, c: IADTTwin) => {
                  p[c.$dtId] = {
                      name: c.$dtId,
                      id: c.$dtId,
                      parentNode: modelNode,
                      nodeData: c
                  } as IHierarchyNode;
                  return p;
              }, {})
            : {};
    };
}
