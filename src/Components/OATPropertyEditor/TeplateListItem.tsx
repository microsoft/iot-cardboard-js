import React, { useState } from 'react';
import { Stack, Text, IconButton } from '@fluentui/react';
import { getPropertyListItemIconWrapMoreStyles } from './OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
interface ITemplateListItemList {
    draggingTemplate?: boolean;
    item?: any;
    index: number;
    deleteItem?: (index: number) => any;
    getDragItemClassName?: (index: number) => any;
    handleDragEnter?: (event: any, index: number) => any;
    handleDragEnterExternalItem?: (index: number) => any;
    handleDragStart?: (event: any, index: number) => any;
    getSchemaText?: (schema: any) => string;
}

export const TemplateListItem = ({
    draggingTemplate,
    item,
    index,
    deleteItem,
    getDragItemClassName,
    handleDragEnter,
    handleDragEnterExternalItem,
    handleDragStart,
    getSchemaText
}: ITemplateListItemList) => {
    const { t } = useTranslation();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

    return (
        <Stack
            className={getDragItemClassName(index)}
            key={index}
            draggable
            onDragStart={(e) => {
                handleDragStart(e, index);
            }}
            onDragEnter={
                draggingTemplate
                    ? (e) => handleDragEnter(e, index)
                    : () => handleDragEnterExternalItem(index)
            }
        >
            <Text>{item.name}</Text>
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
                    />
                )}
            </IconButton>
        </Stack>
    );
};

export default TemplateListItem;
