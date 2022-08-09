import React, { useState, useContext, useMemo } from 'react';
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
    SET_OAT_MODELS,
    SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
    SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';

import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName,
    getTargetFromSelection
} from './Utils';
import { FormBody } from './Constants';
import { PropertyListItemNestedProps } from './PropertyListItemNested.types';

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
    state
}: PropertyListItemNestedProps) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);
    const { models, selection, templates } = state;
    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );

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

            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            modelCopy[propertiesKeyName][parentIndex].schema.fields.push(
                itemCopy
            );
            dispatch({
                type: SET_OAT_MODELS,
                payload: modelsCopy
            });
        };

        const undoDuplicate = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
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

    const onInfoButtonClick = () => {
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
            payload: index
        });
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
            payload: parentIndex
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_OPEN,
            payload: true
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_BODY,
            payload: FormBody.property
        });
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
                        dispatch({
                            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
                            payload: parentIndex
                        });
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
                onClick={onInfoButtonClick}
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
