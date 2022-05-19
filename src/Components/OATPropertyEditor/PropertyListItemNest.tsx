import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyEditorTextFieldStyles
} from './OATPropertyEditor.styles';
import { DTDLSchemaType } from '../../Models/Classes/DTDL';
import AddPropertyBar from './AddPropertyBar';
import PropertySelector from './PropertySelector';
import PropertyListItemNested from './PropertyListItemNested';
import PropertyListEnumItemNested from './PropertyListEnumItemNested';
import PropertyListMapItemNested from './PropertyListMapItemNested';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import {
    IAction,
    IOATLastPropertyFocused,
    DTDLProperty
} from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName
} from './Utils';

type IPropertyListItemNest = {
    deleteItem?: (index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    draggingProperty?: boolean;
    getItemClassName?: (index: number) => any;
    getNestedItemClassName?: () => any;
    getErrorMessage?: (value: any, index?: any) => string;
    handleDragEnter?: (event: any, item: any) => any;
    handleDragEnterExternalItem?: (index: number) => any;
    handleDragStart?: (event: any, item: any) => any;
    index?: number;
    item?: DTDLProperty;
    lastPropertyFocused?: IOATLastPropertyFocused;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertyOnHover?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
};

export const PropertyListItemNest = ({
    index,
    deleteItem,
    dispatch,
    draggingProperty,
    getItemClassName,
    getNestedItemClassName,
    getErrorMessage,
    handleDragEnter,
    handleDragEnterExternalItem,
    handleDragStart,
    setCurrentPropertyIndex,
    item,
    lastPropertyFocused,
    setLastPropertyFocused,
    setCurrentNestedPropertyIndex,
    setModalOpen,
    setModalBody,
    setPropertyOnHover,
    state
}: IPropertyListItemNest) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [hover, setHover] = useState(false);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const { model, templates } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const addPropertyCallback = () => {
        setCurrentPropertyIndex(index);
        if (!lastPropertyFocused) {
            return;
        }

        switch (lastPropertyFocused.item.schema['@type']) {
            case DTDLSchemaType.Object:
                setPropertySelectorVisible(true);
                return;
            case DTDLSchemaType.Enum:
                setModalBody(DTDLSchemaType.Enum);
                setModalOpen(true);
                return;
            default:
                return;
        }
    };

    const handleTemplateAddition = () => {
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: [...templates.item]
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

    const deleteNestedItem = (parentIndex, index) => {
        const newModel = deepCopy(model);
        if (
            newModel[propertiesKeyName][parentIndex].schema['@type'] ===
            DTDLSchemaType.Enum
        ) {
            newModel[propertiesKeyName][parentIndex].schema.enumValues.splice(
                index,
                1
            );
        } else if (
            newModel[propertiesKeyName][parentIndex].schema['@type'] ===
            DTDLSchemaType.Object
        ) {
            newModel[propertiesKeyName][parentIndex].schema.fields.splice(
                index,
                1
            );
        }
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: newModel });
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
                onFocus={() => {
                    setLastPropertyFocused({
                        item: item,
                        index: index
                    });
                }}
                tabIndex={0}
            >
                <div
                    className={propertyInspectorStyles.propertyItemNestMainItem}
                >
                    {(item.schema['@type'] === DTDLSchemaType.Object &&
                        item.schema.fields.length > 0) ||
                    (item.schema['@type'] === DTDLSchemaType.Enum &&
                        item.schema.enumValues.length > 0) ? (
                        <IconButton
                            iconProps={{
                                iconName: collapsed
                                    ? 'ChevronDown'
                                    : 'ChevronRight'
                            }}
                            title={t('OATPropertyEditor.collapse')}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    ) : (
                        <div>{/* Needed for gridTemplateColumns style  */}</div>
                    )}

                    <TextField
                        styles={textFieldStyles}
                        borderless
                        placeholder={getModelPropertyListItemName(item.name)}
                        validateOnFocusOut
                        onChange={() => {
                            setCurrentPropertyIndex(index);
                        }}
                        onGetErrorMessage={getErrorMessage}
                    />
                    <Text>{item.schema['@type']}</Text>

                    <IconButton
                        iconProps={{ iconName: 'info' }}
                        styles={iconWrapMoreStyles}
                        title={t('OATPropertyEditor.info')}
                    />

                    <IconButton
                        iconProps={{
                            iconName: 'more'
                        }}
                        styles={iconWrapMoreStyles}
                        title={t('OATPropertyEditor.more')}
                        onClick={() => setSubMenuActive(!subMenuActive)}
                        id={getModelPropertyListItemName(item.name)}
                    >
                        {subMenuActive && (
                            <PropertyListItemSubMenu
                                deleteItem={deleteItem}
                                index={index}
                                subMenuActive={subMenuActive}
                                handleTemplateAddition={() => {
                                    handleTemplateAddition();
                                }}
                                handleDuplicate={() => {
                                    handleDuplicate();
                                }}
                                setSubMenuActive={setSubMenuActive}
                                targetId={getModelPropertyListItemName(
                                    item.name
                                )}
                            />
                        )}
                    </IconButton>
                </div>
                {collapsed &&
                    item.schema['@type'] === DTDLSchemaType.Object &&
                    item.schema.fields.length > 0 &&
                    item.schema.fields.map((field, i) => (
                        <PropertyListItemNested
                            key={i}
                            item={field}
                            parentIndex={index}
                            index={i}
                            getItemClassName={getNestedItemClassName}
                            setCurrentNestedPropertyIndex={
                                setCurrentNestedPropertyIndex
                            }
                            setCurrentPropertyIndex={setCurrentPropertyIndex}
                            setModalOpen={setModalOpen}
                            deleteNestedItem={deleteNestedItem}
                            dispatch={dispatch}
                            state={state}
                        />
                    ))}

                {collapsed &&
                    item.schema['@type'] === DTDLSchemaType.Enum &&
                    item.schema.enumValues.length > 0 &&
                    item.schema.enumValues.map((item, i) => (
                        <PropertyListEnumItemNested
                            key={i}
                            item={item}
                            dispatch={dispatch}
                            state={state}
                            parentIndex={index}
                            index={i}
                            deleteNestedItem={deleteNestedItem}
                        />
                    ))}

                {collapsed && item.schema['@type'] === DTDLSchemaType.Map && (
                    <PropertyListMapItemNested
                        item={item}
                        dispatch={dispatch}
                        state={state}
                        index={index}
                    />
                )}
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
                        className={
                            propertyInspectorStyles.propertySelectorNestItem
                        }
                    />
                )}
            </div>
            {hover && item.schema['@type'] === DTDLSchemaType.Object && (
                <AddPropertyBar
                    onMouseOver={() => {
                        setLastPropertyFocused({
                            item: item,
                            index: index
                        });
                        setPropertySelectorVisible(true);
                        addPropertyCallback(null);
                    }}
                    classNameIcon={
                        propertyInspectorStyles.addPropertyBarIconNestItem
                    }
                />
            )}
            {hover && item.schema['@type'] === DTDLSchemaType.Enum && (
                <AddPropertyBar
                    onClick={() => {
                        addPropertyCallback(null);
                    }}
                    classNameIcon={
                        propertyInspectorStyles.addPropertyBarIconNestItem
                    }
                />
            )}
        </div>
    );
};

export default PropertyListItemNest;
