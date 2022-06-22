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
    getDragItemClassName?: (index: number) => void;
    handleDragEnter?: (event: any, index: number) => void;
    handleDragEnterExternalItem?: (index: number) => void;
    handleDragStart?: (event: any, index: number) => void;
    handlePropertyListAddition?: (item: DTDLProperty) => void;
    handleMoveUp?: (index: number) => void;
    handleMoveDown?: (index: number) => void;
    getSchemaText?: (schema: any) => string;
    templatesLength?: number;
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
    handleMoveUp,
    handleMoveDown,
    handlePropertyListAddition,
    getSchemaText,
    templatesLength
}: ITemplateListItemList) => {
    const { t } = useTranslation();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

    const onPropertyListAddition = () => {
        handlePropertyListAddition(item);
        setSubMenuActive(false);
    };

    return (
        <div
            id={`${item.name}_template_item`}
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
                        handlePropertyListAddition={onPropertyListAddition}
                        addItemToPropertyList
                        handleMoveUp={
                            // Use function if item is not the first item in the list
                            index > 0 ? handleMoveUp : null
                        }
                        handleMoveDown={
                            // Use function if item is not the last item in the list
                            index < templatesLength - 1 ? handleMoveDown : null
                        }
                    />
                )}
            </IconButton>
        </div>
    );
};

export default TemplateListItem;
