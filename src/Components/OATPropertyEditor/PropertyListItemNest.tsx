import React, { useState, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyEditorTextFieldStyles
} from './OATPropertyEditor.styles';
import { DTDLSchemaType } from '../../Models/Classes/DTDL';
import AddPropertyBar from './AddPropertyBar';
import PropertyListItemNested from './PropertyListItemNested';
import PropertyListEnumItemNested from './PropertyListEnumItemNested';
import PropertyListMapItemNested from './PropertyListMapItemNested';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_CONFIRM_DELETE_OPEN,
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
    getTargetFromSelection,
    shouldClosePropertySelectorOnMouseLeave
} from './Utils';
import { FormBody } from './Constants';
import { PropertyListItemNestProps } from './PropertyListItemNest.types';

export const PropertyListItemNest = ({
    index,
    deleteItem,
    dispatch,
    draggingProperty,
    getItemClassName,
    getNestedItemClassName,
    getErrorMessage,
    onDragEnter,
    onDragEnterExternalItem,
    onDragStart,
    onPropertyDisplayNameChange,
    item,
    lastPropertyFocused,
    setLastPropertyFocused,
    state,
    setPropertySelectorVisible,
    definePropertySelectorPosition,
    propertySelectorTriggerElementsBoundingBox,
    onMove,
    propertiesLength
}: PropertyListItemNestProps) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [hover, setHover] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);
    const { models, selection, templates } = state;
    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const addPropertyCallback = () => {
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
            payload: index
        });
        if (!lastPropertyFocused) {
            return;
        }

        switch (lastPropertyFocused.item.schema['@type']) {
            case DTDLSchemaType.Object:
                setPropertySelectorVisible(true);
                return;
            case DTDLSchemaType.Enum:
                dispatch({
                    type: SET_OAT_PROPERTY_MODAL_BODY,
                    payload: FormBody.enum
                });
                dispatch({
                    type: SET_OAT_PROPERTY_MODAL_OPEN,
                    payload: true
                });
                return;
            default:
                return;
        }
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
            modelCopy[propertiesKeyName].push(itemCopy);
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

    const deleteNestedItem = (parentIndex, index) => {
        const deletion = (parentIndex, index) => {
            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            if (
                modelCopy[propertiesKeyName][parentIndex].schema['@type'] ===
                DTDLSchemaType.Enum
            ) {
                modelCopy[propertiesKeyName][
                    parentIndex
                ].schema.enumValues.splice(index, 1);
            } else if (
                modelCopy[propertiesKeyName][parentIndex].schema['@type'] ===
                DTDLSchemaType.Object
            ) {
                modelCopy[propertiesKeyName][parentIndex].schema.fields.splice(
                    index,
                    1
                );
            }

            const dispatchDelete = () => {
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: modelsCopy
                });
            };
            dispatch({
                type: SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
        };

        execute(() => deletion(parentIndex, index), undoDeletion);
    };

    // Move nested item up or down
    const moveNestedItem = (nestedIndex: number, moveUp: boolean) => {
        onMove = (nestedIndex, moveUp) => {
            const parentIndex = index;
            const direction = moveUp ? -1 : 1;
            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            const collectionAttributeName =
                modelCopy[propertiesKeyName][parentIndex].schema['@type'] ===
                DTDLSchemaType.Enum
                    ? 'enumValues'
                    : 'fields';
            // Move nested item up or down
            const temp =
                modelCopy[propertiesKeyName][parentIndex].schema[
                    collectionAttributeName
                ][nestedIndex];
            modelCopy[propertiesKeyName][parentIndex].schema[
                collectionAttributeName
            ].splice(nestedIndex, 1);
            modelCopy[propertiesKeyName][parentIndex].schema[
                collectionAttributeName
            ].splice(nestedIndex + direction, 0, temp);

            dispatch({
                type: SET_OAT_MODELS,
                payload: modelsCopy
            });
        };

        const undoOnMove = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
        };

        execute(() => onMove(nestedIndex, moveUp), undoOnMove);
    };

    const showObjectPropertySelector = useMemo(() => {
        return (
            item.schema['@type'] === DTDLSchemaType.Object &&
            (item.schema.fields.length === 0 ||
                (item.schema.fields.length > 0 && collapsed))
        );
    }, [collapsed]);

    const onAddPropertyBarMouseOver = (e) => {
        setLastPropertyFocused({
            item: item,
            index: index
        });
        setPropertySelectorVisible(true);
        addPropertyCallback();
        definePropertySelectorPosition(e);
    };

    const onInfoButtonClick = () => {
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
            payload: null
        });

        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
            payload: index
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
            className={propertyInspectorStyles.propertyListRelativeWrap}
            onMouseOver={() => {
                setHover(true);
                setLastPropertyFocused({
                    item: item,
                    index: index
                });
            }}
            onMouseLeave={(e) => {
                setHover(false);
                if (
                    shouldClosePropertySelectorOnMouseLeave(
                        e,
                        propertySelectorTriggerElementsBoundingBox
                    )
                ) {
                    setPropertySelectorVisible(false);
                }
            }}
        >
            <div
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
                onFocus={() => {
                    setLastPropertyFocused({
                        item: item,
                        index: index
                    });
                }}
                tabIndex={0}
            >
                <div
                    className={propertyInspectorStyles.propertyItemNestMainItem}
                >
                    {!displayNameEditor && (
                        <Text onDoubleClick={() => setDisplayNameEditor(true)}>
                            {item.displayName
                                ? item.displayName
                                : item.name
                                ? item.name
                                : ''}
                        </Text>
                    )}
                    {displayNameEditor && (
                        <TextField
                            styles={textFieldStyles}
                            borderless
                            placeholder={getModelPropertyListItemName(
                                item.name
                            )}
                            validateOnFocusOut
                            onChange={(_, value) => {
                                dispatch({
                                    type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
                                    payload: index
                                });
                                onPropertyDisplayNameChange(value, index);
                            }}
                            onGetErrorMessage={getErrorMessage}
                            onBlur={() => setDisplayNameEditor(false)}
                        />
                    )}
                    <Text
                        className={propertyInspectorStyles.propertyItemTypeText}
                    >
                        {item.schema['@type']}
                    </Text>
                    {(item.schema['@type'] === DTDLSchemaType.Object &&
                        item.schema.fields.length > 0) ||
                    (item.schema['@type'] === DTDLSchemaType.Enum &&
                        item.schema.enumValues.length > 0) ? (
                        <IconButton
                            iconProps={{
                                iconName: collapsed
                                    ? 'ChevronDown'
                                    : 'ChevronRight'
                            }}
                            styles={iconWrapMoreStyles}
                            title={t('OATPropertyEditor.collapse')}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    ) : (
                        <div>{/* Needed for gridTemplateColumns style  */}</div>
                    )}
                    <IconButton
                        iconProps={{ iconName: 'info' }}
                        styles={iconWrapMoreStyles}
                        title={t('OATPropertyEditor.info')}
                        onClick={onInfoButtonClick}
                    />

                    <IconButton
                        iconProps={{
                            iconName: 'more'
                        }}
                        styles={iconWrapMoreStyles}
                        title={t('OATPropertyEditor.more')}
                        onClick={() => setSubMenuActive(!subMenuActive)}
                        id={getModelPropertyListItemName(item.name)}
                    >
                        {subMenuActive && (
                            <PropertyListItemSubMenu
                                deleteItem={deleteItem}
                                index={index}
                                subMenuActive={subMenuActive}
                                onTemplateAddition={() => {
                                    onTemplateAddition();
                                }}
                                onDuplicate={onDuplicate}
                                setSubMenuActive={setSubMenuActive}
                                targetId={getModelPropertyListItemName(
                                    item.name
                                )}
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
                {collapsed &&
                    item.schema['@type'] === DTDLSchemaType.Object &&
                    item.schema.fields.length > 0 &&
                    item.schema.fields.map((field, i) => (
                        <PropertyListItemNested
                            key={i}
                            item={field}
                            parentIndex={index}
                            index={i}
                            getItemClassName={getNestedItemClassName}
                            deleteNestedItem={deleteNestedItem}
                            dispatch={dispatch}
                            state={state}
                            onMove={moveNestedItem}
                            collectionLength={item.schema.fields.length}
                        />
                    ))}

                {collapsed &&
                    item &&
                    item.schema['@type'] === DTDLSchemaType.Enum &&
                    item.schema.enumValues.length > 0 &&
                    item.schema.enumValues.map((collectionItem, i) => (
                        <PropertyListEnumItemNested
                            key={i}
                            item={collectionItem}
                            dispatch={dispatch}
                            state={state}
                            parentIndex={index}
                            index={i}
                            deleteNestedItem={deleteNestedItem}
                            onMove={moveNestedItem}
                            collectionLength={item.schema.enumValues.length}
                        />
                    ))}

                {collapsed && item.schema['@type'] === DTDLSchemaType.Map && (
                    <PropertyListMapItemNested
                        item={item}
                        dispatch={dispatch}
                        state={state}
                        index={index}
                    />
                )}
            </div>
            {showObjectPropertySelector && (
                <AddPropertyBar
                    onMouseOver={onAddPropertyBarMouseOver}
                    classNameIcon={
                        propertyInspectorStyles.addPropertyBarIconNestItem
                    }
                />
            )}
            {hover && item.schema['@type'] === DTDLSchemaType.Enum && (
                <AddPropertyBar
                    onClick={() => {
                        addPropertyCallback();
                    }}
                    classNameIcon={
                        propertyInspectorStyles.addPropertyBarIconNestItem
                    }
                />
            )}
        </div>
    );
};

export default PropertyListItemNest;
