import React, { useState } from 'react';
import { Text, IconButton } from '@fluentui/react';
import { getPropertyListItemIconWrapMoreStyles } from './OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
import { TemplateListItemListProps } from './TemplateListItem.types';

export const TemplateListItem: React.FC<TemplateListItemListProps> = (
    props
) => {
    const {
        draggingTemplate,
        item,
        index,
        deleteItem,
        getDragItemClassName,
        onDragEnter,
        onDragEnterExternalItem,
        onDragStart,
        onMove,
        onPropertyListAddition,
        getSchemaText,
        templatesLength
    } = props;

    // hooks
    const { t } = useTranslation();

    // state
    const [subMenuActive, setSubMenuActive] = useState(false);

    // callbacks
    const addTopPropertyList = () => {
        onPropertyListAddition(item);
        setSubMenuActive(false);
    };

    // styles
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();

    return (
        <div
            id={`${item.name}_template_item`}
            className={getDragItemClassName(index)}
            key={index}
            draggable
            onDragStart={(e) => {
                onDragStart(e, index);
            }}
            onDragEnter={
                draggingTemplate
                    ? (e) => onDragEnter(e, index)
                    : () => onDragEnterExternalItem(index)
            }
        >
            <Text>{item.displayName ? item.displayName : item.name}</Text>
            <Text>{getSchemaText(item.schema)}</Text>

            <IconButton
                iconProps={{
                    iconName: 'more'
                }}
                styles={iconWrapMoreStyles}
                title={t('OATPropertyEditor.more')}
                onClick={() => setSubMenuActive(!subMenuActive)}
            >
                {subMenuActive && (
                    <PropertyListItemSubMenu
                        deleteItem={deleteItem}
                        index={index}
                        subMenuActive={subMenuActive}
                        duplicateItem={false}
                        addItemToTemplates={false}
                        targetId={`${item.name}_template_item`}
                        setSubMenuActive={setSubMenuActive}
                        onPropertyListAddition={addTopPropertyList}
                        addItemToPropertyList
                        onMoveUp={
                            // Use function if item is not the first item in the list
                            index > 0 ? onMove : null
                        }
                        onMoveDown={
                            // Use function if item is not the last item in the list
                            index < templatesLength - 1 ? onMove : null
                        }
                    />
                )}
            </IconButton>
        </div>
    );
};

export default TemplateListItem;
