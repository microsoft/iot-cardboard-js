import React, { useRef, useState, useContext } from 'react';
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
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import { DTDLProperty, IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    getModelPropertyCollectionName,
    shouldClosePropertySelectorOnMouseLeave
} from './Utils';

type IPropertyList = {
    currentPropertyIndex: number;
    draggingProperty: boolean;
    draggingTemplate: boolean;
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    isSupportedModelType: boolean;
    propertyList?: DTDLProperty[];
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setDraggingProperty: React.Dispatch<React.SetStateAction<boolean>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
};

export const PropertyList = ({
    setCurrentPropertyIndex,
    setModalOpen,
    enteredPropertyRef,
    draggingTemplate,
    enteredTemplateRef,
    draggingProperty,
    setDraggingProperty,
    setCurrentNestedPropertyIndex,
    setModalBody,
    currentPropertyIndex,
    dispatch,
    state,
    propertyList,
    isSupportedModelType
}: IPropertyList) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const draggedPropertyItemRef = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
    const [lastPropertyFocused, setLastPropertyFocused] = useState(null);
    const dragItem = useRef(null);
    const dragNode = useRef(null);
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
    const { model, templates } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const onPropertyItemDropOnTemplateList = () => {
        console.log('Dropped on template list');
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
        dragNode.current.removeEventListener('dragend', onDragEnd);
        dragItem.current = null;
        dragNode.current = null;
        draggedPropertyItemRef.current = null;
        setDraggingProperty(false);
        enteredTemplateRef.current = null;
    };

    const onDragEnter = (e, i) => {
        if (e.target !== dragNode.current) {
            //  Entered item is not the same as dragged node

            const newModel = deepCopy(model);
            //  Replace entered item with dragged item
            // --> Remove dragged item from model and then place it on entered item's position
            newModel[propertiesKeyName].splice(
                i,
                0,
                newModel[propertiesKeyName].splice(dragItem.current, 1)[0]
            );
            dragItem.current = i;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: newModel
            });
        }
    };

    const onDragStart = (e, propertyIndex) => {
        dragItem.current = propertyIndex;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', onDragEnd);
        draggedPropertyItemRef.current = propertyIndex;
        //  Allows style to change after drag has started
        setTimeout(() => {
            setDraggingProperty(true);
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
            const newModel = deepCopy(model);
            if (index === undefined) {
                newModel[propertiesKeyName][
                    currentPropertyIndex
                ].displayName = value;
            } else {
                newModel[propertiesKeyName][index].displayName = value;
            }
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: newModel
            });
        };

        const undoUpdate = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
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
            const newModel = deepCopy(model);
            newModel[propertiesKeyName].splice(index, 1);
            const dispatchDelete = () => {
                dispatch({
                    type: SET_OAT_PROPERTY_EDITOR_MODEL,
                    payload: newModel
                });
            };
            dispatch({
                type: SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
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
            const newModel = deepCopy(model);
            const item = newModel[propertiesKeyName][index];
            newModel[propertiesKeyName].splice(index, 1);
            newModel[propertiesKeyName].splice(index + direction, 0, item);
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: newModel
            });
        };

        const undoOnMove = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
            });
        };

        execute(() => onMove(index, moveUp), undoOnMove);
    };

    return (
        <div className={propertyInspectorStyles.propertiesWrap}>
            {isSupportedModelType &&
                model &&
                propertyList &&
                propertyList.length === 0 && (
                    <div
                        className={
                            propertyInspectorStyles.addPropertyMessageWrap
                        }
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
                                className={
                                    propertyInspectorStyles.iconAddProperty
                                }
                            />
                            <Text>{t('OATPropertyEditor.addProperty')}</Text>
                        </ActionButton>
                    </div>
                )}

            {model &&
                model[propertiesKeyName] &&
                model[propertiesKeyName].length > 0 &&
                model[propertiesKeyName].map((item, i) => {
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
                                setCurrentPropertyIndex={
                                    setCurrentPropertyIndex
                                }
                                item={item}
                                lastPropertyFocused={lastPropertyFocused}
                                setLastPropertyFocused={setLastPropertyFocused}
                                setCurrentNestedPropertyIndex={
                                    setCurrentNestedPropertyIndex
                                }
                                setModalOpen={setModalOpen}
                                setModalBody={setModalBody}
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
                    } else if (typeof item['@type'] === 'object') {
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
                                setCurrentPropertyIndex={
                                    setCurrentPropertyIndex
                                }
                                setModalOpen={setModalOpen}
                                item={item}
                                setLastPropertyFocused={setLastPropertyFocused}
                                setModalBody={setModalBody}
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
                    {model && model[propertiesKeyName].length > 0 && (
                        <AddPropertyBar
                            onMouseOver={(e) => {
                                onPropertyBarMouseOver(e);
                            }}
                            onClick={(e) => {
                                onPropertyBarMouseOver(e);
                            }}
                        />
                    )}
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
