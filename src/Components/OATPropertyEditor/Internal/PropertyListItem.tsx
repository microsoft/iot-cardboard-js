import React, { useState, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyEditorTextFieldStyles,
    getPropertyListItemIconWrapStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyInspectorStyles
} from '../OATPropertyEditor.styles';
import { deepCopy } from '../../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../../Models/Constants/ActionTypes';

import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName,
    getTargetFromSelection
} from '../Utils';
import { FormBody } from '../Shared/Constants';
import { PropertyListItemProps } from './PropertyListItem.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

export const PropertyListItem: React.FC<PropertyListItemProps> = (props) => {
    const {
        index,
        deleteItem,
        dispatch,
        draggingProperty,
        getItemClassName,
        onDragEnter,
        onDragEnterExternalItem,
        onDragStart,
        onPropertyDisplayNameChange,
        onMove,
        propertiesLength,
        item,
        setLastPropertyFocused
    } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);

    // data
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(oatPageState.models, oatPageState.selection),
        [oatPageState.models, oatPageState.selection]
    );
    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const onTemplateAddition = () => {
        const addition = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_TEMPLATES,
                payload: { templates: [...oatPageState.templates, item] }
            });
        };

        const undoAddition = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_TEMPLATES,
                payload: { templates: oatPageState.templates }
            });
        };

        execute(addition, undoAddition);
    };

    const onDuplicate = () => {
        const duplicate = () => {
            const modelsCopy = deepCopy(oatPageState.models);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                oatPageState.selection
            );
            const itemCopy = deepCopy(item);
            if (itemCopy.name) {
                itemCopy.name = `${itemCopy.name}_${t(
                    'OATPropertyEditor.copy'
                )}`;
            }
            if (itemCopy.displayName) {
                itemCopy.displayName = `${itemCopy.displayName}_${t(
                    'OATPropertyEditor.copy'
                )}`;
            }
            if (itemCopy['@id']) {
                delete itemCopy['@id'];
            }

            modelCopy[propertiesKeyName].push(itemCopy);
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: modelsCopy }
            });
        };

        const undoDuplicate = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: oatPageState.models }
            });
        };

        execute(duplicate, undoDuplicate);
    };

    const onInfoButtonClick = () => {
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
            payload: index
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_BODY,
            payload: FormBody.property
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_OPEN,
            payload: true
        });
    };

    const onNameChange = (value) => {
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
            payload: index
        });
        onPropertyDisplayNameChange(value, index);
    };

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();

    return (
        <div
            className={propertyInspectorStyles.propertyListRelativeWrap}
            onMouseOver={() => {
                setLastPropertyFocused({
                    item: item,
                    index: index
                });
            }}
        >
            <div
                id={getModelPropertyListItemName(item.name)}
                className={getItemClassName(index)}
                draggable
                onDragStart={(e) => {
                    onDragStart(e, index);
                }}
                onDragEnter={
                    draggingProperty
                        ? (e) => onDragEnter(e, index)
                        : () => onDragEnterExternalItem(index)
                }
                onFocus={() =>
                    setLastPropertyFocused({
                        item: item,
                        index: index
                    })
                }
                tabIndex={0}
            >
                {!displayNameEditor && (
                    <Text onDoubleClick={() => setDisplayNameEditor(true)}>
                        {getModelPropertyListItemName(item.name)}
                    </Text>
                )}
                {displayNameEditor && (
                    <TextField
                        borderless
                        value={getModelPropertyListItemName(item.name)}
                        validateOnFocusOut
                        onChange={(evt, value) => {
                            onNameChange(value);
                        }}
                        onBlur={() => setDisplayNameEditor(false)}
                        styles={textFieldStyles}
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
                            deleteItem={deleteItem}
                            index={index}
                            subMenuActive={subMenuActive}
                            onTemplateAddition={onTemplateAddition}
                            onDuplicate={onDuplicate}
                            targetId={getModelPropertyListItemName(item.name)}
                            setSubMenuActive={setSubMenuActive}
                            onMoveUp={
                                // Use function if item is not the first item in the list
                                index > 0 ? onMove : null
                            }
                            onMoveDown={
                                // Use function if item is not the last item in the list
                                index < propertiesLength - 1 ? onMove : null
                            }
                        />
                    )}
                </IconButton>
            </div>
        </div>
    );
};

export default PropertyListItem;
