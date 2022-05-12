import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyEditorTextFieldStyles,
    getPropertyListItemIconWrapStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyInspectorStyles
} from './OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { deepCopy } from '../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import {
    IAction,
    IOATLastPropertyFocused,
    DTDLProperty
} from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import AddPropertyBar from './AddPropertyBar';
import PropertySelector from './PropertySelector';

type IPropertyListItemNested = {
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string) => string;
    index?: number;
    item?: DTDLProperty;
    parentIndex?: number;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
    lastPropertyFocused?: IOATLastPropertyFocused;
};

export const PropertyListItemNested = ({
    deleteNestedItem,
    dispatch,
    getErrorMessage,
    getItemClassName,
    index,
    item,
    parentIndex,
    setCurrentNestedPropertyIndex,
    setCurrentPropertyIndex,
    setModalOpen,
    state,
    lastPropertyFocused
}: IPropertyListItemNested) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [hover, setHover] = useState(false);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const { model, templates } = state;

    const handleDuplicate = () => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
        itemCopy.displayName = `${itemCopy.displayName}_${t(
            'OATPropertyEditor.copy'
        )}`;
        itemCopy['@id'] = `${itemCopy['@id']}_${t('OATPropertyEditor.copy')}`;

        const modelCopy = deepCopy(model);
        modelCopy.contents[parentIndex].schema.fields.push(itemCopy);
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
            className={propertyInspectorStyles.propertyNestedItemRelativeWrap}
            onMouseOver={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
            <div className={getItemClassName(index)} id={item.name}>
                <div></div> {/* Needed for gridTemplateColumns style  */}
                <TextField
                    styles={textFieldStyles}
                    borderless
                    placeholder={item.name}
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
                            targetId={item.name}
                            setSubMenuActive={setSubMenuActive}
                        />
                    )}
                </IconButton>
            </div>
            {propertySelectorVisible && (
                <PropertySelector
                    setPropertySelectorVisible={setPropertySelectorVisible}
                    lastPropertyFocused={lastPropertyFocused}
                    targetId={item.name}
                    dispatch={dispatch}
                    state={state}
                    className={
                        propertyInspectorStyles.propertySelectorPropertyListHeader
                    }
                />
            )}
            {hover && (
                <AddPropertyBar
                    onMouseOver={() => {
                        setPropertySelectorVisible(true);
                    }}
                />
            )}
        </div>
    );
};

export default PropertyListItemNested;
