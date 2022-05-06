import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyEditorTextFieldStyles
} from './OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';
import { DTDLModel } from '../../Models/Classes/DTDL';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';

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
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

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
        <div
            className={propertyInspectorStyles.enumItem}
            tabIndex={0}
            id={item.name}
        >
            <TextField
                styles={textFieldStyles}
                borderless
                placeholder={item.displayName}
                validateOnFocusOut
                onGetErrorMessage={getErrorMessage}
            />
            <Text>{item.enumValue}</Text>
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
                        deleteNestedItem={deleteNestedItem}
                        index={index}
                        parentIndex={parentIndex}
                        subMenuActive={subMenuActive}
                        duplicateItem={false}
                        addItemToTemplates={false}
                        targetId={item.name}
                        setSubMenuActive={setSubMenuActive}
                    />
                )}
            </IconButton>
        </div>
    );
};

export default PropertyListEnumItemNested;
