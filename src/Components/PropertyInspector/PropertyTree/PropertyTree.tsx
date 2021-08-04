import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import React, { createContext, useContext } from 'react';
import {
    NodeProps,
    TreeProps,
    PropertyTreeProps,
    NodeRole
} from './PropertyTree.types';
import './PropertyTree.scss';
import { dtdlPropertyTypesEnum } from '../../../Models/Constants';
import { Checkbox } from '@fluentui/react/lib/components/Checkbox/Checkbox';

const PropertyTreeContext = createContext(null);

const PropertyTree: React.FC<PropertyTreeProps> = ({ data, onParentClick }) => {
    const set = data.filter((node) => node.isSet !== false);
    const unset = data.filter((node) => node.isSet === false);

    console.log('PropertyTreeData: ', data);

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
    const propertyType = node.schema;

    switch (propertyType) {
        case dtdlPropertyTypesEnum.boolean:
            return (
                <div className="cb-property-tree-node-value">
                    <Checkbox checked={node.value as boolean} />
                </div>
            );
        case dtdlPropertyTypesEnum.date:
            return (
                <div className="cb-property-tree-node-value">{node.value}</div>
            );
        case dtdlPropertyTypesEnum.dateTime:
            return (
                <div className="cb-property-tree-node-value">{node.value}</div>
            );
        case dtdlPropertyTypesEnum.double:
        case dtdlPropertyTypesEnum.float:
        case dtdlPropertyTypesEnum.long:
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 60 }}
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.duration:
            return (
                <div className="cb-property-tree-node-value">{node.value}</div>
            );
        case dtdlPropertyTypesEnum.integer:
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 72 }}
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.string:
            return (
                <div className="cb-property-tree-node-value">
                    <textarea
                        value={node.value as string}
                        style={{ width: 72, height: 18 }}
                    ></textarea>
                </div>
            );
        case dtdlPropertyTypesEnum.time:
            return (
                <div className="cb-property-tree-node-value">{node.value}</div>
            );
        case dtdlPropertyTypesEnum.Enum:
            return (
                <div className="cb-property-tree-node-value">{node.value}</div>
            );
        case dtdlPropertyTypesEnum.Map:
        case dtdlPropertyTypesEnum.Array:
        default:
            return null;
    }
};

const NodeRow: React.FC<NodeProps> = ({ node }) => {
    return (
        <div className="cb-property-tree-node">
            <div className="cb-property-tree-node-name"> {node.name}:</div>
            <NodeValue node={node} />
            <div className="cb-property-tree-node-type">
                {node.schema ?? node.type}
            </div>
            {node.isSet === false && (
                <div className="cb-property-tree-node-value-unset">(unset)</div>
            )}
        </div>
    );
};

export default PropertyTree;
