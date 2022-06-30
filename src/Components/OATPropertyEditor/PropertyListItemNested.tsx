import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyEditorTextFieldStyles,
    getPropertyListItemIconWrapStyles,
    getPropertyListItemIconWrapMoreStyles
} from './OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { deepCopy } from '../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import { IAction, DTDLProperty } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName
} from './Utils';

type IPropertyListItemNested = {
    collectionLength?: number;
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string) => string;
    index?: number;
    item?: DTDLProperty;
    onMove?: (index: number, moveUp: boolean) => void;
    parentIndex?: number;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
};

export const PropertyListItemNested = ({
    collectionLength,
    deleteNestedItem,
    dispatch,
    getErrorMessage,
    getItemClassName,
    index,
    item,
    onMove,
    parentIndex,
    setCurrentNestedPropertyIndex,
    setCurrentPropertyIndex,
    setModalOpen,
    state
}: IPropertyListItemNested) => {
    const { t } = useTranslation();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const { model, templates } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const handleDuplicate = () => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
        itemCopy.displayName = `${itemCopy.displayName}_${t(
            'OATPropertyEditor.copy'
        )}`;
        itemCopy['@id'] = `${itemCopy['@id']}_${t('OATPropertyEditor.copy')}`;

        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName][parentIndex].schema.fields.push(itemCopy);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    const handleTemplateAddition = () => {
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: [...templates.item]
        });
    };

    return (
        <div
            className={getItemClassName(index)}
            id={getModelPropertyListItemName(item.name)}
        >
            <div></div> {/* Needed for gridTemplateColumns style  */}
            <TextField
                styles={textFieldStyles}
                borderless
                placeholder={getModelPropertyListItemName(item.name)}
                validateOnFocusOut
                onChange={() => {
                    setCurrentPropertyIndex(parentIndex);
                }}
                onGetErrorMessage={getErrorMessage}
            />
            <Text>{item.schema}</Text>
            <IconButton
                styles={iconWrapStyles}
                iconProps={{ iconName: 'info' }}
                title={t('OATPropertyEditor.info')}
                onClick={() => {
                    setCurrentNestedPropertyIndex(index);
                    setCurrentPropertyIndex(parentIndex);
                    setModalOpen(true);
                }}
            />
            <IconButton
                styles={iconWrapMoreStyles}
                iconProps={{ iconName: 'more' }}
                title={t('OATPropertyEditor.more')}
                onClick={() => setSubMenuActive(!subMenuActive)}
            >
                {subMenuActive && (
                    <PropertyListItemSubMenu
                        deleteNestedItem={deleteNestedItem}
                        index={index}
                        parentIndex={parentIndex}
                        subMenuActive={subMenuActive}
                        handleTemplateAddition={() => {
                            handleTemplateAddition();
                        }}
                        handleDuplicate={() => {
                            handleDuplicate();
                        }}
                        targetId={getModelPropertyListItemName(item.name)}
                        setSubMenuActive={setSubMenuActive}
                        onMoveUp={
                            // Use function if item is not the first item in the list
                            index > 0 ? onMove : null
                        }
                        onMoveDown={
                            // Use function if item is not the last item in the list
                            index < collectionLength - 1 ? onMove : null
                        }
                    />
                )}
            </IconButton>
        </div>
    );
};

export default PropertyListItemNested;
