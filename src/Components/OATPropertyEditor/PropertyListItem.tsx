import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyEditorTextFieldStyles,
    getPropertyListItemIconWrapStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyInspectorStyles
} from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import { DTDLProperty, IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName
} from './Utils';

type IPropertyListItem = {
    index?: number;
    deleteItem?: (index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    draggingProperty?: boolean;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string, index?: number) => string;
    handleDragEnter?: (event: any, item: any) => any;
    handleDragEnterExternalItem?: (index: number) => any;
    handleDragStart?: (event: any, item: any) => any;
    item?: DTDLProperty;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertyOnHover?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
};

export const PropertyListItem = ({
    index,
    deleteItem,
    dispatch,
    draggingProperty,
    getItemClassName,
    getErrorMessage,
    handleDragEnter,
    handleDragEnterExternalItem,
    handleDragStart,
    setCurrentPropertyIndex,
    setModalOpen,
    item,
    setLastPropertyFocused,
    setModalBody,
    setPropertyOnHover,
    state
}: IPropertyListItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const { model, templates } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const handleTemplateAddition = () => {
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: [...templates, item]
        });
    };

    const handleDuplicate = () => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
        itemCopy.displayName = `${itemCopy.displayName}_${t(
            'OATPropertyEditor.copy'
        )}`;
        itemCopy['@id'] = `${itemCopy['@id']}_${t('OATPropertyEditor.copy')}`;

        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName].push(itemCopy);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    return (
        <div
            className={propertyInspectorStyles.propertyListRelativeWrap}
            onMouseOver={() => {
                setLastPropertyFocused({
                    item: item,
                    index: index
                });
            }}
            onMouseLeave={() => {
                setPropertyOnHover(false);
            }}
        >
            <div
                id={getModelPropertyListItemName(item.name)}
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
                onFocus={() =>
                    setLastPropertyFocused({
                        item: item,
                        index: index
                    })
                }
                tabIndex={0}
            >
                <TextField
                    borderless
                    value={getModelPropertyListItemName(item.name)}
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
                            targetId={getModelPropertyListItemName(item.name)}
                            setSubMenuActive={setSubMenuActive}
                        />
                    )}
                </IconButton>
            </div>
        </div>
    );
};

export default PropertyListItem;
