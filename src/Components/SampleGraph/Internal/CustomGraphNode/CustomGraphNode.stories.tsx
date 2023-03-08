import React from 'react';
import { createNodeFromReact } from '@antv/g6-react-node';
import Graphin from '@antv/graphin';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { IGraphData, ICustomNodeDefintion } from '../../GraphTypes.types';
import CustomGraphNode from './CustomGraphNode';
import { ICustomGraphNodeProps } from './CustomGraphNode.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/Graph/CustomGraphNode',
    component: CustomGraphNode,
    decorators: [getDefaultStoryDecorator<ICustomGraphNodeProps>(wrapperStyle)]
};

type StoryArgs = {
    nodeData: ICustomNodeDefintion;
};
type CustomGraphNodeStory = React.FC<StoryArgs>;

const CUSTOM_NODE_NAME = 'react-node';
const DEFAULT_NODE = {
    type: CUSTOM_NODE_NAME
};
Graphin.registerNode(CUSTOM_NODE_NAME, createNodeFromReact(CustomGraphNode));
const Template: CustomGraphNodeStory = (args) => {
    const data: IGraphData = {
        nodes: [args.nodeData],
        edges: []
    };
    return (
        <Graphin
            data={data}
            layout={{ type: 'preset' }}
            defaultNode={DEFAULT_NODE}
        />
    );
};

export const Base = Template.bind({});
Base.args = {
    nodeData: {
        id: 'test-id',
        data: {
            name: 'Test Node',
            id: 'dtmi:com:example:folder2:TestNode;1'
        }
    }
} as StoryArgs;
