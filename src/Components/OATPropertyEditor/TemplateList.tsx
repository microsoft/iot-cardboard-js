import React, { useRef, useState } from 'react';
import { FontIcon, ActionButton, Stack, Text } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

export const TemplateList = ({
    templates,
    setTemplates,
    draggedTemplateItem,
    enteredProperty,
    model,
    setModel,
    draggingTemplate,
    setDraggingTemplate,
    enteredTemplate,
    draggingProperty
}) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const dragItem = useRef(null);
    const dragNode = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredTemplate.current);

    const handleTemplateItemDropOnProperyList = () => {
        // Prevent drop if duplicate
        const isTemplateAlreadyInModel = model.contents.find(
            (item) =>
                item['@id'] === templates[draggedTemplateItem.current]['@id']
        );
        if (isTemplateAlreadyInModel) return;

        // Drop
        setModel((prevModel) => {
            const newModel = JSON.parse(JSON.stringify(prevModel));
            // + 1 so that it drops under current item
            newModel.contents.splice(
                enteredProperty.current + 1,
                0,
                templates[draggedTemplateItem.current]
            );
            return newModel;
        });
    };

    const handleDragEnd = () => {
        if (enteredProperty.current !== null) {
            handleTemplateItemDropOnProperyList();
        }

        dragNode.current.removeEventListener('dragend', handleDragEnd);
        dragItem.current = null;
        dragNode.current = null;
        draggedTemplateItem.current = null;
        setDraggingTemplate(false);
        enteredProperty.current = null;
    };

    const handleDragStart = (e, propertyIndex) => {
        dragItem.current = propertyIndex;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', handleDragEnd);
        draggedTemplateItem.current = propertyIndex;
        //  Allows style to change after drag has started
        setTimeout(() => {
            setDraggingTemplate(true);
        }, 0);
    };

    const handleDragEnter = (e, i) => {
        if (e.target !== dragNode.current) {
            //  Entered item is not the same as dragged node
            setTemplates((prevTemplate) => {
                const newTemplate = JSON.parse(JSON.stringify(prevTemplate));
                //  Replace entered item with dragged item
                // --> Remove dragged item and then place it on entered item's position
                newTemplate.splice(
                    i,
                    0,
                    newTemplate.splice(dragItem.current, 1)[0]
                );
                dragItem.current = i;
                return newTemplate;
            });
        }
    };

    const getDragItemClassName = (propertyIndex) => {
        if (propertyIndex === dragItem.current && draggedTemplateItem)
            return propertyInspectorStyles.templateItemDragging;
        if (propertyIndex === enteredItem && draggingProperty)
            return propertyInspectorStyles.templateItemEntered;

        return propertyInspectorStyles.templateItem;
    };

    const handleDragEnterExternalItem = (i) => {
        setEnteredItem(i);
        enteredTemplate.current = i;
    };

    return (
        <Stack className={propertyInspectorStyles.propertiesWrap}>
            {templates.length > 0 &&
                templates.map((item, i) => (
                    <Stack
                        className={getDragItemClassName(i)}
                        key={i}
                        draggable
                        onDragStart={(e) => {
                            handleDragStart(e, i);
                        }}
                        onDragEnter={
                            draggingTemplate
                                ? (e) => handleDragEnter(e, i)
                                : () => handleDragEnterExternalItem(i)
                        }
                    >
                        <Text>{item.name}</Text>
                        <Text>{item.schema}</Text>
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
        </Stack>
    );
};

export default TemplateList;
