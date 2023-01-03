import React from 'react';
import { useContext } from 'react';
import { DTDLType } from '../../../../Models/Classes/DTDL';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import '../PropertyTree.scss';
import { IconButton, IIconStyleProps, IIconStyles } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const TreeNodeSetUnset: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    const { onNodeValueUnset, readonly } = useContext(PropertyTreeContext);

    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.neutralPrimaryAlt
        }
    });

    if (node.isRemovable && node.type === DTDLType.Property) {
        if (node.isSet === false) {
            return (
                <div className="cb-property-tree-node-value-unset">
                    ({t('propertyInspector.notSet')})
                </div>
            );
        } else {
            return (
                !readonly && (
                    <IconButton
                        className="cb-property-tree-node-set-unset-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNodeValueUnset(node);
                        }}
                        ariaLabel={t('propertyInspector.unsetProperty')}
                        iconProps={{
                            iconName: 'Cancel',
                            styles: iconStyles
                        }}
                    />
                )
            );
        }
    }

    return null;
};

export default TreeNodeSetUnset;
