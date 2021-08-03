import React, { createContext, useContext } from 'react';
import {
    NodeProps,
    TreeProps,
    PropertyTreeProps,
    NodeRole
} from './PropertyTree.types';

const PropertyTreeContext = createContext(null);

const PropertyTree: React.FC<PropertyTreeProps> = ({ data, onParentClick }) => {
    return (
        <PropertyTreeContext.Provider value={{ onParentClick }}>
            <div>
                <Tree data={data} />
            </div>
        </PropertyTreeContext.Provider>
    );
};

const Tree: React.FC<TreeProps> = ({ data }) => {
    return (
        <ul>
            {data.map((node) => {
                return (
                    <li key={node.name}>
                        <TreeNode node={node} />
                    </li>
                );
            })}
        </ul>
    );
};

const TreeNode: React.FC<NodeProps> = ({ node }) => {
    if (node.role === NodeRole.parent) {
        return (
            <div>
                <NodeRow node={node} />
                {!node.isCollapsed && <Tree data={node.children} />}
            </div>
        );
    } else {
        return <NodeRow node={node} />;
    }
};

const NodeRow: React.FC<NodeProps> = ({ node }) => {
    const { onParentClick } = useContext(PropertyTreeContext);

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onParentClick(node);
            }}
        >
            {node.name}: <i>{node.schema}</i>
            {node.isSet === false ? ', unset' : null}
        </div>
    );
};

export default PropertyTree;
