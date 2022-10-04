import React, { useRef, useState, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { getPropertyInspectorStyles } from '../OATPropertyEditor.styles';
import { deepCopy } from '../../../Models/Services/Utils';
import TemplateListItem from './TemplateListItem';
import { SET_OAT_PROPERTY_EDITOR_DRAGGING_TEMPLATE } from '../../../Models/Constants/ActionTypes';

import {
    getModelPropertyCollectionName,
    getTargetFromSelection
} from '../Utils';
import { TemplateListProps } from './TemplateList.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { DTDLProperty } from '../../../Models/Classes/DTDL';

export const TemplateList: React.FC<TemplateListProps> = (props) => {
    const {
        dispatch,
        draggedTemplateItemRef,
        draggingProperty,
        draggingTemplate,
        enteredPropertyRef,
        enteredTemplateRef
    } = props;

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const dragItem = useRef(null);
    const dragNode = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredTemplateRef.current);

    // data
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            ),
        [oatPageState.currentOntologyModels, oatPageState.selection]
    );
    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    // callbacks
    const handleTemplateItemDropOnPropertyList = () => {
        // Prevent drop if duplicate
        const isTemplateAlreadyInModel = model[propertiesKeyName].find(
            (item) =>
                item['@id'] ===
                oatPageState.currentOntologyTemplates[
                    draggedTemplateItemRef.current
                ]['@id']
        );
        if (isTemplateAlreadyInModel) return;

        // Drop
        const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
        const modelCopy = getTargetFromSelection(
            modelsCopy,
            oatPageState.selection
        );
        // + 1 so that it drops under current item
        modelCopy[propertiesKeyName].splice(
            enteredPropertyRef.current + 1,
            0,
            oatPageState.currentOntologyTemplates[
                draggedTemplateItemRef.current
            ]
        );
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_MODELS,
            payload: { models: modelsCopy }
        });
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
            const templatesCopy = deepCopy(
                oatPageState.currentOntologyTemplates
            );
            templatesCopy.splice(
                i,
                0,
                templatesCopy.splice(dragItem.current, 1)[0]
            );
            dragItem.current = i;
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_TEMPLATES,
                payload: { templates: templatesCopy }
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
            const templatesCopy = deepCopy(
                oatPageState.currentOntologyTemplates
            );
            templatesCopy.splice(index, 1);
            const dispatchDelete = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_TEMPLATES,
                    payload: { templates: templatesCopy }
                });
            };
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_TEMPLATES,
                payload: { templates: oatPageState.currentOntologyTemplates }
            });
        };

        execute(() => deletion(index), undoDeletion);
    };

    const onPropertyListAddition = (item: DTDLProperty) => {
        if (model) {
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                oatPageState.selection
            );
            modelCopy[propertiesKeyName].push(item);
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: modelsCopy }
            });
        }
    };

    const moveItemOnTemplateList = (index: number, moveUp: boolean) => {
        const onMove = (index: number, moveUp: boolean) => {
            const direction = moveUp ? -1 : 1;
            const templatesCopy = deepCopy(
                oatPageState.currentOntologyTemplates
            );
            const item = templatesCopy[index];
            templatesCopy.splice(index, 1);
            templatesCopy.splice(index + direction, 0, item);
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_TEMPLATES,
                payload: { templates: templatesCopy }
            });
        };

        const undoOnMove = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_TEMPLATES,
                payload: { templates: oatPageState.currentOntologyTemplates }
            });
        };

        execute(() => onMove(index, moveUp), undoOnMove);
    };

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <div
            className={propertyInspectorStyles.propertiesWrap}
            onDragEnter={
                draggingTemplate
                    ? (e) => onDragEnter(e, 0)
                    : () => onDragEnterExternalItem(0)
            }
        >
            {oatPageState &&
                oatPageState.currentOntologyTemplates &&
                oatPageState.currentOntologyTemplates.length > 0 &&
                oatPageState.currentOntologyTemplates.map((item, i) => (
                    <TemplateListItem
                        key={i + item['@id']}
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
                        templatesLength={
                            oatPageState.currentOntologyTemplates.length
                        }
                    />
                ))}
        </div>
    );
};

export default TemplateList;
