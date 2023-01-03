import { IIconStyleProps, IIconStyles, IconButton } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import TreeNodeSetUnset from './TreeNodeSetUnset';

const TreeNodeArrayItemTool: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    const {
        onRemoveArrayItem,
        onAddArrayItem,
        onClearArray,
        readonly
    } = useContext(PropertyTreeContext);

    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.neutralPrimaryAlt
        }
    });

    const handleRemoveArrayItem = () => {
        onRemoveArrayItem(node);
    };

    const handleAddArrayItem = () => {
        onAddArrayItem(node);
    };

    const handleClearArray = () => {
        onClearArray(node);
    };
    if (readonly) {
        return null;
    }

    if (node.schema === 'Array') {
        /* Add/Clear/Unset the array root */
        const clearButton = (
            <IconButton
                className="cb-property-tree-node-map-value-tool-icon"
                ariaLabel={t('propertyInspector.clearArrayIconTitle')}
                onClick={handleClearArray}
                iconProps={{
                    iconName: 'Trash',
                    styles: iconStyles
                }}
            />
        );
        const addButton = (
            <IconButton
                className={'cb-property-tree-node-map-value-tool-icon'}
                ariaLabel={t('propertyInspector.addArrayItemIconTitle')}
                onClick={handleAddArrayItem}
                iconProps={{
                    iconName: 'AddTo',
                    styles: iconStyles
                }}
            />
        );
        if (node.children?.length > 0) {
            return (
                <>
                    {addButton}
                    {clearButton}
                </>
            );
        }
        return (
            <>
                {addButton}
                <TreeNodeSetUnset node={node} />
            </>
        );
    }
    if (node.isArrayItem) {
        /* remove individual array item */
        return (
            <IconButton
                className={'cb-property-tree-node-map-value-tool-icon'}
                ariaLabel={t('propertyInspector.removeArrayItemIconTitle')}
                onClick={handleRemoveArrayItem}
                iconProps={{
                    iconName: 'Trash',
                    styles: iconStyles
                }}
            />
        );
    }
};

export default TreeNodeArrayItemTool;
