import React, { useRef, useState } from 'react';
import { FontIcon, ActionButton, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItem from './PropertyListItem';
import PropertyListItemNest from './PropertyListItemNest';
import PropertySelector from './PropertySelector';
import AddPropertyBar from './AddPropertyBar';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';

type IPropertyList = {
    currentPropertyIndex: number;
    draggingProperty: boolean;
    draggingTemplate: boolean;
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    propertySelectorVisible: boolean;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setDraggingProperty: React.Dispatch<React.SetStateAction<boolean>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertySelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
    state: any;
};

const PROPERTY_LIST_ID = 'propertyList';

export const PropertyList = ({
    propertySelectorVisible,
    setPropertySelectorVisible,
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
    state
}: IPropertyList) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const draggedPropertyItemRef = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
    const [lastPropertyFocused, setLastPropertyFocused] = useState(null);
    const [hover, setHover] = useState(false);
    const dragItem = useRef(null);
    const dragNode = useRef(null);

    const handlePropertyItemDropOnTemplateList = () => {
        const newTemplate = state.templates ? deepCopy(state.templates) : [];
        newTemplate.push(state.model.contents[draggedPropertyItemRef.current]);
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: newTemplate
        });
    };

    const handleDragEnd = () => {
        if (enteredTemplateRef.current !== null) {
            handlePropertyItemDropOnTemplateList();
        }
        dragNode.current.removeEventListener('dragend', handleDragEnd);
        dragItem.current = null;
        dragNode.current = null;
        draggedPropertyItemRef.current = null;
        setDraggingProperty(false);
        enteredTemplateRef.current = null;
    };

    const handleDragEnter = (e, i) => {
        if (e.target !== dragNode.current) {
            //  Entered item is not the same as dragged node

            const newModel = deepCopy(state.model);
            //  Replace entered item with dragged item
            // --> Remove dragged item from model and then place it on entered item's position
            newModel.contents.splice(
                i,
                0,
                newModel.contents.splice(dragItem.current, 1)[0]
            );
            dragItem.current = i;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: newModel
            });
        }
    };

    const handleDragStart = (e, propertyIndex) => {
        dragItem.current = propertyIndex;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', handleDragEnd);
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

    const handleDragEnterExternalItem = (i) => {
        setEnteredItem(i);
        enteredPropertyRef.current = i;
    };

    const handlePropertyNameChange = (value, index) => {
        const newModel = deepCopy(state.model);
        if (index === undefined) {
            newModel.contents[currentPropertyIndex].name = value;
        } else {
            newModel.contents[index].name = value;
        }
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: newModel });
    };

    const generateErrorMessage = (value, index) => {
        if (value) {
            const find = state.model.contents.find(
                (item) => item.name === value
            );

            if (!find && value !== '') {
                handlePropertyNameChange(value, index);
            }

            return find
                ? `${t('OATPropertyEditor.errorRepeatedPropertyName')}`
                : '';
        }
    };

    const deleteItem = (index) => {
        setLastPropertyFocused(null);
        const newModel = deepCopy(state.model);
        newModel.contents.splice(index, 1);
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: newModel });
    };

    return (
        <div
            className={propertyInspectorStyles.propertiesWrap}
            id={PROPERTY_LIST_ID}
            onMouseOver={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
            <div className={propertyInspectorStyles.propertiesWrapScroll}>
                {propertySelectorVisible && (
                    <PropertySelector
                        setPropertySelectorVisible={setPropertySelectorVisible}
                        lastPropertyFocused={lastPropertyFocused}
                        targetId={PROPERTY_LIST_ID}
                        dispatch={dispatch}
                        state={state}
                    />
                )}
                {!propertySelectorVisible &&
                    state.model &&
                    state.model.contents.length === 0 && (
                        <ActionButton
                            onClick={() => setPropertySelectorVisible(true)}
                            styles={{ root: { paddingLeft: '10px' } }}
                        >
                            <FontIcon
                                iconName={'CirclePlus'}
                                className={
                                    propertyInspectorStyles.iconAddProperty
                                }
                            />
                            <Text>{t('OATPropertyEditor.addProperty')}</Text>
                        </ActionButton>
                    )}

                {state.model &&
                    state.model.contents.length > 0 &&
                    state.model.contents.map((item, i) => {
                        if (typeof item.schema === 'object') {
                            return (
                                <PropertyListItemNest
                                    key={i}
                                    index={i}
                                    draggingProperty={draggingProperty}
                                    getItemClassName={getNestItemClassName}
                                    getNestedItemClassName={
                                        getNestedItemClassName
                                    }
                                    getErrorMessage={generateErrorMessage}
                                    handleDragEnter={handleDragEnter}
                                    handleDragEnterExternalItem={
                                        handleDragEnterExternalItem
                                    }
                                    handleDragStart={handleDragStart}
                                    setCurrentPropertyIndex={
                                        setCurrentPropertyIndex
                                    }
                                    item={item}
                                    lastPropertyFocused={lastPropertyFocused}
                                    setLastPropertyFocused={
                                        setLastPropertyFocused
                                    }
                                    setPropertySelectorVisible={
                                        setPropertySelectorVisible
                                    }
                                    setCurrentNestedPropertyIndex={
                                        setCurrentNestedPropertyIndex
                                    }
                                    setModalOpen={setModalOpen}
                                    setModalBody={setModalBody}
                                    dispatch={dispatch}
                                    state={state}
                                    deleteItem={deleteItem}
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
                                    handleDragEnter={handleDragEnter}
                                    handleDragEnterExternalItem={
                                        handleDragEnterExternalItem
                                    }
                                    handleDragStart={handleDragStart}
                                    setCurrentPropertyIndex={
                                        setCurrentPropertyIndex
                                    }
                                    setModalOpen={setModalOpen}
                                    item={item}
                                    setLastPropertyFocused={
                                        setLastPropertyFocused
                                    }
                                    setModalBody={setModalBody}
                                    deleteItem={deleteItem}
                                    dispatch={dispatch}
                                    state={state}
                                />
                            );
                        }
                    })}

                {state.model && state.model.contents.length > 0 && hover && (
                    <AddPropertyBar
                        onClick={() => {
                            setLastPropertyFocused(null);
                            setPropertySelectorVisible(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default PropertyList;
