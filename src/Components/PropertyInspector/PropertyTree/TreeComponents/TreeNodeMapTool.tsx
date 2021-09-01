import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import {
    IIconStyleProps,
    IIconStyles
} from '@fluentui/react/lib/components/Icon/Icon.types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';

const TreeNodeMapTool: React.FC<NodeProps> = ({ node }) => {
    if (!node.isMapChild) return null;
    const { t } = useTranslation();
    const { onRemoveMapValue } = useContext(PropertyTreeContext);

    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.neutralPrimaryAlt
        }
    });

    const handleRemoveMapValue = () => {
        onRemoveMapValue(node);
    };

    return (
        <div
            className={'cb-property-tree-node-map-value-tool-icon'}
            onClick={handleRemoveMapValue}
        >
            <Icon
                title={t('propertyInspector.removeMapValueIconTitle')}
                iconName={'Remove'}
                styles={iconStyles}
            />
        </div>
    );
};

export default TreeNodeMapTool;
