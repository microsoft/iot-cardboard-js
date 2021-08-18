import { Icon } from '@fluentui/react';
import React, { useContext } from 'react';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps, NodeRole } from '../PropertyTree.types';
import TreeNodeIcon from './TreeNodeIcon';
import '../PropertyTree.scss';

const TreeNodeName: React.FC<NodeProps> = ({ node }) => {
    const { onParentClick } = useContext(PropertyTreeContext);

    const Chevron = ({ collapsed }) => (
        <Icon
            iconName={'ChevronRight'}
            className={`cb-chevron ${
                collapsed ? 'cb-collapsed' : 'cb-expanded'
            }`}
        />
    );

    if (node.role === NodeRole.parent) {
        return (
            <div
                className={
                    'cb-property-tree-node-name cb-property-tree-parent-node'
                }
                onClick={(e) => {
                    e.stopPropagation();
                    onParentClick(node);
                }}
            >
                <Chevron collapsed={node.isCollapsed} />
                <div className="cb-property-tree-parent-node-inset">
                    <TreeNodeIcon node={node} />
                    <div>{node.displayName ?? node.name}:</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="cb-property-tree-node-name">
                <TreeNodeIcon node={node} />
                {node.displayName ?? node.name}:
            </div>
        );
    }
};

export default TreeNodeName;
