import React from 'react';
import { useContext } from 'react';
import { dtdlPropertyTypesEnum } from '../../../..';
import { DTDLType } from '../../../../Models/Classes/DTDL';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import '../PropertyTree.scss';

const TreeNodeSetUnset: React.FC<NodeProps> = ({ node }) => {
    const { onNodeValueUnset, onObjectAdd, readonly } = useContext(
        PropertyTreeContext
    );

    if (node.isRemovable && DTDLType.Property) {
        if (node.isSet === false) {
            if (node.schema === dtdlPropertyTypesEnum.Object) {
                return (
                    !readonly && (
                        <button
                            style={{ marginLeft: 8 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onObjectAdd(node);
                            }}
                        >
                            Add
                        </button>
                    )
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
                !readonly && (
                    <button
                        style={{ marginLeft: 8 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onNodeValueUnset(node);
                        }}
                    >
                        Remove
                    </button>
                )
            );
        }
    }

    return null;
};

export default TreeNodeSetUnset;
