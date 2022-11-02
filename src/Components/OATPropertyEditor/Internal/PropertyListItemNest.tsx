import React, { useState, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyEditorTextFieldStyles
} from '../OATPropertyEditor.styles';
import { DTDLProperty, DTDLSchemaType } from '../../../Models/Classes/DTDL';
import { isDTDLEnum, isDTDLObject } from '../../../Models/Services/DtdlUtils';
import AddPropertyBar from './AddPropertyBar';
import PropertyListItemNested from './PropertyListItemNested';
import PropertyListEnumItemNested from './PropertyListEnumItemNested';
import PropertyListMapItemNested from './PropertyListMapItemNested';
import { deepCopy } from '../../../Models/Services/Utils';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
    SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../../Models/Constants/ActionTypes';

import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName,
    getTargetFromSelection,
    shouldClosePropertySelectorOnMouseLeave
} from '../Utils';
import { FormBody } from '../Shared/Constants';
import { PropertyListItemNestProps } from './PropertyListItemNest.types';
import {
    logDebugConsole,
    useOatPageContext
} from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

export const PropertyListItemNest: React.FC<PropertyListItemNestProps> = (
    props
) => {
    const {
        definePropertySelectorPosition,
        deleteItem,
        dispatch,
        draggingProperty,
        getErrorMessage,
        getItemClassName,
        getNestedItemClassName,
        index,
        item,
        lastPropertyFocused,
        onDragEnter,
        onDragEnterExternalItem,
        onDragStart,
        onMove: onMoveProp,
        onPropertyDisplayNameChange,
        propertiesLength,
        propertySelectorTriggerElementsBoundingBox,
        setLastPropertyFocused,
        setPropertySelectorVisible
    } = props;
    let onMove = onMoveProp;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();

    // state
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [hover, setHover] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);

    // data
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            ),
        [oatPageState.currentOntologyModels, oatPageState.selection]
    );

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : ''
    );

    const showObjectPropertySelector = useMemo(() => {
        return (
            item &&
            isDTDLObject(item) &&
            item.schema.fields &&
            (item.schema.fields.length === 0 ||
                (item.schema.fields.length > 0 && collapsed))
        );
    }, [collapsed, item.schema]);

    // callbacks
    const addPropertyCallback = () => {
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
            payload: index
        });
        if (
            !lastPropertyFocused ||
            !lastPropertyFocused.item ||
            !lastPropertyFocused.item.schema
        ) {
            return;
        }

        switch (lastPropertyFocused.item.schema['@type']) {
            case DTDLSchemaType.Object:
                setPropertySelectorVisible?.(true);
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
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_TEMPLATES,
                payload: {
                    templates: item
                        ? [...oatPageState.currentOntologyTemplates, item]
                        : [...oatPageState.currentOntologyTemplates]
                }
            });
        };

        const undoAddition = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_TEMPLATES,
                payload: { templates: oatPageState.currentOntologyTemplates }
            });
        };

        execute(addition, undoAddition);
    };

    const onDuplicate = () => {
        const duplicate = () => {
            if (!item) {
                return;
            }
            const itemCopy = deepCopy(item);
            itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
            itemCopy.displayName = `${itemCopy.displayName}_${t(
                'OATPropertyEditor.copy'
            )}`;
            itemCopy['@id'] = `${itemCopy['@id']}_${t(
                'OATPropertyEditor.copy'
            )}`;

            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                oatPageState.selection!
            );
            if (!modelCopy) {
                logDebugConsole(
                    'warn',
                    'Could not find target for the selected model. {selection}',
                    oatPageState.selection
                );
                return;
            }

            modelCopy[propertiesKeyName].push(itemCopy);
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: modelsCopy }
            });
        };

        const undoDuplicate = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(duplicate, undoDuplicate);
    };

    const deleteNestedItem = (parentIndex, index) => {
        const deletion = (parentIndex, index) => {
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                oatPageState.selection!
            );
            if (!modelCopy) {
                logDebugConsole(
                    'warn',
                    'Could not find target for the selected model. {selection}',
                    oatPageState.selection
                );
                return;
            }

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
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS,
                    payload: { models: modelsCopy }
                });
            };
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(() => deletion(parentIndex, index), undoDeletion);
    };

    // Move nested item up or down
    const moveNestedItem = (nestedIndex: number, moveUp: boolean) => {
        onMove = (nestedIndex, moveUp) => {
            const parentIndex = index;
            const direction = moveUp ? -1 : 1;
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                oatPageState.selection!
            );
            if (!modelCopy) {
                return;
            }

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

            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: modelsCopy }
            });
        };

        const undoOnMove = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(() => onMove?.(nestedIndex, moveUp), undoOnMove);
    };

    const onAddPropertyBarMouseOver = (e) => {
        setLastPropertyFocused?.({
            item: item,
            index: index
        });
        setPropertySelectorVisible?.(true);
        addPropertyCallback();
        definePropertySelectorPosition?.(e);
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
                setLastPropertyFocused?.({
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
                    setPropertySelectorVisible?.(false);
                }
            }}
        >
            <div
                className={getItemClassName?.(index)}
                draggable
                onDragStart={(e) => {
                    onDragStart?.(e, index);
                }}
                onDragEnter={
                    draggingProperty
                        ? (e) => onDragEnter?.(e, index)
                        : () => onDragEnterExternalItem?.(index)
                }
                onFocus={() => {
                    setLastPropertyFocused?.({
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
                            {item && item.displayName
                                ? item.displayName
                                : item && item.name
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
                                onPropertyDisplayNameChange?.(value, index);
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
                    {(isDTDLObject(item) && item.schema.fields.length > 0) ||
                    (isDTDLEnum(item) && item.schema.enumValues.length > 0) ? (
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
                                    index > 0 ? onMove : () => undefined
                                }
                                onMoveDown={
                                    // Use function if item is not the last item in the list
                                    index < propertiesLength - 1
                                        ? onMove
                                        : () => undefined
                                }
                            />
                        )}
                    </IconButton>
                </div>
                {collapsed &&
                    isDTDLObject(item) &&
                    item.schema.fields.length > 0 &&
                    item.schema.fields.map((field, i) => (
                        <PropertyListItemNested
                            key={i}
                            item={field as DTDLProperty}
                            parentIndex={index}
                            index={i}
                            getItemClassName={getNestedItemClassName}
                            deleteNestedItem={deleteNestedItem}
                            dispatch={dispatch}
                            onMove={moveNestedItem}
                            collectionLength={item.schema.fields.length}
                        />
                    ))}

                {collapsed &&
                    item &&
                    isDTDLEnum(item) &&
                    item.schema.enumValues.length > 0 &&
                    item.schema.enumValues.map((collectionItem, i) => (
                        <PropertyListEnumItemNested
                            key={i}
                            item={collectionItem}
                            dispatch={dispatch}
                            parentIndex={index}
                            index={i}
                            deleteNestedItem={deleteNestedItem}
                            onMove={moveNestedItem}
                            collectionLength={item.schema.enumValues.length}
                        />
                    ))}

                {collapsed && item.schema['@type'] === DTDLSchemaType.Map && (
                    <PropertyListMapItemNested item={item} index={index} />
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
