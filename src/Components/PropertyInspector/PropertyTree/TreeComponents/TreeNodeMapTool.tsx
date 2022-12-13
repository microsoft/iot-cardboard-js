import { IconButton, IIconStyleProps, IIconStyles } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';

const TreeNodeMapTool: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    const { onRemoveMapValue, readonly } = useContext(PropertyTreeContext);

    if (!node.isMapChild || readonly) return null;

    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.neutralPrimaryAlt
        }
    });

    const handleRemoveMapValue = () => {
        onRemoveMapValue(node);
    };

    return (
        <IconButton
            className="cb-property-tree-node-map-value-tool-icon"
            ariaLabel={t('propertyInspector.removeMapValueIconTitle')}
            onClick={handleRemoveMapValue}
            iconProps={{
                iconName: 'Trash',
                styles: iconStyles
            }}
        />
    );
};

export default TreeNodeMapTool;
