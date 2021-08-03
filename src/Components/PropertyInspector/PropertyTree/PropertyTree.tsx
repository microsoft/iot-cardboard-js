import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import React, { createContext, useContext } from 'react';
import {
    NodeProps,
    TreeProps,
    PropertyTreeProps,
    NodeRole
} from './PropertyTree.types';
import './PropertyTree.scss';
import { dtdlPrimitiveTypesEnum } from '../../../Models/Constants';
import { DTDLSchemaType } from '../../../Models/Classes/DTDL';

const PropertyTreeContext = createContext(null);

const PropertyTree: React.FC<PropertyTreeProps> = ({ data, onParentClick }) => {
    const set = data.filter((node) => node.isSet !== false);
    const unset = data.filter((node) => node.isSet === false);

    return (
        <PropertyTreeContext.Provider value={{ onParentClick }}>
            <div className="cb-property-tree-container">
                <Tree data={set} />
                <Tree data={unset} />
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

const NodeValue: React.FC<NodeProps> = ({ node }) => {
    if (node.schema === dtdlPrimitiveTypesEnum.boolean) {
        return (
            <div className="cb-property-tree-node-value">
                {String(node.value)}
            </div>
        );
    } else if (node.schema === DTDLSchemaType.Enum) {
        return <div className="cb-property-tree-node-value">{node.value}</div>;
    } else {
        return <div className="cb-property-tree-node-value">{node.value}</div>;
    }
};

const NodeRow: React.FC<NodeProps> = ({ node }) => {
    return (
        <div className="cb-property-tree-node">
            <div className="cb-property-tree-node-name"> {node.name}:</div>
            {node.value ? (
                <NodeValue node={node} />
            ) : node.role === NodeRole.leaf ? (
                <div className="cb-property-tree-node-value-unset">(unset)</div>
            ) : null}
            <div className="cb-property-tree-node-type">
                {node.schema ?? node.type}
            </div>
        </div>
    );
};

export default PropertyTree;
