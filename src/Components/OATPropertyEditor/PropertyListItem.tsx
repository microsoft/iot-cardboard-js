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
import {
    DTDLProperty,
    IAction,
    IOATLastPropertyFocused
} from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import AddPropertyBar from './AddPropertyBar';
import PropertySelector from './PropertySelector';

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
    lastPropertyFocused?: IOATLastPropertyFocused;
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
    lastPropertyFocused,
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
    const [hover, setHover] = useState(false);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const { model, templates } = state;

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
        modelCopy.contents.push(itemCopy);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    return (
        <div
            className={propertyInspectorStyles.propertyListRelativeWrap}
            onMouseOver={() => {
                setHover(true);
                setLastPropertyFocused({
                    item: item,
                    index: index
                });
                setPropertyOnHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
                setPropertySelectorVisible(false);
                setPropertyOnHover(false);
            }}
        >
            <div
                id={
                    typeof item.name === 'string'
                        ? item.name
                        : Object.values(item.name)[0]
                }
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
                    value={
                        typeof item.name === 'string'
                            ? item.name
                            : Object.values(item.name)[0]
                    }
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
                            targetId={
                                typeof item.name === 'string'
                                    ? item.name
                                    : Object.values(item.name)[0]
                            }
                            setSubMenuActive={setSubMenuActive}
                        />
                    )}
                </IconButton>
                {propertySelectorVisible && (
                    <PropertySelector
                        setPropertySelectorVisible={setPropertySelectorVisible}
                        lastPropertyFocused={lastPropertyFocused}
                        dispatch={dispatch}
                        state={state}
                        onTagClickCallback={() => {
                            setHover(false);
                            setPropertyOnHover(false);
                        }}
                    />
                )}
            </div>
            {hover && (
                <AddPropertyBar
                    onMouseOver={() => {
                        setLastPropertyFocused({
                            item: item,
                            index: index
                        });
                        setPropertySelectorVisible(true);
                    }}
                />
            )}
        </div>
    );
};

export default PropertyListItem;
