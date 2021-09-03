import React from 'react';
import { useContext } from 'react';
import { dtdlPropertyTypesEnum } from '../../../..';
import { DTDLType } from '../../../../Models/Classes/DTDL';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import '../PropertyTree.scss';
import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import { IIconStyleProps, IIconStyles } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const TreeNodeSetUnset: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    const { onNodeValueUnset, onAddObjectOrMap, readonly } = useContext(
        PropertyTreeContext
    );

    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.neutralPrimaryAlt
        }
    });

    if (node.isRemovable && DTDLType.Property) {
        if (node.isSet === false) {
            if (
                node.schema === dtdlPropertyTypesEnum.Object ||
                node.schema === dtdlPropertyTypesEnum.Map
            ) {
                return (
                    !readonly && (
                        <div
                            className="cb-property-tree-node-set-unset-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddObjectOrMap(node);
                            }}
                            title={t('propertyInspector.addProperty')}
                        >
                            <Icon iconName={'Add'} styles={iconStyles} />
                        </div>
                    )
                );
            } else {
                return (
                    <div className="cb-property-tree-node-value-unset">
                        ({t('propertyInspector.unset')})
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
                        title={t('propertyInspector.unsetProperty')}
                    >
                        <Icon iconName={'Cancel'} styles={iconStyles} />
                    </div>
                )
            );
        }
    }

    return null;
};

export default TreeNodeSetUnset;
