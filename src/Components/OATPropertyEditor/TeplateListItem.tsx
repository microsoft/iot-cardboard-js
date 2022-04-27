import React, { useState } from 'react';
import { FontIcon, ActionButton, Stack, Text } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';

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
    const propertyInspectorStyles = getPropertyInspectorStyles();
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
            <ActionButton
                className={propertyInspectorStyles.propertyItemIconWrapMore}
                onClick={() => setSubMenuActive(!subMenuActive)}
            >
                <FontIcon
                    iconName={'More'}
                    className={propertyInspectorStyles.propertyItemIcon}
                />
                {subMenuActive && (
                    <PropertyListItemSubMenu
                        deleteItem={deleteItem}
                        index={index}
                        subMenuActive={subMenuActive}
                        duplicateItem={false}
                        addItemToTemplates={false}
                    />
                )}
            </ActionButton>
        </Stack>
    );
};

export default TemplateListItem;
