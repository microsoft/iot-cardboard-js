import React from 'react';
import { TextField, Stack, Text } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import AddPropertyBar from './AddPropertyBar';
import PropertyListItemNested from './PropertyListItemNested';

// type IPropertyListItem = {};

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
    setModalOpen
}) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

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
            {item.schema.fields.length > 0 &&
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

            {lastPropertyFocused && (
                <AddPropertyBar
                    callback={() => setPropertySelectorVisible(true)}
                />
            )}
        </Stack>
    );
};

export default PropertyListItemNest;
