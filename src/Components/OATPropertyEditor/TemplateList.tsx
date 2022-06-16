import React, { useRef, useState } from 'react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import TemplateListItem from './TeplateListItem';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES,
    SET_OAT_CONFIRM_DELETE_TYPE,
    SET_OAT_CONFIRM_DELETE_PAYLOAD,
    SET_OAT_CONFIRM_DELETE_OPEN
} from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { getModelPropertyCollectionName } from './Utils';

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
    const { model, templates } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const handleTemplateItemDropOnPropertyList = () => {
        // Prevent drop if duplicate
        const isTemplateAlreadyInModel = model[propertiesKeyName].find(
            (item) =>
                item['@id'] === templates[draggedTemplateItemRef.current]['@id']
        );
        if (isTemplateAlreadyInModel) return;

        // Drop
        const newModel = deepCopy(model);
        // + 1 so that it drops under current item
        newModel[propertiesKeyName].splice(
            enteredPropertyRef.current + 1,
            0,
            templates[draggedTemplateItemRef.current]
        );
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: newModel });
    };

    const onDragEnd = () => {
        if (enteredPropertyRef.current !== null) {
            handleTemplateItemDropOnPropertyList();
        }

        dragNode.current.removeEventListener('dragend', onDragEnd);
        dragItem.current = null;
        dragNode.current = null;
        draggedTemplateItemRef.current = null;
        setDraggingTemplate(false);
        enteredPropertyRef.current = null;
    };

    const onDragStart = (e: Event, propertyIndex: number) => {
        dragItem.current = propertyIndex;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', onDragEnd);
        draggedTemplateItemRef.current = propertyIndex;
        //  Allows style to change after drag has started
        setTimeout(() => {
            setDraggingTemplate(true);
        }, 0);
    };

    const onDragEnter = (e: Event, i: number) => {
        if (e.target !== dragNode.current) {
            //  Entered item is not the same as dragged node
            //  Replace entered item with dragged item
            // --> Remove dragged item and then place it on entered item's position
            const newTemplate = deepCopy(templates);
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

    const getDragItemClassName = (propertyIndex: number) => {
        if (propertyIndex === dragItem.current && draggedTemplateItemRef) {
            return propertyInspectorStyles.templateItemDragging;
        }
        if (propertyIndex === enteredItem && draggingProperty) {
            return propertyInspectorStyles.templateItemEntered;
        }

        return propertyInspectorStyles.templateItem;
    };

    const onDragEnterExternalItem = (i: number) => {
        setEnteredItem(i);
        enteredTemplateRef.current = i;
    };

    const getSchemaText = (itemSchema) => {
        if (typeof itemSchema === 'object') {
            return itemSchema['@type'];
        }

        return itemSchema;
    };

    const deleteItem = (index: number) => {
        const newTemplate = deepCopy(templates);
        newTemplate.splice(index, 1);

        dispatch({
            type: SET_OAT_CONFIRM_DELETE_TYPE,
            payload: SET_OAT_TEMPLATES
        });
        dispatch({
            type: SET_OAT_CONFIRM_DELETE_PAYLOAD,
            payload: newTemplate
        });
        dispatch({ type: SET_OAT_CONFIRM_DELETE_OPEN, payload: true });
    };

    return (
        <div
            className={propertyInspectorStyles.propertiesWrap}
            onDragEnter={
                draggingTemplate
                    ? (e) => onDragEnter(e, 0)
                    : () => onDragEnterExternalItem(0)
            }
        >
            {state &&
                templates &&
                templates.length > 0 &&
                templates.map((item, i) => (
                    <TemplateListItem
                        key={i}
                        draggingTemplate={draggingTemplate}
                        item={item}
                        index={i}
                        deleteItem={deleteItem}
                        getDragItemClassName={getDragItemClassName}
                        handleDragEnter={onDragEnter}
                        handleDragEnterExternalItem={onDragEnterExternalItem}
                        handleDragStart={onDragStart}
                        getSchemaText={getSchemaText}
                    />
                ))}
        </div>
    );
};

export default TemplateList;
