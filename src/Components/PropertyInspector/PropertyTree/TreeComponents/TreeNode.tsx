import React from 'react';
import { Tree } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import '../PropertyTree.scss';
import TreeNodeName from './TreeNodeName';
import TreeNodeValue from './TreeNodeValue';
import TreeNodeSetUnset from './TreeNodeSetUnset';

const TreeNode: React.FC<NodeProps> = ({ node }) => {
    return (
        <>
            <div className="cb-property-tree-node">
                <TreeNodeName node={node} />
                <TreeNodeValue node={node} />
                <TreeNodeSetUnset node={node} />
            </div>
            {!node.isCollapsed && node.children && (
                <Tree data={node.children} isChildTree={true} />
            )}
        </>
    );
};

export default TreeNode;
