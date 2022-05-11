import React, { useState } from 'react';
import { TextField, Text, IconButton, Stack } from '@fluentui/react';
import {
    getPropertyEditorTextFieldStyles,
    getPropertyListItemIconWrapStyles,
    getPropertyListItemIconWrapMoreStyles
} from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
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
    item?: any;
    lastPropertyFocused?: boolean;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
    state
}: IPropertyListItem) => {
    const { t } = useTranslation();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [hover, setHover] = useState(false);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );

    const handleTemplateAddition = () => {
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: [...state.templates, item]
        });
    };

    const handleDuplicate = () => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
        itemCopy.displayName = `${itemCopy.displayName}_${t(
            'OATPropertyEditor.copy'
        )}`;
        itemCopy['@id'] = `${itemCopy['@id']}_${t('OATPropertyEditor.copy')}`;

        const modelCopy = deepCopy(state.model);
        modelCopy.contents.push(itemCopy);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}
            onMouseOver={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
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
                tabIndex={0}
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
                {propertySelectorVisible && (
                    <PropertySelector
                        setPropertySelectorVisible={setPropertySelectorVisible}
                        lastPropertyFocused={lastPropertyFocused}
                        targetId={item.name}
                        dispatch={dispatch}
                        state={state}
                    />
                )}
            </div>
            {hover && (
                <AddPropertyBar
                    onMouseOver={() => {
                        setLastPropertyFocused(null);
                        setPropertySelectorVisible(true);
                    }}
                />
            )}
        </div>
    );
};

export default PropertyListItem;
