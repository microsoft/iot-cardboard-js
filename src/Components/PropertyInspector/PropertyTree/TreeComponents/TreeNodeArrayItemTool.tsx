import { Icon, IIconStyleProps, IIconStyles } from '@fluentui/react';
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
        const clearButton = (
            <div
                tabIndex={0}
                className={'cb-property-tree-node-map-value-tool-icon'}
                aria-label={t('propertyInspector.clearArrayIconTitle')}
                onClick={handleClearArray}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleClearArray();
                    }
                }}
            >
                <Icon
                    title={t('propertyInspector.clearArrayIconTitle')}
                    iconName={'Trash'}
                    styles={iconStyles}
                />
            </div>
        );
        const addButton = (
            <div
                tabIndex={0}
                className={'cb-property-tree-node-map-value-tool-icon'}
                aria-label={t('propertyInspector.addArrayItemIconTitle')}
                onClick={handleRemoveArrayItem}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleAddArrayItem();
                    }
                }}
            >
                <Icon
                    title={t('propertyInspector.addArrayItemIconTitle')}
                    iconName={'AddTo'}
                    styles={iconStyles}
                />
            </div>
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
    if (!node.isArrayItem) return null;
    return (
        <>
            <div
                tabIndex={0}
                className={'cb-property-tree-node-map-value-tool-icon'}
                aria-label={t('propertyInspector.removeArrayItemIconTitle')}
                onClick={handleRemoveArrayItem}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleRemoveArrayItem();
                    }
                }}
            >
                <Icon
                    title={t('propertyInspector.removeArrayItemIconTitle')}
                    iconName={'Trash'}
                    styles={iconStyles}
                />
            </div>
        </>
    );
};

export default TreeNodeArrayItemTool;
