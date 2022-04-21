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
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string) => string;
    handleDragEnter?: (event: any, item: any) => any;
    handleDragEnterExternalItem?: (index: number) => any;
    handleDragStart?: (event: any, item: any) => any;
    index?: number;
    item?: any;
    parentIndex?: number;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PropertyListItemNested = ({
    getErrorMessage,
    getItemClassName,
    index,
    item,
    parentIndex,
    setCurrentNestedPropertyIndex,
    setCurrentPropertyIndex,
    setModalOpen
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
