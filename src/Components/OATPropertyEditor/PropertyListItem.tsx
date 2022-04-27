import React, { useState } from 'react';
import {
    FontIcon,
    TextField,
    ActionButton,
    Stack,
    Text
} from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';

type IPropertyListItem = {
    index?: number;
    deleteItem?: (index: number) => any;
    draggingProperty?: boolean;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string, index?: number) => string;
    handleDragEnter?: (event: any, item: any) => any;
    handleDragEnterExternalItem?: (index: number) => any;
    handleDragStart?: (event: any, item: any) => any;
    item?: any;
    model: DTDLModel;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModel?: React.Dispatch<React.SetStateAction<any>>;
    setTemplates?: React.Dispatch<React.SetStateAction<any>>;
};

export const PropertyListItem = ({
    index,
    deleteItem,
    draggingProperty,
    getItemClassName,
    getErrorMessage,
    handleDragEnter,
    handleDragEnterExternalItem,
    handleDragStart,
    model,
    setCurrentPropertyIndex,
    setModalOpen,
    item,
    setLastPropertyFocused,
    setModalBody,
    setModel,
    setTemplates
}: IPropertyListItem) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

    const handleTemplateAddition = () => {
        setTemplates((templates) => [...templates, item]);
    };

    const handleDuplicate = () => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_copy`;
        itemCopy.displayName = `${itemCopy.displayName}_copy`;
        itemCopy['@id'] = `${itemCopy['@id']}_copy`;

        const modelCopy = deepCopy(model);
        modelCopy.contents.push(itemCopy);
        setModel(modelCopy);
    };

    return (
        <Stack
            className={getItemClassName(index)}
            draggable
            onDragStart={(e) => {
                handleDragStart(e, index);
            }}
            onDragEnter={
                draggingProperty
                    ? (e) => handleDragEnter(e, index)
                    : () => handleDragEnterExternalItem(index)
            }
            onFocus={() => setLastPropertyFocused(null)}
            tabIndex={0}
        >
            <TextField
                className={propertyInspectorStyles.propertyItemTextField}
                borderless
                value={item.name}
                validateOnFocusOut
                onChange={(evt, value) => {
                    setCurrentPropertyIndex(index);
                    getErrorMessage(value, index);
                }}
            />
            <Text>{item.schema}</Text>
            <ActionButton
                className={propertyInspectorStyles.propertyItemIconWrap}
                onClick={() => {
                    setCurrentPropertyIndex(index);
                    setModalOpen(true);
                    setModalBody('formProperty');
                }}
            >
                <FontIcon
                    iconName={'Info'}
                    className={propertyInspectorStyles.propertyItemIcon}
                />
            </ActionButton>
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
                        handleTemplateAddition={handleTemplateAddition}
                        handleDuplicate={handleDuplicate}
                    />
                )}
            </ActionButton>
        </Stack>
    );
};

export default PropertyListItem;
