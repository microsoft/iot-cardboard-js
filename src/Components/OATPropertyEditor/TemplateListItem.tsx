import React, { useState } from 'react';
import { Text, IconButton } from '@fluentui/react';
import { getPropertyListItemIconWrapMoreStyles } from './OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
import { DTDLProperty } from '../../Models/Classes/DTDL';
interface ITemplateListItemList {
    draggingTemplate?: boolean;
    item?: DTDLProperty;
    index: number;
    deleteItem?: (index: number) => void;
    getDragItemClassName?: (index: number) => string;
    onDragEnter?: (event: any, index: number) => void;
    onDragEnterExternalItem?: (index: number) => void;
    onDragStart?: (event: any, index: number) => void;
    onPropertyListAddition?: (item: DTDLProperty) => void;
    onMove?: (index: number, moveUp: boolean) => void;
    getSchemaText?: (schema: any) => string;
    templatesLength?: number;
}

export const TemplateListItem = ({
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
}: ITemplateListItemList) => {
    const { t } = useTranslation();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

    const addTopPropertyList = () => {
        onPropertyListAddition(item);
        setSubMenuActive(false);
    };

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
