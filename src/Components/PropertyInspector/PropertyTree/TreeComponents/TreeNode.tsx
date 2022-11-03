import React from 'react';
import { Tree } from '../PropertyTree';
import { NodeProps, NodeRole } from '../PropertyTree.types';
import '../PropertyTree.scss';
import TreeNodeName from './TreeNodeName';
import TreeNodeValue from './TreeNodeValue';
import TreeNodeSetUnset from './TreeNodeSetUnset';
import { useTranslation } from 'react-i18next';
import TreeNodeMapTool from './TreeNodeMapTool';
import TreeNodeArrayItemTool from './TreeNodeArrayItemTool';

const TreeNode: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="cb-property-tree-node">
                <TreeNodeName node={node} />
                <TreeNodeValue node={node} />
                {node.unit && (
                    <div
                        className="cb-property-tree-node-unit"
                        aria-label={node.unit}
                    >
                        {node.unit}
                    </div>
                )}
                <TreeNodeMapTool node={node} />
                <TreeNodeArrayItemTool node={node} />
                {
                    node.schema !== 'Array' && (
                        <TreeNodeSetUnset node={node} />
                    ) /*putting the unset control within the array tooling */
                }
            </div>
            {!node.isCollapsed && node.children && node.children.length > 0 && (
                <Tree data={node.children} isChildTree={true} />
            )}
            {!node.isCollapsed &&
                node.role === NodeRole.parent &&
                (!node.children ||
                    (node.children && node.children.length === 0)) && (
                    <ul className="cb-property-tree-list-group cb-is-child-tree">
                        <li className="cb-property-tree-list-item cb-property-tree-node-value-metadata">
                            ({t('empty')})
                        </li>
                    </ul>
                )}
        </>
    );
};

export default TreeNode;
