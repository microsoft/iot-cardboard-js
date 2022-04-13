import React from 'react';
import {
    FontIcon,
    TextField,
    ActionButton,
    Stack,
    Text
} from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

type IPropertyListItemNested = {
    index?: any;
    parentIndex?: any;
    getItemClassName?: any;
    getErrorMessage?: any;
    handleDragEnter?: any;
    handleDragEnterExternalItem?: any;
    handleDragStart?: any;
    setCurrentPropertyIndex?: any;
    setModalOpen?: any;
    item?: any;
    setLastPropertyFocused?: any;
    setCurrentNestedPropertyIndex: any;
};

export const PropertyListItemNested = ({
    index,
    parentIndex,
    getItemClassName,
    getErrorMessage,
    setCurrentPropertyIndex,
    setModalOpen,
    item,
    setCurrentNestedPropertyIndex
}: IPropertyListItemNested) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <Stack className={getItemClassName(index)} tabIndex={0}>
            <TextField
                className={propertyInspectorStyles.propertyItemTextField}
                borderless
                placeholder={item.name}
                validateOnFocusOut
                onChange={() => {
                    setCurrentPropertyIndex(parentIndex);
                }}
                onGetErrorMessage={getErrorMessage}
            />
            <Text>{item.schema}</Text>
            <ActionButton
                className={propertyInspectorStyles.propertyItemIconWrap}
                onClick={() => {
                    setCurrentNestedPropertyIndex(index);
                    setCurrentPropertyIndex(parentIndex);
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

export default PropertyListItemNested;
