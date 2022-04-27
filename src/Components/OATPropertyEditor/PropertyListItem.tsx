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
    index?: number;
    deleteItem?: (index: number) => any;
    draggingProperty?: boolean;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string, index?: number) => string;
    handleDragEnter?: (event: any, item: any) => any;
    handleDragEnterExternalItem?: (index: number) => any;
    handleDragStart?: (event: any, item: any) => any;
    item?: any;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PropertyListItem = ({
    index,
    deleteItem,
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
    setModalBody
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
            <ActionButton
                onClick={() => deleteItem(index)}
                className={propertyInspectorStyles.propertyItemIconWrap}
            >
                <FontIcon
                    iconName={'ChromeClose'}
                    className={propertyInspectorStyles.propertyItemIcon}
                />
            </ActionButton>

            <TextField
                className={propertyInspectorStyles.propertyItemTextField}
                borderless
                value={item.name}
                validateOnFocusOut
                onChange={(evt, value) => {
                    setCurrentPropertyIndex(index);
                    getErrorMessage(value, index);
                }}
            />
            <Text>{item.schema}</Text>
            <ActionButton
                className={propertyInspectorStyles.propertyItemIconWrap}
                onClick={() => {
                    setCurrentPropertyIndex(index);
                    setModalOpen(true);
                    setModalBody('formProperty');
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
