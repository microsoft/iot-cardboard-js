import React from 'react';
import { TextField, Stack, Text } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import AddPropertyBar from './AddPropertyBar';
import PropertyListItemNested from './PropertyListItemNested';
import PropertyListEnumItemNested from './PropertyListEnumItemNested';
import PropertyListMapItemNested from './PropertyListMapItemNested';

type IPropertyListItem = {
    index?: number;
    draggingProperty?: boolean;
    getItemClassName?: any;
    getNestedItemClassName?: any;
    getErrorMessage?: any;
    handleDragEnter?: any;
    handleDragEnterExternalItem?: any;
    handleDragStart?: any;
    setCurrentPropertyIndex?: any;
    item?: any;
    lastPropertyFocused?: any;
    setLastPropertyFocused?: any;
    setPropertySelectorVisible?: any;
    setCurrentNestedPropertyIndex?: any;
    setModalOpen?: any;
    setModalBody?: any;
    model?: any;
    setModel?: any;
};

export const PropertyListItemNest = ({
    index,
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
    setModel
}: IPropertyListItem) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const addPropertyCallback = () => {
        setCurrentPropertyIndex(index);
        switch (lastPropertyFocused.item.schema['@type']) {
            case 'Object':
                setPropertySelectorVisible(true);
                return;
            case 'Enum':
                setModalBody('formEnum');
                setModalOpen(true);
                return;
            case 'Map':
                setModalBody('formMap');
                setModalOpen(true);
                return;
            default:
                return;
        }
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
            onFocus={() => {
                setLastPropertyFocused({
                    item: item,
                    index: index
                });
            }}
            tabIndex={0}
        >
            <Stack className={propertyInspectorStyles.propertyItemNestMainItem}>
                <TextField
                    className={propertyInspectorStyles.propertyItemTextField}
                    borderless
                    placeholder={item.name}
                    validateOnFocusOut
                    onChange={() => {
                        setCurrentPropertyIndex(index);
                    }}
                    onGetErrorMessage={getErrorMessage}
                />
                <Text>{item.schema['@type']}</Text>
            </Stack>
            {item.schema['@type'] === 'Object' &&
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
                    />
                ))}

            {item.schema['@type'] === 'Enum' &&
                item.schema.enumValues.length > 0 &&
                item.schema.enumValues.map((item, i) => (
                    <PropertyListEnumItemNested
                        item={item}
                        key={i}
                        model={model}
                        setModel={setModel}
                        parentIndex={index}
                        index={i}
                    />
                ))}

            {item.schema['@type'] === 'Map' && (
                <PropertyListMapItemNested
                    item={item}
                    model={model}
                    setModel={setModel}
                    index={index}
                />
            )}

            {lastPropertyFocused &&
                lastPropertyFocused.index === index &&
                item.schema['@type'] !== 'Map' && (
                    <AddPropertyBar callback={addPropertyCallback} />
                )}
        </Stack>
    );
};

export default PropertyListItemNest;
