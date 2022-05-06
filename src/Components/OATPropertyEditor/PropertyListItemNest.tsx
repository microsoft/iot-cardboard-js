import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyEditorTextFieldStyles
} from './OATPropertyEditor.styles';
import { DTDLModel, DTDLSchemaType } from '../../Models/Classes/DTDL';
import AddPropertyBar from './AddPropertyBar';
import PropertyListItemNested from './PropertyListItemNested';
import PropertyListEnumItemNested from './PropertyListEnumItemNested';
import PropertyListMapItemNested from './PropertyListMapItemNested';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';

type IPropertyListItemNest = {
    deleteItem?: (index: number) => any;
    draggingProperty?: boolean;
    getItemClassName?: (index: number) => any;
    getNestedItemClassName?: () => any;
    getErrorMessage?: (value: any, index?: any) => string;
    handleDragEnter?: (event: any, item: any) => any;
    handleDragEnterExternalItem?: (index: number) => any;
    handleDragStart?: (event: any, item: any) => any;
    index?: number;
    item?: any;
    lastPropertyFocused?: any;
    model?: DTDLModel;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
    setPropertySelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setTemplates?: React.Dispatch<React.SetStateAction<any>>;
};

export const PropertyListItemNest = ({
    index,
    deleteItem,
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
    setPropertySelectorVisible,
    setCurrentNestedPropertyIndex,
    setModalOpen,
    setModalBody,
    model,
    setModel,
    setTemplates
}: IPropertyListItemNest) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

    const addPropertyCallback = () => {
        setCurrentPropertyIndex(index);
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

    const deleteNestedItem = (parentIndex, index) => {
        setModel((prevModel) => {
            const newModel = deepCopy(prevModel);
            if (
                newModel.contents[parentIndex].schema['@type'] ===
                DTDLSchemaType.Enum
            ) {
                newModel.contents[parentIndex].schema.enumValues.splice(
                    index,
                    1
                );
            } else if (
                newModel.contents[parentIndex].schema['@type'] ===
                DTDLSchemaType.Object
            ) {
                newModel.contents[parentIndex].schema.fields.splice(index, 1);
                return newModel;
            }
            return newModel;
        });
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
            onFocus={() => {
                setLastPropertyFocused({
                    item: item,
                    index: index
                });
            }}
            tabIndex={0}
        >
            <div className={propertyInspectorStyles.propertyItemNestMainItem}>
                <IconButton
                    iconProps={{
                        iconName: collapsed ? 'ChevronDown' : 'ChevronRight'
                    }}
                    title={t('OATPropertyEditor.collapse')}
                    onClick={() => setCollapsed(!collapsed)}
                />
                <TextField
                    styles={textFieldStyles}
                    borderless
                    placeholder={item.name}
                    validateOnFocusOut
                    onChange={() => {
                        setCurrentPropertyIndex(index);
                    }}
                    onGetErrorMessage={getErrorMessage}
                />
                <Text>{item.schema['@type']}</Text>

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
                            handleTemplateAddition={() => {
                                handleTemplateAddition();
                            }}
                            handleDuplicate={() => {
                                handleDuplicate();
                            }}
                            setSubMenuActive={setSubMenuActive}
                            targetId={item.name}
                        />
                    )}
                </IconButton>
            </div>
            {collapsed &&
                item.schema['@type'] === 'Object' &&
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
                        setTemplates={setTemplates}
                        setModel={setModel}
                        model={model}
                    />
                ))}

            {collapsed &&
                item.schema['@type'] === DTDLSchemaType.Enum &&
                item.schema.enumValues.length > 0 &&
                item.schema.enumValues.map((item, i) => (
                    <PropertyListEnumItemNested
                        key={i}
                        item={item}
                        model={model}
                        setModel={setModel}
                        parentIndex={index}
                        index={i}
                        deleteNestedItem={deleteNestedItem}
                    />
                ))}

            {collapsed && item.schema['@type'] === DTDLSchemaType.Map && (
                <PropertyListMapItemNested
                    item={item}
                    model={model}
                    setModel={setModel}
                    index={index}
                />
            )}

            {lastPropertyFocused &&
                lastPropertyFocused.index === index &&
                item.schema['@type'] !== DTDLSchemaType.Map && (
                    <AddPropertyBar onClick={addPropertyCallback} />
                )}
        </div>
    );
};

export default PropertyListItemNest;
