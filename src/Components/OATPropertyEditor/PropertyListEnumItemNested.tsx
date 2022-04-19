import React from 'react';
import { TextField, Stack, Text } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';

type IEnumItem = {
    index?: number;
    item?: any;
    model?: any;
    parentIndex?: number;
    setModel?: React.Dispatch<React.SetStateAction<any>>;
};

export const PropertyListEnumItemNested = ({
    item,
    model,
    setModel,
    index,
    parentIndex
}: IEnumItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const updateEnum = (value) => {
        const activeItem = model.contents[parentIndex].schema.enumValues[index];
        const prop = {
            displayName: value
        };
        const modelCopy = Object.assign({}, model);
        modelCopy.contents[parentIndex].schema.enumValues[index] = {
            ...activeItem,
            ...prop
        };
        setModel(modelCopy);
    };

    const getErrorMessage = (value) => {
        const find = model.contents[parentIndex].schema.enumValues.find(
            (item) => item.name === value
        );
        if (!find && value !== '') {
            updateEnum(value);
        }

        return find
            ? `${t('OATPropertyEditor.errorRepeatedPropertyName')}`
            : '';
    };

    return (
        <Stack className={propertyInspectorStyles.enumItem} tabIndex={0}>
            <TextField
                className={propertyInspectorStyles.propertyItemTextField}
                borderless
                placeholder={item.displayName}
                validateOnFocusOut
                onGetErrorMessage={getErrorMessage}
            />
            <Text>{item.enumValue}</Text>
        </Stack>
    );
};

export default PropertyListEnumItemNested;
