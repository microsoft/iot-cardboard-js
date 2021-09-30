import { Icon } from '@fluentui/react';
import React, { useContext } from 'react';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps, NodeRole } from '../PropertyTree.types';
import TreeNodeIcon from './TreeNodeIcon';
import '../PropertyTree.scss';
import TreeNodeInfo from './TreeNodeInfo';

const TreeNodeName: React.FC<NodeProps> = ({ node }) => {
    const { onParentClick, isTreeEdited } = useContext(PropertyTreeContext);

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
                    <div
                        className={`cb-property-tree-node-name-text${
                            node.isMetadata
                                ? ' cb-property-tree-node-name-metadata'
                                : ''
                        }${
                            node.edited
                                ? ' cb-property-tree-node-name-edited'
                                : ''
                        }${
                            node.isFloating
                                ? ' cb-property-tree-node-name-floating'
                                : ''
                        }${
                            isTreeEdited
                                ? ' cb-property-tree-node-floating-strikethrough'
                                : ''
                        }`}
                    >
                        {node.displayName ?? node.name}:
                    </div>
                    <TreeNodeInfo node={node} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="cb-property-tree-node-name">
                <TreeNodeIcon node={node} />
                <div
                    className={`cb-property-tree-node-name-text${
                        node.isMetadata
                            ? ' cb-property-tree-node-name-metadata'
                            : ''
                    } ${
                        node.edited ? ' cb-property-tree-node-name-edited' : ''
                    }${
                        node.isFloating
                            ? ' cb-property-tree-node-name-floating'
                            : ''
                    }${
                        isTreeEdited
                            ? ' cb-property-tree-node-floating-strikethrough'
                            : ''
                    }`}
                >
                    {node.displayName ?? node.name}:
                </div>
                <TreeNodeInfo node={node} />
            </div>
        );
    }
};

export default TreeNodeName;
