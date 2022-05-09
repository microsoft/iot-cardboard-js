import React, { useRef, useState } from 'react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import TemplateListItem from './TeplateListItem';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES
} from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

interface ITemplateList {
    draggingTemplate?: boolean;
    draggingProperty?: boolean;
    enteredTemplateRef: any;
    draggedTemplateItemRef: any;
    enteredPropertyRef: any;
    setDraggingTemplate?: (dragging: boolean) => boolean;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
}

export const TemplateList = ({
    draggedTemplateItemRef,
    enteredPropertyRef,
    draggingTemplate,
    setDraggingTemplate,
    enteredTemplateRef,
    draggingProperty,
    dispatch,
    state
}: ITemplateList) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const dragItem = useRef(null);
    const dragNode = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredTemplateRef.current);

    const handleTemplateItemDropOnPropertyList = () => {
        // Prevent drop if duplicate
        const isTemplateAlreadyInModel = state.model.contents.find(
            (item) =>
                item['@id'] ===
                state.templates[draggedTemplateItemRef.current]['@id']
        );
        if (isTemplateAlreadyInModel) return;

        // Drop
        const newModel = deepCopy(state.model);
        // + 1 so that it drops under current item
        newModel.contents.splice(
            enteredPropertyRef.current + 1,
            0,
            state.templates[draggedTemplateItemRef.current]
        );
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: newModel });
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
            //  Replace entered item with dragged item
            // --> Remove dragged item and then place it on entered item's position
            const newTemplate = deepCopy(state.templates);
            newTemplate.splice(
                i,
                0,
                newTemplate.splice(dragItem.current, 1)[0]
            );
            dragItem.current = i;
            dispatch({
                type: SET_OAT_TEMPLATES,
                payload: newTemplate
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
        const newTemplate = deepCopy(state.templates);
        newTemplate.splice(index, 1);

        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: newTemplate
        });
    };

    return (
        <div
            className={propertyInspectorStyles.propertiesWrap}
            onDragEnter={
                draggingTemplate
                    ? (e) => handleDragEnter(e, 0)
                    : () => handleDragEnterExternalItem(0)
            }
        >
            {state &&
                state.templates &&
                state.templates.length > 0 &&
                state.templates.map((item, i) => (
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
        </div>
    );
};

export default TemplateList;
