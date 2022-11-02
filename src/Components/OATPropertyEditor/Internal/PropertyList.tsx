import React, { useRef, useState, useContext } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { FontIcon, ActionButton, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from '../OATPropertyEditor.styles';
import { deepCopy } from '../../../Models/Services/Utils';
import PropertyListItem from './PropertyListItem';
import PropertyListItemNest from './PropertyListItemNest';
import PropertySelector from './PropertySelector';
import AddPropertyBar from './AddPropertyBar';
import {
    getModelPropertyCollectionName,
    getTargetFromSelection,
    shouldClosePropertySelectorOnMouseLeave
} from '../Utils';
import { PropertyListProps } from './PropertyList.types';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { SET_OAT_PROPERTY_EDITOR_DRAGGING_PROPERTY } from '../../../Models/Constants/ActionTypes';

export const PropertyList: React.FC<PropertyListProps> = (props) => {
    const {
        dispatch,
        enteredPropertyRef,
        enteredTemplateRef,
        isSupportedModelType,
        selectedItem,
        propertyList,
        state
    } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();
    const { currentPropertyIndex, draggingTemplate, draggingProperty } = state;

    // state
    const draggedPropertyItemRef = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
    const dragItemIndex = useRef<number>(-1);
    const dragNode = useRef<HTMLElement | null>(null);
    const dragEnteredItem = useRef(null);
    const addPropertyLabelRef = useRef<HTMLDivElement>(null);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const [propertySelectorPosition, setPropertySelectorPosition] = useState({
        left: 0,
        top: 0
    });
    const [
        propertySelectorTriggerElementsBoundingBox,
        setPropertySelectorTriggerElementsBoundingBox
    ] = useState<DOMRect | null>(null);

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();

    // data
    const propertiesKeyName = getModelPropertyCollectionName(
        selectedItem ? selectedItem['@type'] : ''
    );

    const onPropertyItemDropOnTemplateList = () => {
        const newTemplate = oatPageState.currentOntologyTemplates
            ? deepCopy(oatPageState.currentOntologyTemplates)
            : [];
        newTemplate.push(
            selectedItem[propertiesKeyName][draggedPropertyItemRef.current]
        );
        oatPageDispatch({
            type: OatPageContextActionType.SET_CURRENT_TEMPLATES,
            payload: { templates: newTemplate }
        });
    };

    const onDragEnd = () => {
        if (enteredTemplateRef.current !== null) {
            onPropertyItemDropOnTemplateList();
        }

        const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
        const modelCopy = getTargetFromSelection(
            modelsCopy,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            oatPageState.selection!
        );
        //  Replace entered item with dragged item
        // --> Remove dragged item from model and then place it on entered item's position
        if (modelCopy) {
            modelCopy[propertiesKeyName].splice(
                dragEnteredItem.current,
                0,
                modelCopy[propertiesKeyName].splice(dragItemIndex.current, 1)[0]
            );
        }
        oatPageDispatch({
            type: OatPageContextActionType.SET_CURRENT_MODELS,
            payload: { models: modelsCopy }
        });

        dragNode.current?.removeEventListener('dragend', onDragEnd);
        dragItemIndex.current = -1;
        dragNode.current = null;
        draggedPropertyItemRef.current = null;
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_DRAGGING_PROPERTY,
            payload: false
        });
        enteredTemplateRef.current = null;
    };

    const onDragEnter = (e, i) => {
        if (e.target !== dragNode.current) {
            //  Entered item is not the same as dragged node
            dragEnteredItem.current = i;
        }
    };

    const onDragStart = (e, propertyIndex) => {
        dragItemIndex.current = propertyIndex;
        dragNode.current = e.target;
        dragNode.current?.addEventListener('dragend', onDragEnd);
        draggedPropertyItemRef.current = propertyIndex;
        //  Allows style to change after drag has started
        setTimeout(() => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_DRAGGING_PROPERTY,
                payload: true
            });
        }, 0);
    };

    const getNestItemClassName = () => {
        return propertyInspectorStyles.propertyItemNest;
    };

    const getNestedItemClassName = () => {
        return propertyInspectorStyles.propertyItemNested;
    };

    const getItemClassName = (propertyIndex) => {
        if (propertyIndex === dragItemIndex.current && draggingProperty) {
            return propertyInspectorStyles.propertyItemDragging;
        }
        if (propertyIndex === enteredItem && draggingTemplate) {
            return propertyInspectorStyles.propertyItemEntered;
        }

        return propertyInspectorStyles.propertyItem;
    };

    const onDragEnterExternalItem = (i) => {
        setEnteredItem(i);
        enteredPropertyRef.current = i;
    };

    const onPropertyDisplayNameChange = (value, index) => {
        const update = () => {
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                oatPageState.selection!
            );
            if (!modelCopy) {
                return;
            }

            if (index === undefined) {
                modelCopy[propertiesKeyName][currentPropertyIndex].name = value;
            } else {
                modelCopy[propertiesKeyName][index].name = value;
            }
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: modelsCopy }
            });
        };

        const undoUpdate = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(update, undoUpdate);
    };

    const generateErrorMessage = (value: string, index?: number) => {
        if (value) {
            const find = selectedItem[propertiesKeyName].find(
                (item) => item.name === value
            );

            if (!find && value !== '') {
                onPropertyDisplayNameChange(value, index);
            }

            return find
                ? `${t('OATPropertyEditor.errorRepeatedPropertyName')}`
                : '';
        }
        return '';
    };

    const deleteItem = (index: number) => {
        const deletion = (index: number) => {
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                oatPageState.selection!
            );
            if (!modelCopy) {
                return;
            }
            modelCopy[propertiesKeyName].splice(index, 1);
            const dispatchDelete = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS,
                    payload: { models: modelsCopy }
                });
            };
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(() => deletion(index), undoDeletion);
    };

    const definePropertySelectorPosition = (e, top: number | null = null) => {
        if (e) {
            const boundingRect = e.target.getBoundingClientRect();
            setPropertySelectorPosition({
                ...propertySelectorPosition,
                top: top ? top : boundingRect.top,
                left: boundingRect.left
            });
            setPropertySelectorTriggerElementsBoundingBox(boundingRect);
        }
    };

    const onMouseLeave = (e) => {
        if (
            shouldClosePropertySelectorOnMouseLeave(
                e,
                propertySelectorTriggerElementsBoundingBox
            )
        ) {
            setPropertySelectorVisible(false);
        }
    };

    const onPropertyBarMouseOver = (e) => {
        setPropertySelectorVisible(true);
        definePropertySelectorPosition(e);
    };

    const onAddPropertyLabelMouseOver = (e) => {
        setPropertySelectorVisible(true);

        const buttonTop =
            addPropertyLabelRef.current?.getBoundingClientRect().top || 0;
        definePropertySelectorPosition(e, buttonTop);
    };

    const moveItemOnPropertyList = (index: number, moveUp: boolean) => {
        const onMove = (index, moveUp) => {
            const direction = moveUp ? -1 : 1;
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                oatPageState.selection!
            );
            if (!modelCopy) {
                return;
            }

            const item = modelCopy[propertiesKeyName][index];
            modelCopy[propertiesKeyName].splice(index, 1);
            modelCopy[propertiesKeyName].splice(index + direction, 0, item);
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: modelsCopy }
            });
        };

        const undoOnMove = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(() => onMove(index, moveUp), undoOnMove);
    };

    return (
        <div className={propertyInspectorStyles.propertiesWrap}>
            {isSupportedModelType && propertyList && propertyList.length === 0 && (
                <div
                    className={propertyInspectorStyles.addPropertyMessageWrap}
                    onMouseOver={(e) => {
                        onAddPropertyLabelMouseOver(e);
                    }}
                    onMouseLeave={(e) => {
                        onMouseLeave(e);
                    }}
                    ref={addPropertyLabelRef}
                >
                    <ActionButton
                        onClick={(e) => {
                            if (propertySelectorVisible) {
                                setPropertySelectorVisible(false);
                            } else {
                                onAddPropertyLabelMouseOver(e);
                            }
                        }}
                    >
                        <FontIcon
                            iconName={'CirclePlus'}
                            className={propertyInspectorStyles.iconAddProperty}
                        />
                        <Text>{t('OATPropertyEditor.addProperty')}</Text>
                    </ActionButton>
                </div>
            )}

            {propertyList &&
                propertyList.map((item, i) => {
                    if (typeof item.schema === 'object') {
                        return (
                            <PropertyListItemNest
                                key={i}
                                index={i}
                                definePropertySelectorPosition={
                                    definePropertySelectorPosition
                                }
                                deleteItem={deleteItem}
                                dispatch={dispatch}
                                draggingProperty={draggingProperty}
                                getErrorMessage={generateErrorMessage}
                                getItemClassName={getNestItemClassName}
                                getNestedItemClassName={getNestedItemClassName}
                                item={item}
                                onDragEnter={onDragEnter}
                                onDragEnterExternalItem={
                                    onDragEnterExternalItem
                                }
                                onDragStart={onDragStart}
                                onMove={moveItemOnPropertyList}
                                onPropertyDisplayNameChange={
                                    onPropertyDisplayNameChange
                                }
                                propertiesLength={
                                    selectedItem[propertiesKeyName].length
                                }
                                propertySelectorTriggerElementsBoundingBox={
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    propertySelectorTriggerElementsBoundingBox!
                                }
                                setPropertySelectorVisible={
                                    setPropertySelectorVisible
                                }
                            />
                        );
                    } else {
                        return (
                            <PropertyListItem
                                key={i}
                                index={i}
                                deleteItem={deleteItem}
                                dispatch={dispatch}
                                draggingProperty={draggingProperty}
                                getErrorMessage={generateErrorMessage}
                                getItemClassName={getItemClassName}
                                item={item}
                                onDragEnter={onDragEnter}
                                onDragEnterExternalItem={
                                    onDragEnterExternalItem
                                }
                                onDragStart={onDragStart}
                                onMove={moveItemOnPropertyList}
                                onPropertyDisplayNameChange={
                                    onPropertyDisplayNameChange
                                }
                                propertiesLength={
                                    selectedItem[propertiesKeyName].length
                                }
                            />
                        );
                    }
                })}

            {propertyList && propertyList.length > 0 && (
                <div
                    className={
                        propertyInspectorStyles.addPropertyBarPropertyListWrap
                    }
                    onMouseLeave={(e) => {
                        onMouseLeave(e);
                    }}
                >
                    <AddPropertyBar onMouseOver={onPropertyBarMouseOver} />
                </div>
            )}

            <PropertySelector
                setPropertySelectorVisible={setPropertySelectorVisible}
                propertySelectorPosition={propertySelectorPosition}
                className={
                    propertySelectorVisible
                        ? ''
                        : propertyInspectorStyles.propertySelectorHidden
                }
            />
        </div>
    );
};

export default PropertyList;
