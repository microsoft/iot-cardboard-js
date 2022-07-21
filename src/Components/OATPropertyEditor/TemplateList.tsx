import React, { useRef, useState, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import TemplateListItem from './TemplateListItem';
import {
    SET_OAT_SELECTED_MODEL,
    SET_OAT_TEMPLATES,
    SET_OAT_CONFIRM_DELETE_OPEN,
    SET_OAT_PROPERTY_EDITOR_DRAGGING_TEMPLATE
} from '../../Models/Constants/ActionTypes';

import {
    getModelPropertyCollectionName,
    getTargetFromSelection
} from './Utils';
import { TemplateListProps } from './TemplateList.types';

export const TemplateList = ({
    draggedTemplateItemRef,
    enteredPropertyRef,
    draggingTemplate,
    enteredTemplateRef,
    draggingProperty,
    dispatch,
    state
}: TemplateListProps) => {
    const { execute } = useContext(CommandHistoryContext);
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const dragItem = useRef(null);
    const dragNode = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredTemplateRef.current);
    const { models, selection, templates } = state;
    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );

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
        dispatch({ type: SET_OAT_SELECTED_MODEL, payload: newModel });
    };

    const onDragEnd = () => {
        if (enteredPropertyRef.current !== null) {
            handleTemplateItemDropOnPropertyList();
        }
        dragItem.current = null;
        dragNode.current = null;
        draggedTemplateItemRef.current = null;
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_DRAGGING_TEMPLATE,
            payload: false
        });
        enteredPropertyRef.current = null;
    };

    const onDragStart = (e: Event, propertyIndex: number) => {
        dragItem.current = propertyIndex;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', onDragEnd);
        draggedTemplateItemRef.current = propertyIndex;
        //  Allows style to change after drag has started
        setTimeout(() => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_DRAGGING_TEMPLATE,
                payload: true
            });
        }, 0);
    };

    const onDragEnter = (e: React.DragEvent, i: number) => {
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

    const getSchemaText = (itemSchema: string) => {
        if (typeof itemSchema === 'object' && itemSchema) {
            return itemSchema['@type'];
        }

        return itemSchema;
    };

    const deleteItem = (index: number) => {
        const deletion = (index) => {
            const newTemplate = deepCopy(templates);
            newTemplate.splice(index, 1);
            const dispatchDelete = () => {
                dispatch({
                    type: SET_OAT_TEMPLATES,
                    payload: newTemplate
                });
            };
            dispatch({
                type: SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            dispatch({
                type: SET_OAT_TEMPLATES,
                payload: templates
            });
        };

        execute(() => deletion(index), undoDeletion);
    };

    const onPropertyListAddition = (item) => {
        if (model) {
            const newModel = deepCopy(model);
            newModel[propertiesKeyName].push(item);
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: newModel
            });
        }
    };

    const moveItemOnTemplateList = (index: number, moveUp: boolean) => {
        const onMove = (index, moveUp) => {
            const direction = moveUp ? -1 : 1;
            const newTemplate = deepCopy(templates);
            const item = newTemplate[index];
            newTemplate.splice(index, 1);
            newTemplate.splice(index + direction, 0, item);
            dispatch({
                type: SET_OAT_TEMPLATES,
                payload: newTemplate
            });
        };

        const undoOnMove = () => {
            dispatch({
                type: SET_OAT_TEMPLATES,
                payload: templates
            });
        };

        execute(() => onMove(index, moveUp), undoOnMove);
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
                        onDragEnter={onDragEnter}
                        onDragEnterExternalItem={onDragEnterExternalItem}
                        onDragStart={onDragStart}
                        getSchemaText={getSchemaText}
                        onPropertyListAddition={onPropertyListAddition}
                        onMove={moveItemOnTemplateList}
                        templatesLength={templates.length}
                    />
                ))}
        </div>
    );
};

export default TemplateList;
