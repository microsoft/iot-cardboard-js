import React, { useRef, useState, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { FontIcon, ActionButton, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItem from './PropertyListItem';
import PropertyListItemNest from './PropertyListItemNest';
import PropertySelector from './PropertySelector';
import AddPropertyBar from './AddPropertyBar';
import {
    SET_OAT_CONFIRM_DELETE_OPEN,
    SET_OAT_MODELS,
    SET_OAT_PROPERTY_EDITOR_DRAGGING_PROPERTY,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import {
    getModelPropertyCollectionName,
    getTargetFromSelection,
    shouldClosePropertySelectorOnMouseLeave
} from './Utils';
import { PropertyListProps } from './PropertyList.types';

export const PropertyList = ({
    enteredPropertyRef,
    enteredTemplateRef,
    dispatch,
    state,
    propertyList,
    isSupportedModelType
}: PropertyListProps) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const draggedPropertyItemRef = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
    const [lastPropertyFocused, setLastPropertyFocused] = useState(null);
    const dragItem = useRef(null);
    const dragNode = useRef(null);
    const dragEnteredItem = useRef(null);
    const addPropertyLabelRef = useRef(null);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const [propertySelectorPosition, setPropertySelectorPosition] = useState({
        left: 0,
        top: 0
    });
    const [
        propertySelectorTriggerElementsBoundingBox,
        setPropertySelectorTriggerElementsBoundingBox
    ] = useState(null);
    const {
        selection,
        models,
        templates,
        currentPropertyIndex,
        draggingTemplate,
        draggingProperty
    } = state;
    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const onPropertyItemDropOnTemplateList = () => {
        const newTemplate = templates ? deepCopy(templates) : [];
        newTemplate.push(
            model[propertiesKeyName][draggedPropertyItemRef.current]
        );
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: newTemplate
        });
    };

    const onDragEnd = () => {
        if (enteredTemplateRef.current !== null) {
            onPropertyItemDropOnTemplateList();
        }

        const modelsCopy = deepCopy(models);
        const modelCopy = getTargetFromSelection(modelsCopy, selection);
        //  Replace entered item with dragged item
        // --> Remove dragged item from model and then place it on entered item's position
        modelCopy[propertiesKeyName].splice(
            dragEnteredItem.current,
            0,
            modelCopy[propertiesKeyName].splice(dragItem.current, 1)[0]
        );
        dispatch({
            type: SET_OAT_MODELS,
            payload: modelsCopy
        });

        dragNode.current.removeEventListener('dragend', onDragEnd);
        dragItem.current = null;
        dragNode.current = null;
        draggedPropertyItemRef.current = null;
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_DRAGGING_PROPERTY,
            payload: false
        });
        enteredTemplateRef.current = null;
    };

    const onDragEnter = (e, i) => {
        if (e.target !== dragNode.current) {
            //  Entered item is not the same as dragged node
            dragEnteredItem.current = i;
        }
    };

    const onDragStart = (e, propertyIndex) => {
        dragItem.current = propertyIndex;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', onDragEnd);
        draggedPropertyItemRef.current = propertyIndex;
        //  Allows style to change after drag has started
        setTimeout(() => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_DRAGGING_PROPERTY,
                payload: true
            });
        }, 0);
    };

    const getNestItemClassName = () => {
        return propertyInspectorStyles.propertyItemNest;
    };

    const getNestedItemClassName = () => {
        return propertyInspectorStyles.propertyItemNested;
    };

    const getItemClassName = (propertyIndex) => {
        if (propertyIndex === dragItem.current && draggingProperty) {
            return propertyInspectorStyles.propertyItemDragging;
        }
        if (propertyIndex === enteredItem && draggingTemplate) {
            return propertyInspectorStyles.propertyItemEntered;
        }

        return propertyInspectorStyles.propertyItem;
    };

    const onDragEnterExternalItem = (i) => {
        setEnteredItem(i);
        enteredPropertyRef.current = i;
    };

    const onPropertyDisplayNameChange = (value, index) => {
        const update = () => {
            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            if (index === undefined) {
                modelCopy[propertiesKeyName][currentPropertyIndex].name = value;
            } else {
                modelCopy[propertiesKeyName][index].name = value;
            }
            dispatch({
                type: SET_OAT_MODELS,
                payload: modelsCopy
            });
        };

        const undoUpdate = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
        };

        execute(update, undoUpdate);
    };

    const generateErrorMessage = (value, index) => {
        if (value) {
            const find = model[propertiesKeyName].find(
                (item) => item.name === value
            );

            if (!find && value !== '') {
                onPropertyDisplayNameChange(value, index);
            }

            return find
                ? `${t('OATPropertyEditor.errorRepeatedPropertyName')}`
                : '';
        }
    };

    const deleteItem = (index) => {
        setLastPropertyFocused(null);

        const deletion = (index) => {
            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            modelCopy[propertiesKeyName].splice(index, 1);
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

        execute(() => deletion(index), undoDeletion);
    };

    const definePropertySelectorPosition = (e, top = null) => {
        if (e) {
            const boundingRect = e.target.getBoundingClientRect();
            setPropertySelectorPosition({
                ...propertySelectorPosition,
                top: top ? top : boundingRect.top,
                left: boundingRect.left
            });
            setPropertySelectorTriggerElementsBoundingBox(boundingRect);
        }
    };

    const onMouseLeave = (e) => {
        if (
            shouldClosePropertySelectorOnMouseLeave(
                e,
                propertySelectorTriggerElementsBoundingBox
            )
        ) {
            setPropertySelectorVisible(false);
        }
    };

    const onPropertyBarMouseOver = (e) => {
        setPropertySelectorVisible(true);
        setLastPropertyFocused(null);
        definePropertySelectorPosition(e);
    };

    const onAddPropertyLabelMouseOver = (e) => {
        setPropertySelectorVisible(true);
        setLastPropertyFocused(null);

        const buttonTop = addPropertyLabelRef.current.getBoundingClientRect()
            .top;
        definePropertySelectorPosition(e, buttonTop);
    };

    const moveItemOnPropertyList = (index: number, moveUp: boolean) => {
        const onMove = (index, moveUp) => {
            const direction = moveUp ? -1 : 1;
            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            const item = modelCopy[propertiesKeyName][index];
            modelCopy[propertiesKeyName].splice(index, 1);
            modelCopy[propertiesKeyName].splice(index + direction, 0, item);
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

        execute(() => onMove(index, moveUp), undoOnMove);
    };

    return (
        <div className={propertyInspectorStyles.propertiesWrap}>
            {isSupportedModelType && propertyList && propertyList.length === 0 && (
                <div
                    className={propertyInspectorStyles.addPropertyMessageWrap}
                    onMouseOver={(e) => {
                        onAddPropertyLabelMouseOver(e);
                    }}
                    onMouseLeave={(e) => {
                        onMouseLeave(e);
                    }}
                    ref={addPropertyLabelRef}
                >
                    <ActionButton
                        onClick={(e) => {
                            if (propertySelectorVisible) {
                                setPropertySelectorVisible(false);
                            } else {
                                onAddPropertyLabelMouseOver(e);
                            }
                        }}
                    >
                        <FontIcon
                            iconName={'CirclePlus'}
                            className={propertyInspectorStyles.iconAddProperty}
                        />
                        <Text>{t('OATPropertyEditor.addProperty')}</Text>
                    </ActionButton>
                </div>
            )}

            {propertyList &&
                propertyList.map((item, i) => {
                    if (typeof item.schema === 'object') {
                        return (
                            <PropertyListItemNest
                                key={i}
                                index={i}
                                draggingProperty={draggingProperty}
                                getItemClassName={getNestItemClassName}
                                getNestedItemClassName={getNestedItemClassName}
                                getErrorMessage={generateErrorMessage}
                                onPropertyDisplayNameChange={
                                    onPropertyDisplayNameChange
                                }
                                onDragEnter={onDragEnter}
                                onDragEnterExternalItem={
                                    onDragEnterExternalItem
                                }
                                onDragStart={onDragStart}
                                item={item}
                                lastPropertyFocused={lastPropertyFocused}
                                setLastPropertyFocused={setLastPropertyFocused}
                                dispatch={dispatch}
                                state={state}
                                deleteItem={deleteItem}
                                setPropertySelectorVisible={
                                    setPropertySelectorVisible
                                }
                                propertySelectorTriggerElementsBoundingBox={
                                    propertySelectorTriggerElementsBoundingBox
                                }
                                definePropertySelectorPosition={
                                    definePropertySelectorPosition
                                }
                                onMove={moveItemOnPropertyList}
                                propertiesLength={
                                    model[propertiesKeyName].length
                                }
                            />
                        );
                    } else {
                        return (
                            <PropertyListItem
                                key={i}
                                index={i}
                                draggingProperty={draggingProperty}
                                getItemClassName={getItemClassName}
                                getErrorMessage={generateErrorMessage}
                                onPropertyDisplayNameChange={
                                    onPropertyDisplayNameChange
                                }
                                onDragEnter={onDragEnter}
                                onDragEnterExternalItem={
                                    onDragEnterExternalItem
                                }
                                onDragStart={onDragStart}
                                item={item}
                                setLastPropertyFocused={setLastPropertyFocused}
                                deleteItem={deleteItem}
                                dispatch={dispatch}
                                state={state}
                                onMove={moveItemOnPropertyList}
                                propertiesLength={
                                    model[propertiesKeyName].length
                                }
                            />
                        );
                    }
                })}

            {propertyList && propertyList.length > 0 && (
                <div
                    className={
                        propertyInspectorStyles.addPropertyBarPropertyListWrap
                    }
                    onMouseLeave={(e) => {
                        onMouseLeave(e);
                    }}
                >
                    <AddPropertyBar onMouseOver={onPropertyBarMouseOver} />
                </div>
            )}

            <PropertySelector
                setPropertySelectorVisible={setPropertySelectorVisible}
                lastPropertyFocused={lastPropertyFocused}
                dispatch={dispatch}
                state={state}
                propertySelectorPosition={propertySelectorPosition}
                className={
                    propertySelectorVisible
                        ? ''
                        : propertyInspectorStyles.propertySelectorHidden
                }
            />
        </div>
    );
};

export default PropertyList;
