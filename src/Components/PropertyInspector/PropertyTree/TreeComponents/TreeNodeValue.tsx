import React, { useContext } from 'react';
import { dtdlPropertyTypesEnum } from '../../../..';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import '../PropertyTree.scss';

const TreeNodeValue: React.FC<NodeProps> = ({ node }) => {
    const { onNodeValueChange, readonly } = useContext(PropertyTreeContext);
    const propertyType = node.schema;

    switch (propertyType) {
        case dtdlPropertyTypesEnum.boolean:
            if (readonly) {
                return (
                    <div className="cb-property-tree-node-value">
                        {String(node.value)}
                    </div>
                );
            }
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
            if (readonly) {
                return (
                    <div className="cb-property-tree-node-value">
                        {String(node.value)}
                    </div>
                );
            }
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
            if (readonly) {
                return (
                    <div className="cb-property-tree-node-value">
                        {String(node.value)}
                    </div>
                );
            }
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
            if (readonly) {
                return (
                    <div className="cb-property-tree-node-value">
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 60 }}
                        onChange={(e) =>
                            onNodeValueChange(node, Number(e.target.value))
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.duration: // take ms or s and convert to standard notation
            if (readonly) {
                return (
                    <div className="cb-property-tree-node-value">
                        {String(node.value)}
                    </div>
                );
            }
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
            if (readonly) {
                return (
                    <div className="cb-property-tree-node-value">
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className="cb-property-tree-node-value">
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, Number(e.target.value))
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.string:
            if (!node.writable || readonly) {
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
            if (readonly) {
                return (
                    <div className="cb-property-tree-node-value">
                        {String(node.value)}
                    </div>
                );
            }
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
                        disabled={readonly}
                    >
                        <option value={'enum-unset'}>--</option>
                        {node.complexPropertyData.options.map((ev, idx) => {
                            return (
                                <option value={ev.enumValue} key={idx}>
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

export default TreeNodeValue;
