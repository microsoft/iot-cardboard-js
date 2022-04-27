import React from 'react';
import {
    TextField,
    Stack,
    Text,
    ActionButton,
    FontIcon
} from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';
import { DTDLModel } from '../../Models/Classes/DTDL';

type IEnumItem = {
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    index?: number;
    item?: any;
    model?: DTDLModel;
    parentIndex?: number;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
};

export const PropertyListEnumItemNested = ({
    deleteNestedItem,
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
            <ActionButton
                onClick={() => deleteNestedItem(parentIndex, index)}
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
                placeholder={item.displayName}
                validateOnFocusOut
                onGetErrorMessage={getErrorMessage}
            />
            <Text>{item.enumValue}</Text>
        </Stack>
    );
};

export default PropertyListEnumItemNested;
