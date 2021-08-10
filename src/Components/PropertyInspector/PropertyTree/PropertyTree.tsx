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
import { DTDLType } from '../../../Models/Classes/DTDL';

const PropertyTreeContext = createContext<Omit<PropertyTreeProps, 'data'>>(
    null
);

const PropertyTree: React.FC<PropertyTreeProps> = ({
    data,
    onParentClick,
    onNodeValueChange,
    onNodeValueUnset,
    onObjectAdd
}) => {
    return (
        <PropertyTreeContext.Provider
            value={{
                onParentClick,
                onNodeValueChange,
                onNodeValueUnset,
                onObjectAdd
            }}
        >
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

const NodeValue: React.FC<NodeProps> = ({ node }) => {
    const { onNodeValueChange } = useContext(PropertyTreeContext);
    const propertyType = node.schema;

    switch (propertyType) {
        case dtdlPropertyTypesEnum.boolean:
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        type="checkbox"
                        checked={(node.value as boolean) || false}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.checked)
                        }
                    />
                </div>
            );
        case dtdlPropertyTypesEnum.date:
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        value={node.value as string}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.dateTime:
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        value={node.value as string}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
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
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.duration: // take ms or s and convert to standard notation
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        value={node.value as string}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.integer:
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.string:
            if (node.readonly) {
                return (
                    <div className="cb-property-tree-node-value">
                        {node.value}
                    </div>
                );
            } else {
                return (
                    <div className="cb-property-tree-node-value">
                        <textarea
                            value={node.value as string}
                            style={{
                                width: 72,
                                height: 17,
                                padding: '1px 2px'
                            }}
                            onChange={(e) =>
                                onNodeValueChange(node, e.target.value)
                            }
                        ></textarea>
                    </div>
                );
            }

        case dtdlPropertyTypesEnum.time:
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        value={node.value as string}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.Enum:
            return (
                <div className="cb-property-tree-node-value">
                    <select
                        value={(node.value as string | number) ?? 'enum-unset'}
                        style={{ height: 21 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    >
                        <option value={'enum-unset'}>--</option>
                        {node.complexPropertyData.options.map((ev, idx) => {
                            return (
                                <option value={ev.name} key={idx}>
                                    {ev.displayName ?? ev.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            );
        case dtdlPropertyTypesEnum.Map:
        case dtdlPropertyTypesEnum.Array:
        default:
            return null;
    }
};

const NodeRow: React.FC<NodeProps> = ({ node }) => {
    const { onNodeValueUnset, onObjectAdd } = useContext(PropertyTreeContext);

    const NodeRowUnset = () => {
        if (node.isRemovable && DTDLType.Property) {
            if (node.isSet === false) {
                if (node.schema === dtdlPropertyTypesEnum.Object) {
                    return (
                        <button
                            style={{ marginLeft: 8 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onObjectAdd(node);
                            }}
                        >
                            Add
                        </button>
                    );
                } else {
                    return (
                        <div className="cb-property-tree-node-value-unset">
                            (unset)
                        </div>
                    );
                }
            } else {
                return (
                    <button
                        style={{ marginLeft: 8 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onNodeValueUnset(node);
                        }}
                    >
                        Remove
                    </button>
                );
            }
        }

        return null;
    };

    return (
        <div className="cb-property-tree-node">
            <div className="cb-property-tree-node-name">
                {' '}
                {node.displayName ?? node.name}:
            </div>
            <NodeValue node={node} />
            <div className="cb-property-tree-node-type">
                {node.schema ?? node.type}
            </div>
            <NodeRowUnset />
        </div>
    );
};

export default PropertyTree;
