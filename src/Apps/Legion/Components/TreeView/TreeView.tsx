import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { Node, ITreeViewProps } from './TreeView.types';
import {
    Tree,
    TreeItem,
    TreeItemLayout
} from '@fluentui/react-components/unstable';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TreeView', debugLogging);

const TreeView: React.FC<ITreeViewProps> = (_props) => {
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles

    logDebugConsole('debug', 'Render');

    const generateTree = (data: Node[]) => (
        <Tree aria-label="Tree">
            {data.map((node, idx) => (
                <TreeItem key={`${node.text}_${idx}`}>
                    <TreeItemLayout>{node.text}</TreeItemLayout>
                    {node.children.length > 0 && generateTree(node.children)}
                </TreeItem>
            ))}
        </Tree>
    );

    return generateTree(_props.data);
};

export default TreeView;
