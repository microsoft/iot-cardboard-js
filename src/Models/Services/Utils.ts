import { IADTModel, IADTwin, IHierarchyNode } from '../Constants/Interfaces';

export const createGUID = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const createHierarchyNodesFromADTModels = (data) => {
    return data
        ? data.reduce((p, c: IADTModel) => {
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

export const createHierarchyNodesFromADTwins = (data, modelId) => {
    return data
        ? data.reduce((p, c: IADTwin) => {
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
