import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
    FontIcon,
    ActionButton,
    Text,
    IContextualMenuItem
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
import PropertyListItem from './PropertyListItem';
import PropertyListItemNest from './PropertyListItemNest';
import PropertySelector from './PropertySelector';
import AddPropertyBar from './AddPropertyBar';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_TEMPLATES,
    SET_OAT_CONFIRM_DELETE_OPEN
} from '../../Models/Constants/ActionTypes';
import {
    DTDLProperty,
    IAction,
    IOATProperty
} from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    getModelPropertyCollectionName,
    shouldClosePropertySelectorOnMouseLeave
} from './Utils';
import { CardboardList } from '../CardboardList/CardboardList';
import { ICardboardListItem } from '../CardboardList/CardboardList.types';
import { FormBody } from './Constants';

type IPropertyList = {
    currentPropertyIndex: number;
    draggingProperty: boolean;
    draggingTemplate: boolean;
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    propertyList?: DTDLProperty[];
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setDraggingProperty: React.Dispatch<React.SetStateAction<boolean>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
    setModalBody,
    currentPropertyIndex,
    dispatch,
    state,
    propertyList
}: IPropertyList) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const draggedPropertyItemRef = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
    const [lastPropertyFocused, setLastPropertyFocused] = useState(null);
    const dragItem = useRef(null);
    const dragNode = useRef(null);
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
    ] = useState(null);
    const [propertyListItems, setPropertyListItems] = useState<
        ICardboardListItem<IOATProperty>[]
    >([]);
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
        console.log('e', e);
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

    const handlePropertyDisplayNameChange = (value, index) => {
        const newModel = deepCopy(model);
        if (index === undefined) {
            newModel[propertiesKeyName][
                currentPropertyIndex
            ].displayName = value;
        } else {
            newModel[propertiesKeyName][index].displayName = value;
        }
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: newModel });
    };

    const generateErrorMessage = (value, index) => {
        if (value) {
            const find = model[propertiesKeyName].find(
                (item) => item.name === value
            );

            if (!find && value !== '') {
                handlePropertyDisplayNameChange(value, index);
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
        const dispatchDelete = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: newModel
            });
        };
        dispatch({
            type: SET_OAT_CONFIRM_DELETE_OPEN,
            payload: { open: true, callback: dispatchDelete }
        });
    };

    const handleSelectorPosition = (e) => {
        if (e) {
            const boundingRect = e.target.getBoundingClientRect();
            setPropertySelectorPosition({
                ...propertySelectorPosition,
                top: boundingRect.top,
                left: boundingRect.left
            });
            setPropertySelectorTriggerElementsBoundingBox(boundingRect);
        }
    };

    const handleMouseLeave = (e) => {
        if (
            shouldClosePropertySelectorOnMouseLeave(
                e,
                propertySelectorTriggerElementsBoundingBox
            )
        ) {
            setPropertySelectorVisible(false);
        }
    };

    const handlePropertyBarMouseOver = (e) => {
        setPropertySelectorVisible(true);
        setLastPropertyFocused(null);
        handleSelectorPosition(e);
    };

    const handlePropertyWrapScrollMouseOver = (e) => {
        setPropertySelectorVisible(true);
        setLastPropertyFocused(null);
        handleSelectorPosition(e);
    };

    const handleTemplateAddition = (item) => {
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: [...templates, item]
        });
    };

    const handleDuplicate = (item) => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
        itemCopy.displayName = `${itemCopy.displayName}_${t(
            'OATPropertyEditor.copy'
        )}`;
        itemCopy['@id'] = `${itemCopy['@id']}_${t('OATPropertyEditor.copy')}`;

        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName].push(itemCopy);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    const handleItemDragStart = () => {
        console.log('dragging');
    };

    const getListItems = useMemo(() => {
        const listItemOnClick = (item) => {
            setCurrentPropertyIndex(item.index);
            setModalOpen(true);
            setModalBody(FormBody.property);
        };
        const getMenuItems = (
            item: DTDLProperty,
            index: number
        ): IContextualMenuItem[] => {
            return [
                {
                    key: 'edit',
                    text: t('OATPropertyEditor.addToTemplate'),
                    iconProps: {
                        iconName: 'Add',
                        className:
                            propertyInspectorStyles.propertySubMenuItemIcon
                    },
                    onClick: () => handleTemplateAddition(item),
                    id: 'addOverflow',
                    'data-testid': 'addOverflow'
                },
                {
                    key: 'manageLayers',
                    text: t('OATPropertyEditor.duplicate'),
                    iconProps: {
                        iconName: 'Copy',
                        className:
                            propertyInspectorStyles.propertySubMenuItemIcon
                    },
                    onClick: () => handleDuplicate(item),
                    id: 'duplicateOverflow',
                    'data-testid': 'duplicateOverflow'
                },
                {
                    key: 'removeFromThisScene',
                    text: t('OATPropertyEditor.remove'),
                    iconProps: {
                        iconName: 'Delete',
                        className:
                            propertyInspectorStyles.propertySubMenuItemIconRemove
                    },
                    onClick: () => deleteItem(index),
                    id: 'removeOverflow',
                    'data-testid': 'removeOverflow'
                }
            ];
        };
        const properties = propertyList.map((item, index) => {
            const viewModel: ICardboardListItem<IOATProperty> = {
                ariaLabel: t('OATPropertyEditor.info'),
                iconStart: { name: 'info' },
                item: {
                    id: item['@id'],
                    displayName: item.displayName,
                    index: index
                    // draggable: true,
                    // onDragStart: () => handleItemDragStart()
                },
                onClick: listItemOnClick,
                overflowMenuItems: getMenuItems(item, index),
                textPrimary: item.displayName,
                textSecondary: item.schema.toString(),
                draggable: true,
                onDragStart: (e) => handleDragStart(e, index)
            };
            return viewModel;
        });
        setPropertyListItems(properties);
    }, [propertyList]);

    return (
        <div className={propertyInspectorStyles.propertiesWrap}>
            {model && propertyList && propertyList.length === 0 && (
                <div
                    className={propertyInspectorStyles.addPropertyMessageWrap}
                    onMouseOver={(e) => {
                        handlePropertyWrapScrollMouseOver(e);
                    }}
                    onMouseLeave={(e) => {
                        handleMouseLeave(e);
                    }}
                >
                    <ActionButton
                        styles={{
                            root: {
                                paddingLeft: '10px',
                                height: 'fit-content'
                            }
                        }}
                        onClick={(e) => {
                            handlePropertyWrapScrollMouseOver(e);
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

            <div
                draggable
                onDragStart={(e) => {
                    handleItemDragStart();
                }}
                style={{ width: '100%', height: '40px', background: 'black' }}
            >
                <span>span</span>
            </div>

            <CardboardList<IOATProperty>
                items={propertyListItems}
                listKey={'properties'}
                listProps={
                    {
                        // draggable: true,
                        // onDragStart: (e) => {
                        //     handleDragStart(e, currentPropertyIndex);
                        // }
                    }
                }
            />

            {propertyList && propertyList.length > 0 && (
                <div
                    className={
                        propertyInspectorStyles.addPropertyBarPropertyListWrap
                    }
                    onMouseLeave={(e) => {
                        handleMouseLeave(e);
                    }}
                >
                    {model && model[propertiesKeyName].length > 0 && (
                        <AddPropertyBar
                            onMouseOver={(e) => {
                                handlePropertyBarMouseOver(e);
                            }}
                            onClick={(e) => {
                                handlePropertyBarMouseOver(e);
                            }}
                        />
                    )}
                </div>
            )}

            {propertySelectorVisible && (
                <PropertySelector
                    setPropertySelectorVisible={setPropertySelectorVisible}
                    lastPropertyFocused={lastPropertyFocused}
                    dispatch={dispatch}
                    state={state}
                    propertySelectorPosition={propertySelectorPosition}
                />
            )}
        </div>
    );
};

export default PropertyList;
