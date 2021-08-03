import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import React, { createContext, useContext } from 'react';
import {
    NodeProps,
    TreeProps,
    PropertyTreeProps,
    NodeRole
} from './PropertyTree.types';
import './PropertyTree.scss';

const PropertyTreeContext = createContext(null);

const PropertyTree: React.FC<PropertyTreeProps> = ({ data, onParentClick }) => {
    return (
        <PropertyTreeContext.Provider value={{ onParentClick }}>
            <div className="cb-property-tree-container">
                <Tree data={data} />
            </div>
        </PropertyTreeContext.Provider>
    );
};

const Tree: React.FC<TreeProps> = ({ data }) => {
    return (
        <ul className="cb-property-tree-list-group">
            {data.map((node) => {
                return (
                    <li className="cb-property-tree-list-item" key={node.name}>
                        <TreeNode node={node} />
                    </li>
                );
            })}
        </ul>
    );
};

const TreeNode: React.FC<NodeProps> = ({ node }) => {
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
            <div className="cb-property-tree-expandable-row">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onParentClick(node);
                    }}
                >
                    <Chevron collapsed={node.isCollapsed} />
                    <div className="cb-property-tree-parent-node">
                        <NodeRow node={node} />
                    </div>
                </div>
                {!node.isCollapsed && <Tree data={node.children} />}
            </div>
        );
    } else {
        return <NodeRow node={node} />;
    }
};

const NodeRow: React.FC<NodeProps> = ({ node }) => {
    return (
        <div>
            {node.name}: <i>{node.schema ?? node.type}</i>
            {node.isSet === false ? ', unset' : null}
        </div>
    );
};

export default PropertyTree;
