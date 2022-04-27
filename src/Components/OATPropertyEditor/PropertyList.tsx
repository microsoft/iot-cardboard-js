import React, { useRef, useState } from 'react';
import { FontIcon, ActionButton, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import { DTDLModel } from '../../Models/Classes/DTDL';
import PropertyListItem from './PropertyListItem';
import PropertyListItemNest from './PropertyListItemNest';
import PropertySelector from './PropertySelector';
import AddPropertyBar from './AddPropertyBar';

type IPropertyList = {
    currentPropertyIndex: number;
    draggingProperty: boolean;
    draggingTemplate: boolean;
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    model: DTDLModel;
    propertySelectorVisible: boolean;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setDraggingProperty: React.Dispatch<React.SetStateAction<boolean>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
    setTemplates?: React.Dispatch<React.SetStateAction<any>>;
    setPropertySelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PropertyList = ({
    propertySelectorVisible,
    setPropertySelectorVisible,
    model,
    setModel,
    setCurrentPropertyIndex,
    setModalOpen,
    setTemplates,
    enteredPropertyRef,
    draggingTemplate,
    enteredTemplateRef,
    draggingProperty,
    setDraggingProperty,
    setCurrentNestedPropertyIndex,
    setModalBody,
    currentPropertyIndex
}: IPropertyList) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const draggedPropertyItemRef = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
    const [lastPropertyFocused, setLastPropertyFocused] = useState(null);
    const dragItem = useRef(null);
    const dragNode = useRef(null);

    const handlePropertyItemDropOnTemplateList = () => {
        // Drop
        setTemplates((prevTemplate) => {
            const newTemplate = deepCopy(prevTemplate);
            newTemplate.push(model.contents[draggedPropertyItemRef.current]);
            return newTemplate;
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
            setModel((prevModel) => {
                const newModel = deepCopy(prevModel);
                //  Replace entered item with dragged item
                // --> Remove dragged item from model and then place it on entered item's position
                newModel.contents.splice(
                    i,
                    0,
                    newModel.contents.splice(dragItem.current, 1)[0]
                );
                dragItem.current = i;
                return newModel;
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
        setModel((model) => {
            const newModel = deepCopy(model);
            if (index === undefined) {
                newModel.contents[currentPropertyIndex].name = value;
            } else {
                newModel.contents[index].name = value;
            }
            return newModel;
        });
    };

    const generateErrorMessage = (value, index) => {
        if (value) {
            const find = model.contents.find((item) => item.name === value);

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
        setModel((prevModel) => {
            const newModel = deepCopy(prevModel);
            newModel.contents.splice(index, 1);
            return newModel;
        });
    };

    return (
        <div className={propertyInspectorStyles.propertiesWrap}>
            <div className={propertyInspectorStyles.propertiesWrapScroll}>
                {propertySelectorVisible && (
                    <PropertySelector
                        setPropertySelectorVisible={setPropertySelectorVisible}
                        model={model}
                        setModel={setModel}
                        lastPropertyFocused={lastPropertyFocused}
                    />
                )}
                {!propertySelectorVisible && model.contents.length === 0 && (
                    <ActionButton
                        onClick={() => setPropertySelectorVisible(true)}
                    >
                        <FontIcon
                            iconName={'CirclePlus'}
                            className={propertyInspectorStyles.iconAddProperty}
                        />
                        <Text>{t('OATPropertyEditor.addProperty')}</Text>
                    </ActionButton>
                )}

                {model.contents.length > 0 &&
                    model.contents.map((item, i) => {
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
                                    model={model}
                                    setModel={setModel}
                                    deleteItem={deleteItem}
                                />
                            );
                        }

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
                                setLastPropertyFocused={setLastPropertyFocused}
                                setModalBody={setModalBody}
                                deleteItem={deleteItem}
                            />
                        );
                    })}

                {model.contents.length > 0 && (
                    <AddPropertyBar
                        callback={() => {
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
