import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyEditorTextFieldStyles
} from './OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { deepCopy } from '../../Models/Services/Utils';

type IEnumItem = {
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    index?: number;
    item?: any;
    parentIndex?: number;
    state?: IOATEditorState;
};

export const PropertyListEnumItemNested = ({
    deleteNestedItem,
    dispatch,
    item,
    index,
    parentIndex,
    state
}: IEnumItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const { model } = state;

    const updateEnum = (value) => {
        const activeItem = model.contents[parentIndex].schema.enumValues[index];
        const prop = {
            displayName: value
        };
        const modelCopy = deepCopy(model);
        modelCopy.contents[parentIndex].schema.enumValues[index] = {
            ...activeItem,
            ...prop
        };
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
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
