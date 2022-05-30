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
import { DTDLProperty, IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { getModelPropertyCollectionName } from './Utils';

type IPropertyList = {
    currentPropertyIndex: number;
    draggingProperty: boolean;
    draggingTemplate: boolean;
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    propertyList?: DTDLProperty[];
    propertyOnHover: boolean;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setDraggingProperty: React.Dispatch<React.SetStateAction<boolean>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertyOnHover?: React.Dispatch<React.SetStateAction<boolean>>;
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
    propertyOnHover,
    setPropertyOnHover
}: IPropertyList) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const draggedPropertyItemRef = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
    const [lastPropertyFocused, setLastPropertyFocused] = useState(null);
    const dragItem = useRef(null);
    const dragNode = useRef(null);
    const [hover, setHover] = useState(false);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const [
        actionButtonPropertySelectorVisible,
        setActionButtonPropertySelectorVisible
    ] = useState(false);
    const { model, templates } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const handlePropertyItemDropOnTemplateList = () => {
        const newTemplate = templates ? deepCopy(templates) : [];
        newTemplate.push(
            model[propertiesKeyName][draggedPropertyItemRef.current]
        );
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
        const newModel = deepCopy(model);
        if (index === undefined) {
            newModel[propertiesKeyName][currentPropertyIndex].name = value;
        } else {
            newModel[propertiesKeyName][index].name = value;
        }
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: newModel });
    };

    const generateErrorMessage = (value, index) => {
        if (value) {
            const find = model[propertiesKeyName].find(
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
        const newModel = deepCopy(model);
        newModel[propertiesKeyName].splice(index, 1);
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: newModel });
    };

    return (
        <div
            className={propertyInspectorStyles.propertiesWrap}
            onMouseOver={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
            <div className={propertyInspectorStyles.propertiesWrapScroll}>
                {model && propertyList && propertyList.length === 0 && (
                    <div
                        className={
                            propertyInspectorStyles.addPropertyMessageWrap
                        }
                        onMouseOver={() => {
                            setActionButtonPropertySelectorVisible(true);
                            setLastPropertyFocused(null);
                        }}
                        onMouseLeave={() =>
                            setActionButtonPropertySelectorVisible(false)
                        }
                    >
                        {actionButtonPropertySelectorVisible && (
                            <PropertySelector
                                setPropertySelectorVisible={
                                    setActionButtonPropertySelectorVisible
                                }
                                lastPropertyFocused={lastPropertyFocused}
                                dispatch={dispatch}
                                state={state}
                                onTagClickCallback={() => {
                                    setHover(false);
                                    setPropertyOnHover(false);
                                }}
                                className={
                                    propertyInspectorStyles.propertySelectorAddMore
                                }
                            />
                        )}
                        <ActionButton
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
                    </div>
                )}
                <div
                    className={
                        propertyInspectorStyles.propertyListRelativeWrapContainer
                    }
                >
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
                                        lastPropertyFocused={
                                            lastPropertyFocused
                                        }
                                        setLastPropertyFocused={
                                            setLastPropertyFocused
                                        }
                                        setCurrentNestedPropertyIndex={
                                            setCurrentNestedPropertyIndex
                                        }
                                        setModalOpen={setModalOpen}
                                        setModalBody={setModalBody}
                                        dispatch={dispatch}
                                        state={state}
                                        deleteItem={deleteItem}
                                        setPropertyOnHover={setPropertyOnHover}
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
                                        setPropertyOnHover={setPropertyOnHover}
                                    />
                                );
                            }
                        })}
                </div>
                <div
                    className={
                        propertyInspectorStyles.addPropertyBarPropertyListWrap
                    }
                    onMouseLeave={() => setPropertySelectorVisible(false)}
                >
                    {hover &&
                        model &&
                        model[propertiesKeyName].length > 0 &&
                        !propertyOnHover && (
                            <AddPropertyBar
                                onMouseOver={() => {
                                    setPropertySelectorVisible(true);
                                    setLastPropertyFocused(null);
                                }}
                            />
                        )}
                    {propertySelectorVisible && (
                        <PropertySelector
                            setPropertySelectorVisible={
                                setPropertySelectorVisible
                            }
                            lastPropertyFocused={lastPropertyFocused}
                            dispatch={dispatch}
                            state={state}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyList;
