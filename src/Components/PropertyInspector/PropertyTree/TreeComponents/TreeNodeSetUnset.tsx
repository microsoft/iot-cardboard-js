import React from 'react';
import { useContext } from 'react';
import { dtdlPropertyTypesEnum } from '../../../..';
import { DTDLType } from '../../../../Models/Classes/DTDL';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import '../PropertyTree.scss';
import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import { IIconStyleProps, IIconStyles } from '@fluentui/react';

const TreeNodeSetUnset: React.FC<NodeProps> = ({ node }) => {
    const { onNodeValueUnset, onObjectAdd, readonly } = useContext(
        PropertyTreeContext
    );

    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.themePrimary
        }
    });

    if (node.isRemovable && DTDLType.Property) {
        if (node.isSet === false) {
            if (node.schema === dtdlPropertyTypesEnum.Object) {
                return (
                    !readonly && (
                        <div
                            className="cb-property-tree-node-set-unset-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onObjectAdd(node);
                            }}
                            title={'Add property'}
                        >
                            <Icon iconName={'Add'} styles={iconStyles} />
                        </div>
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
                    <div
                        className="cb-property-tree-node-set-unset-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNodeValueUnset(node);
                        }}
                        title={'Unset property'}
                    >
                        <Icon iconName={'Remove'} styles={iconStyles} />
                    </div>
                )
            );
        }
    }

    return null;
};

export default TreeNodeSetUnset;
