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
import OATTextFieldId from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';

import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName
} from './Utils';
import { FormBody } from './Constants';

type IPropertyListItem = {
    index?: number;
    deleteItem?: (index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    draggingProperty?: boolean;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string, index?: number) => string;
    onMove?: (index: number, moveUp: boolean) => void;
    propertiesLength?: number;
    onPropertyDisplayNameChange?: (value: string, index?: number) => void;
    onDragEnter?: (event: any, item: any) => any;
    onDragEnterExternalItem?: (index: number) => any;
    onDragStart?: (event: any, item: any) => any;
    item?: DTDLProperty;
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
    onDragEnter,
    onDragEnterExternalItem,
    onDragStart,
    onPropertyDisplayNameChange,
    onMove,
    propertiesLength,
    setCurrentPropertyIndex,
    setModalOpen,
    item,
    setLastPropertyFocused,
    setModalBody,
    state
}: IPropertyListItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);
    const { model, templates } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const onTemplateAddition = () => {
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: [...templates, item]
        });
    };

    const onDuplicate = () => {
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
        >
            <div
                id={getModelPropertyListItemName(item.name)}
                className={getItemClassName(index)}
                draggable
                onDragStart={(e) => {
                    onDragStart(e, index);
                }}
                onDragEnter={
                    draggingProperty
                        ? (e) => onDragEnter(e, index)
                        : () => onDragEnterExternalItem(index)
                }
                onFocus={() =>
                    setLastPropertyFocused({
                        item: item,
                        index: index
                    })
                }
                tabIndex={0}
            >
                {!displayNameEditor && (
                    <Text onDoubleClick={() => setDisplayNameEditor(true)}>
                        {item.displayName}
                    </Text>
                )}
                {displayNameEditor && (
                    <TextField
                        borderless
                        value={getModelPropertyListItemName(
                            item.displayName ? item.displayName : item.name
                        )}
                        validateOnFocusOut
                        onChange={(evt, value) => {
                            setCurrentPropertyIndex(index);
                            onPropertyDisplayNameChange(value, index);
                        }}
                        onBlur={() => setDisplayNameEditor(false)}
                        styles={textFieldStyles}
                    />
                )}
                <Text>{item.schema}</Text>
                <IconButton
                    styles={iconWrapStyles}
                    iconProps={{ iconName: 'info' }}
                    title={t('OATPropertyEditor.info')}
                    onClick={() => {
                        setCurrentPropertyIndex(index);
                        setModalOpen(true);
                        setModalBody(FormBody.property);
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
                            onTemplateAddition={onTemplateAddition}
                            onDuplicate={onDuplicate}
                            targetId={getModelPropertyListItemName(item.name)}
                            setSubMenuActive={setSubMenuActive}
                            onMoveUp={
                                // Use function if item is not the first item in the list
                                index > 0 ? onMove : null
                            }
                            onMoveDown={
                                // Use function if item is not the last item in the list
                                index < propertiesLength - 1 ? onMove : null
                            }
                        />
                    )}
                </IconButton>
            </div>
        </div>
    );
};

export default PropertyListItem;
