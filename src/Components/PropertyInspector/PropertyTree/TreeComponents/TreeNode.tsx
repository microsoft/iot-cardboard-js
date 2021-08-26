import React from 'react';
import { Tree } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import '../PropertyTree.scss';
import TreeNodeName from './TreeNodeName';
import TreeNodeValue from './TreeNodeValue';
import TreeNodeSetUnset from './TreeNodeSetUnset';
import { useTranslation } from 'react-i18next';

const TreeNode: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="cb-property-tree-node">
                <TreeNodeName node={node} />
                <TreeNodeValue node={node} />
                {node.unit && (
                    <div className="cb-property-tree-node-unit">
                        {node.unit}
                    </div>
                )}
                <TreeNodeSetUnset node={node} />
            </div>
            {!node.isCollapsed && node.children && node.children.length > 0 && (
                <Tree data={node.children} isChildTree={true} />
            )}
            {!node.isCollapsed && node.children && node.children.length === 0 && (
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
