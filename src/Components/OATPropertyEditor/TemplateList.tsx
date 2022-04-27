import React, { useRef, useState } from 'react';
import { Stack } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import { DTDLModel } from '../../Models/Classes/DTDL';
import TemplateListItem from './TeplateListItem';

interface ITemplateList {
    draggingTemplate?: boolean;
    draggingProperty?: boolean;
    enteredTemplateRef: any;
    draggedTemplateItemRef: any;
    enteredPropertyRef: any;
    model?: DTDLModel;
    templates?: any;
    setDraggingTemplate?: (dragging: boolean) => boolean;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
    setTemplates: React.Dispatch<React.SetStateAction<any>>;
}

export const TemplateList = ({
    templates,
    setTemplates,
    draggedTemplateItemRef,
    enteredPropertyRef,
    model,
    setModel,
    draggingTemplate,
    setDraggingTemplate,
    enteredTemplateRef,
    draggingProperty
}: ITemplateList) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const dragItem = useRef(null);
    const dragNode = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredTemplateRef.current);

    const handleTemplateItemDropOnPropertyList = () => {
        // Prevent drop if duplicate
        const isTemplateAlreadyInModel = model.contents.find(
            (item) =>
                item['@id'] === templates[draggedTemplateItemRef.current]['@id']
        );
        if (isTemplateAlreadyInModel) return;

        // Drop
        setModel((prevModel) => {
            const newModel = deepCopy(prevModel);
            // + 1 so that it drops under current item
            newModel.contents.splice(
                enteredPropertyRef.current + 1,
                0,
                templates[draggedTemplateItemRef.current]
            );
            return newModel;
        });
    };

    const handleDragEnd = () => {
        if (enteredPropertyRef.current !== null) {
            handleTemplateItemDropOnPropertyList();
        }

        dragNode.current.removeEventListener('dragend', handleDragEnd);
        dragItem.current = null;
        dragNode.current = null;
        draggedTemplateItemRef.current = null;
        setDraggingTemplate(false);
        enteredPropertyRef.current = null;
    };

    const handleDragStart = (e, propertyIndex) => {
        dragItem.current = propertyIndex;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', handleDragEnd);
        draggedTemplateItemRef.current = propertyIndex;
        //  Allows style to change after drag has started
        setTimeout(() => {
            setDraggingTemplate(true);
        }, 0);
    };

    const handleDragEnter = (e, i) => {
        if (e.target !== dragNode.current) {
            //  Entered item is not the same as dragged node
            setTemplates((prevTemplate) => {
                const newTemplate = deepCopy(prevTemplate);
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
        if (propertyIndex === dragItem.current && draggedTemplateItemRef) {
            return propertyInspectorStyles.templateItemDragging;
        }
        if (propertyIndex === enteredItem && draggingProperty) {
            return propertyInspectorStyles.templateItemEntered;
        }

        return propertyInspectorStyles.templateItem;
    };

    const handleDragEnterExternalItem = (i) => {
        setEnteredItem(i);
        enteredTemplateRef.current = i;
    };

    const getSchemaText = (itemSchema) => {
        if (typeof itemSchema === 'object') {
            return itemSchema['@type'];
        }

        return itemSchema;
    };

    const deleteItem = (index) => {
        setTemplates((prevTemplate) => {
            const newTemplate = deepCopy(prevTemplate);
            newTemplate.splice(index, 1);
            return newTemplate;
        });
    };

    return (
        <Stack
            className={propertyInspectorStyles.propertiesWrap}
            onDragEnter={
                draggingTemplate
                    ? (e) => handleDragEnter(e, 0)
                    : () => handleDragEnterExternalItem(0)
            }
        >
            {templates.length > 0 &&
                templates.map((item, i) => (
                    <TemplateListItem
                        key={i}
                        draggingTemplate={draggingTemplate}
                        item={item}
                        index={i}
                        deleteItem={deleteItem}
                        getDragItemClassName={getDragItemClassName}
                        handleDragEnter={handleDragEnter}
                        handleDragEnterExternalItem={
                            handleDragEnterExternalItem
                        }
                        handleDragStart={handleDragStart}
                        getSchemaText={getSchemaText}
                    />
                ))}
        </Stack>
    );
};

export default TemplateList;
