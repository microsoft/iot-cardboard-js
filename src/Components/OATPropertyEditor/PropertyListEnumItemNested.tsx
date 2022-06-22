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
import { getModelPropertyCollectionName } from './Utils';

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

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const updateEnum = (value) => {
        const activeItem =
            model[propertiesKeyName][parentIndex].schema.enumValues[index];
        const prop = {
            displayName: value
        };
        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName][parentIndex].schema.enumValues[index] = {
            ...activeItem,
            ...prop
        };
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    const onGetErrorMessage = (value) => {
        const find = model[propertiesKeyName][
            parentIndex
        ].schema.enumValues.find((item) => item.name === value);
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
            id={`enum_${item.name}`}
        >
            <div></div> {/* Needed for gridTemplateColumns style  */}
            <TextField
                styles={textFieldStyles}
                borderless
                placeholder={
                    typeof item.displayName === 'string'
                        ? item.displayName
                            ? item.displayName
                            : item.name
                        : Object.values(item.displayName)[0]
                }
                validateOnFocusOut
                onGetErrorMessage={onGetErrorMessage}
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
                        targetId={`enum_${item.name}`}
                        setSubMenuActive={setSubMenuActive}
                    />
                )}
            </IconButton>
        </div>
    );
};

export default PropertyListEnumItemNested;
