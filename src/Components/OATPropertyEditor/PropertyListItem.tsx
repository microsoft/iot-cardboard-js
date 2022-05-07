import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyEditorTextFieldStyles,
    getPropertyListItemIconWrapStyles,
    getPropertyListItemIconWrapMoreStyles
} from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

    const handleTemplateAddition = () => {
        setTemplates((templates) => [...templates, item]);
    };

    const handleDuplicate = () => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
        itemCopy.displayName = `${itemCopy.displayName}_${t(
            'OATPropertyEditor.copy'
        )}`;
        itemCopy['@id'] = `${itemCopy['@id']}_${t('OATPropertyEditor.copy')}`;

        const modelCopy = deepCopy(model);
        modelCopy.contents.push(itemCopy);
        setModel(modelCopy);
    };

    return (
        <div
            id={item.name}
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
            tabIndex={90}
        >
            <TextField
                borderless
                value={item.name}
                validateOnFocusOut
                onChange={(evt, value) => {
                    setCurrentPropertyIndex(index);
                    getErrorMessage(value, index);
                }}
                styles={textFieldStyles}
            />
            <Text>{item.schema}</Text>
            <IconButton
                styles={iconWrapStyles}
                iconProps={{ iconName: 'info' }}
                title={t('OATPropertyEditor.info')}
                onClick={() => {
                    setCurrentPropertyIndex(index);
                    setModalOpen(true);
                    setModalBody('formProperty');
                }}
            />
            <IconButton
                styles={iconWrapMoreStyles}
                iconProps={{ iconName: 'more' }}
                title={t('OATPropertyEditor.more')}
                onClick={() => setSubMenuActive(!subMenuActive)}
            >
                {subMenuActive && (
                    <PropertyListItemSubMenu
                        deleteItem={deleteItem}
                        index={index}
                        subMenuActive={subMenuActive}
                        handleTemplateAddition={handleTemplateAddition}
                        handleDuplicate={handleDuplicate}
                        targetId={item.name}
                        setSubMenuActive={setSubMenuActive}
                    />
                )}
            </IconButton>
        </div>
    );
};

export default PropertyListItem;
