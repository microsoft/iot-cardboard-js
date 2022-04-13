import React from 'react';
import {
    FontIcon,
    TextField,
    ActionButton,
    Stack,
    Text
} from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

type IPropertyListItem = {
    index?: any;
    draggingProperty?: boolean;
    getItemClassName?: any;
    getErrorMessage?: any;
    handleDragEnter?: any;
    handleDragEnterExternalItem?: any;
    handleDragStart?: any;
    setCurrentPropertyIndex?: any;
    setModalOpen?: any;
    item?: any;
    setLastPropertyFocused?: any;
};

export const PropertyListItem = ({
    index,
    draggingProperty,
    getItemClassName,
    getErrorMessage,
    handleDragEnter,
    handleDragEnterExternalItem,
    handleDragStart,
    setCurrentPropertyIndex,
    setModalOpen,
    item,
    setLastPropertyFocused
}: IPropertyListItem) => {
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
            onFocus={() => setLastPropertyFocused(null)}
            tabIndex={0}
        >
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
            <Text>{item.schema}</Text>
            <ActionButton
                className={propertyInspectorStyles.propertyItemIconWrap}
                onClick={() => {
                    setCurrentPropertyIndex(index);
                    setModalOpen(true);
                }}
            >
                <FontIcon
                    iconName={'Info'}
                    className={propertyInspectorStyles.propertyItemIcon}
                />
            </ActionButton>
            <ActionButton
                className={propertyInspectorStyles.propertyItemIconWrap}
            >
                <FontIcon
                    iconName={'More'}
                    className={propertyInspectorStyles.propertyItemIcon}
                />
            </ActionButton>
        </Stack>
    );
};

export default PropertyListItem;
