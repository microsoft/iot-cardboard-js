import React, { useState, useContext } from 'react';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
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
    SET_OAT_SELECTED_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import { IAction, DTDLProperty } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName
} from './Utils';
import { FormBody } from './Constants';

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
    onCurrentPropertyIndexChange: (index: number) => void;
    onCurrentNestedPropertyIndexChange: (index: number) => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
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
    onCurrentPropertyIndexChange,
    onCurrentNestedPropertyIndexChange,
    setModalBody,
    setModalOpen,
    state
}: IPropertyListItemNested) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);
    const { model, templates } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const onDuplicate = () => {
        const duplicate = () => {
            const itemCopy = deepCopy(item);
            itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
            itemCopy.displayName = `${itemCopy.displayName}_${t(
                'OATPropertyEditor.copy'
            )}`;
            itemCopy['@id'] = `${itemCopy['@id']}_${t(
                'OATPropertyEditor.copy'
            )}`;

            const modelCopy = deepCopy(model);
            modelCopy[propertiesKeyName][parentIndex].schema.fields.push(
                itemCopy
            );
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: modelCopy
            });
        };

        const undoDuplicate = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
        };

        execute(duplicate, undoDuplicate);
    };

    const onTemplateAddition = () => {
        const addition = () => {
            dispatch({
                type: SET_OAT_TEMPLATES,
                payload: [...templates, item]
            });
        };

        const undoAddition = () => {
            dispatch({
                type: SET_OAT_TEMPLATES,
                payload: templates
            });
        };

        execute(addition, undoAddition);
    };

    return (
        <div
            className={getItemClassName(index)}
            id={getModelPropertyListItemName(item.name)}
        >
            <div></div> {/* Needed for gridTemplateColumns style  */}
            {!displayNameEditor && (
                <Text onDoubleClick={() => setDisplayNameEditor(true)}>
                    {item.displayName}
                </Text>
            )}
            {displayNameEditor && (
                <TextField
                    styles={textFieldStyles}
                    borderless
                    placeholder={getModelPropertyListItemName(item.name)}
                    validateOnFocusOut
                    onChange={() => {
                        onCurrentPropertyIndexChange(parentIndex);
                    }}
                    onBlur={() => setDisplayNameEditor(false)}
                    onGetErrorMessage={getErrorMessage}
                />
            )}
            <Text>{item.schema}</Text>
            <IconButton
                styles={iconWrapStyles}
                iconProps={{ iconName: 'info' }}
                title={t('OATPropertyEditor.info')}
                onClick={() => {
                    onCurrentNestedPropertyIndexChange(index);
                    onCurrentPropertyIndexChange(parentIndex);
                    setModalBody(FormBody.property);
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
                        onTemplateAddition={() => {
                            onTemplateAddition();
                        }}
                        onDuplicate={() => {
                            onDuplicate();
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
