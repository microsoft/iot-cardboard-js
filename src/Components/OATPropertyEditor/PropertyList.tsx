import React, { useRef, useState, useMemo } from 'react';
import {
    FontIcon,
    ActionButton,
    Text,
    IContextualMenuItem
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { deepCopy } from '../../Models/Services/Utils';
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
    isSupportedModelType: boolean;
    propertyList?: DTDLProperty[];
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setDraggingProperty: React.Dispatch<React.SetStateAction<boolean>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
};

const moveUpKey = 'moveUp';
const moveDownKey = 'moveDown';

export const PropertyList = ({
    setCurrentPropertyIndex,
    setModalOpen,
    enteredPropertyRef,
    enteredTemplateRef,
    setDraggingProperty,
    setModalBody,
    currentPropertyIndex,
    dispatch,
    state,
    propertyList,
    isSupportedModelType
}: IPropertyList) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const draggedPropertyItemRef = useRef(null);
    const [enteredItem, setEnteredItem] = useState(enteredPropertyRef.current);
    const [lastPropertyFocused, setLastPropertyFocused] = useState(null);
    const dragItem = useRef(null);
    const dragNode = useRef(null);
    const addPropertyLabelRef = useRef(null);
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

    const onPropertyItemDropOnTemplateList = () => {
        const newTemplate = templates ? deepCopy(templates) : [];
        newTemplate.push(
            model[propertiesKeyName][draggedPropertyItemRef.current]
        );

        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: newTemplate
        });
    };

    const onDragEnd = () => {
        if (enteredTemplateRef.current !== null) {
            onPropertyItemDropOnTemplateList();
        }
        dragItem.current = null;
        dragNode.current = null;
        draggedPropertyItemRef.current = null;
        setDraggingProperty(false);
        enteredTemplateRef.current = null;
    };

    const onDragEnter = (e, i) => {
        if (!dragNode.current) {
            onDragEnterExternalItem(i);
            return;
        }
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

    const onDragStart = (e, propertyIndex) => {
        dragItem.current = propertyIndex;
        dragNode.current = e.target;
        draggedPropertyItemRef.current = propertyIndex;
        //  Allows style to change after drag has started
        setTimeout(() => {
            setDraggingProperty(true);
        }, 0);
    };

    const onDragEnterExternalItem = (i) => {
        setEnteredItem(i);
        enteredPropertyRef.current = i;
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

    const handleSelectorPosition = (e, top = null) => {
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
        setLastPropertyFocused(null);
        handleSelectorPosition(e);
    };

    const onAddPropertyLabelMouseOver = (e) => {
        setPropertySelectorVisible(true);
        setLastPropertyFocused(null);

        const buttonTop = addPropertyLabelRef.current.getBoundingClientRect()
            .top;
        handleSelectorPosition(e, buttonTop);
    };

    const onTemplateAddition = (item) => {
        const newTemplates = deepCopy(templates);
        newTemplates.push(item);
        dispatch({
            type: SET_OAT_TEMPLATES,
            payload: newTemplates
        });
    };

    const onDuplicate = (item) => {
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

    const onMoveUp = (item) => {
        // Move up the current property
        const newModel = deepCopy(model);
        const currentIndex = newModel[propertiesKeyName].findIndex(
            (property) => property['@id'] === item['@id']
        );
        if (currentIndex > 0) {
            const previousProperty =
                newModel[propertiesKeyName][currentIndex - 1];
            newModel[propertiesKeyName][currentIndex - 1] = item;
            newModel[propertiesKeyName][currentIndex] = previousProperty;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: newModel
            });
        }
    };

    const onMoveDown = (item) => {
        // Move down the current property
        const newModel = deepCopy(model);
        const currentIndex = newModel[propertiesKeyName].findIndex(
            (property) => property['@id'] === item['@id']
        );
        if (currentIndex < newModel[propertiesKeyName].length - 1) {
            const nextProperty = newModel[propertiesKeyName][currentIndex + 1];
            newModel[propertiesKeyName][currentIndex + 1] = item;
            newModel[propertiesKeyName][currentIndex] = nextProperty;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: newModel
            });
        }
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
            let menuItems = [
                {
                    key: 'edit',
                    text: t('OATPropertyEditor.addToTemplate'),
                    iconProps: {
                        iconName: 'Add',
                        className:
                            propertyInspectorStyles.propertySubMenuItemIcon
                    },
                    onClick: () => onTemplateAddition(item),
                    id: 'addOverflow',
                    'data-testid': 'addOverflow'
                },
                {
                    key: moveUpKey,
                    text: t('OATPropertyEditor.moveUp'),
                    iconProps: {
                        iconName: 'up',
                        className:
                            propertyInspectorStyles.propertySubMenuItemIcon
                    },
                    onClick: () => onMoveUp(item),
                    id: moveUpKey,
                    'data-testid': moveUpKey
                },
                {
                    key: moveDownKey,
                    text: t('OATPropertyEditor.moveDown'),
                    iconProps: {
                        iconName: 'down',
                        className:
                            propertyInspectorStyles.propertySubMenuItemIcon
                    },
                    onClick: () => onMoveDown(item),
                    id: moveDownKey,
                    'data-testid': moveDownKey
                },
                {
                    key: 'manageLayers',
                    text: t('OATPropertyEditor.duplicate'),
                    iconProps: {
                        iconName: 'Copy',
                        className:
                            propertyInspectorStyles.propertySubMenuItemIcon
                    },
                    onClick: () => onDuplicate(item),
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

            // If item is the first one, remove the move up option
            if (index === 0) {
                menuItems = menuItems.filter(
                    (menuItem) => menuItem.key !== moveUpKey
                );
            }

            // If item is the last one, remove the move down option
            if (index === model[propertiesKeyName].length - 1) {
                menuItems = menuItems.filter(
                    (menuItem) => menuItem.key !== moveDownKey
                );
            }

            return menuItems;
        };
        const properties = propertyList.map((item, index) => {
            const viewModel: ICardboardListItem<IOATProperty> = {
                ariaLabel: t('OATPropertyEditor.info'),
                iconStart: { name: 'info' },
                item: {
                    id: item['@id'],
                    displayName: item.displayName,
                    index: index
                },
                onClick: listItemOnClick,
                overflowMenuItems: getMenuItems(item, index),
                textPrimary: item.displayName,
                textSecondary: item.schema.toString(),
                draggable: true,
                onDragStart: (e) => onDragStart(e, index),
                onDragEnter: (e) => onDragEnter(e, index),
                onDragEnd
            };
            return viewModel;
        });
        setPropertyListItems(properties);
    }, [propertyList]);

    return (
        <div className={propertyInspectorStyles.propertiesWrap}>
            {isSupportedModelType &&
                model &&
                propertyList &&
                propertyList.length === 0 && (
                    <div
                        className={
                            propertyInspectorStyles.addPropertyMessageWrap
                        }
                        onMouseOver={(e) => {
                            onAddPropertyLabelMouseOver(e);
                        }}
                        onMouseLeave={(e) => {
                            onMouseLeave(e);
                        }}
                        ref={addPropertyLabelRef}
                    >
                        <ActionButton>
                            <FontIcon
                                iconName={'CirclePlus'}
                                className={
                                    propertyInspectorStyles.iconAddProperty
                                }
                            />
                            <Text>{t('OATPropertyEditor.addProperty')}</Text>
                        </ActionButton>
                    </div>
                )}

            <CardboardList<IOATProperty>
                items={propertyListItems}
                listKey={'properties'}
            />

            {propertyList && propertyList.length > 0 && (
                <div
                    className={
                        propertyInspectorStyles.addPropertyBarPropertyListWrap
                    }
                    onMouseLeave={(e) => {
                        onMouseLeave(e);
                    }}
                >
                    {model && model[propertiesKeyName].length > 0 && (
                        <AddPropertyBar
                            onMouseOver={(e) => {
                                onPropertyBarMouseOver(e);
                            }}
                            onClick={(e) => {
                                onPropertyBarMouseOver(e);
                            }}
                        />
                    )}
                </div>
            )}

            <PropertySelector
                setPropertySelectorVisible={setPropertySelectorVisible}
                lastPropertyFocused={lastPropertyFocused}
                dispatch={dispatch}
                state={state}
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
