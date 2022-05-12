import { Icon, IIconStyleProps, IIconStyles } from '@fluentui/react';
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
        <div
            tabIndex={0}
            className={'cb-property-tree-node-map-value-tool-icon'}
            aria-label={t('propertyInspector.removeMapValueIconTitle')}
            onClick={handleRemoveMapValue}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleRemoveMapValue();
                }
            }}
        >
            <Icon
                title={t('propertyInspector.removeMapValueIconTitle')}
                iconName={'Trash'}
                styles={iconStyles}
            />
        </div>
    );
};

export default TreeNodeMapTool;
