import React, { useRef, useState } from 'react';
import {
    FontIcon,
    TextField,
    ActionButton,
    Stack,
    Text
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import PropertySelector from './PropertySelector';
import { deepCopy } from '../../Models/Services/Utils';

const data = {
    propertyTags: {
        primitive: [
            'boolean',
            'data',
            'dataTime',
            'double',
            'duration',
            'float',
            'integer',
            'long',
            'string',
            'time'
        ]
    }
};

type IPropertyList = {
    propertySelectorVisible: boolean;
    setPropertySelectorVisible: any;
    model: any;
    setModel: any;
    setCurrentPropertyIndex: any;
    setModalOpen: any;
    getErrorMessage: (value: string) => string;
    setTemplates: any;
    enteredPropertyRef: any;
    draggingTemplate: boolean;
    enteredTemplateRef: any;
    draggedPropertyItemRef: any;
    draggingProperty: boolean;
    setDraggingProperty: any;
};

export const PropertyList = ({
    propertySelectorVisible,
    setPropertySelectorVisible,
    model,
    setModel,
    setCurrentPropertyIndex,
    setModalOpen,
    getErrorMessage,
    setTemplates,
    enteredPropertyRef,
    draggingTemplate,
    enteredTemplateRef,
    draggedPropertyItemRef,
    draggingProperty,
    setDraggingProperty
}: IPropertyList) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
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

    const getDragItemClassName = (propertyIndex) => {
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

    return (
        <Stack className={propertyInspectorStyles.propertiesWrap}>
            {propertySelectorVisible && (
                <PropertySelector
                    data={data}
                    setPropertySelectorVisible={setPropertySelectorVisible}
                    model={model}
                    setModel={setModel}
                />
            )}
            {!propertySelectorVisible && model.contents.length === 0 && (
                <ActionButton onClick={() => setPropertySelectorVisible(true)}>
                    <FontIcon
                        iconName={'CirclePlus'}
                        className={propertyInspectorStyles.iconAddProperty}
                    />
                    <Text>{t('OATPropertyEditor.addProperty')}</Text>
                </ActionButton>
            )}

            {model.contents.length > 0 &&
                model.contents.map((item, i) => (
                    <Stack
                        key={i}
                        className={getDragItemClassName(i)}
                        draggable
                        onDragStart={(e) => {
                            handleDragStart(e, i);
                        }}
                        onDragEnter={
                            draggingProperty
                                ? (e) => handleDragEnter(e, i)
                                : () => handleDragEnterExternalItem(i)
                        }
                    >
                        <TextField
                            className={
                                propertyInspectorStyles.propertyItemTextField
                            }
                            borderless
                            placeholder={item.name}
                            validateOnFocusOut
                            onChange={() => {
                                setCurrentPropertyIndex(i);
                            }}
                            onGetErrorMessage={getErrorMessage}
                        />
                        <Text>{item.schema}</Text>
                        <ActionButton
                            className={
                                propertyInspectorStyles.propertyItemIconWrap
                            }
                            onClick={() => {
                                setCurrentPropertyIndex(i);
                                setModalOpen(true);
                            }}
                        >
                            <FontIcon
                                iconName={'Info'}
                                className={
                                    propertyInspectorStyles.propertyItemIcon
                                }
                            />
                        </ActionButton>
                        <ActionButton
                            className={
                                propertyInspectorStyles.propertyItemIconWrap
                            }
                        >
                            <FontIcon
                                iconName={'More'}
                                className={
                                    propertyInspectorStyles.propertyItemIcon
                                }
                            />
                        </ActionButton>
                    </Stack>
                ))}

            {model.contents.length > 0 && (
                <Stack className={propertyInspectorStyles.addPropertyBar}>
                    <ActionButton
                        onClick={() => setPropertySelectorVisible(true)}
                    >
                        <FontIcon
                            iconName={'CirclePlus'}
                            className={
                                propertyInspectorStyles.addPropertyBarIcon
                            }
                        />
                    </ActionButton>
                </Stack>
            )}
        </Stack>
    );
};

export default PropertyList;
