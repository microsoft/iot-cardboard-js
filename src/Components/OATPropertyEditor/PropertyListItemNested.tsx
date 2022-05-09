import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyEditorTextFieldStyles,
    getPropertyListItemIconWrapStyles,
    getPropertyListItemIconWrapMoreStyles
} from './OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { deepCopy } from '../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';

type IPropertyListItemNested = {
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string) => string;
    index?: number;
    item?: any;
    parentIndex?: number;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setTemplates?: React.Dispatch<React.SetStateAction<any>>;
    state?: any;
};

export const PropertyListItemNested = ({
    deleteNestedItem,
    dispatch,
    getErrorMessage,
    getItemClassName,
    index,
    item,
    parentIndex,
    setCurrentNestedPropertyIndex,
    setCurrentPropertyIndex,
    setModalOpen,
    setTemplates,
    state
}: IPropertyListItemNested) => {
    const { t } = useTranslation();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

    const handleDuplicate = () => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
        itemCopy.displayName = `${itemCopy.displayName}_${t(
            'OATPropertyEditor.copy'
        )}`;
        itemCopy['@id'] = `${itemCopy['@id']}_${t('OATPropertyEditor.copy')}`;

        const modelCopy = deepCopy(state.model);
        modelCopy.contents[parentIndex].schema.fields.push(itemCopy);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    const handleTemplateAddition = () => {
        setTemplates((templates) => [...templates, item]);
    };

    return (
        <div className={getItemClassName(index)} id={item.name}>
            <TextField
                styles={textFieldStyles}
                borderless
                placeholder={item.name}
                validateOnFocusOut
                onChange={() => {
                    setCurrentPropertyIndex(parentIndex);
                }}
                onGetErrorMessage={getErrorMessage}
            />
            <Text>{item.schema}</Text>
            <IconButton
                styles={iconWrapStyles}
                iconProps={{ iconName: 'info' }}
                title={t('OATPropertyEditor.info')}
                onClick={() => {
                    setCurrentNestedPropertyIndex(index);
                    setCurrentPropertyIndex(parentIndex);
                    setModalOpen(true);
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
                        deleteNestedItem={deleteNestedItem}
                        index={index}
                        parentIndex={parentIndex}
                        subMenuActive={subMenuActive}
                        handleTemplateAddition={() => {
                            handleTemplateAddition();
                        }}
                        handleDuplicate={() => {
                            handleDuplicate();
                        }}
                        targetId={item.name}
                        setSubMenuActive={setSubMenuActive}
                    />
                )}
            </IconButton>
        </div>
    );
};

export default PropertyListItemNested;
