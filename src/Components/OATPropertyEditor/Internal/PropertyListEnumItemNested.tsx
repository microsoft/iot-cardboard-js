import React, { useState } from 'react';
import { Text, IconButton } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertyListItemIconWrapMoreStyles
} from '../OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { getModelPropertyListItemName } from '../Utils';
import { EnumItemProps } from './PropertyListEnumItemNested.types';
import {
    SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
    SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
    SET_OAT_PROPERTY_MODAL_OPEN,
    SET_OAT_PROPERTY_MODAL_BODY
} from '../../../Models/Constants/ActionTypes';
import { FormBody } from '../Shared/Constants';

export const PropertyListEnumItemNested = ({
    collectionLength,
    deleteNestedItem,
    dispatch,
    item,
    onMove,
    index,
    parentIndex
}: EnumItemProps) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

    const onInfoButtonClick = () => {
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
            payload: index
        });
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
            payload: parentIndex
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_OPEN,
            payload: true
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_BODY,
            payload: FormBody.property
        });
    };

    return (
        <div
            className={propertyInspectorStyles.enumItem}
            tabIndex={0}
            id={`enum_${item.name}`}
        >
            <div></div> {/* Needed for gridTemplateColumns style  */}
            <Text>{getModelPropertyListItemName(item.name)}</Text>
            <Text>{item.enumValue}</Text>
            <IconButton
                iconProps={{ iconName: 'info' }}
                styles={iconWrapMoreStyles}
                title={t('OATPropertyEditor.info')}
                onClick={onInfoButtonClick}
            />
            <IconButton
                iconProps={{
                    iconName: 'more'
                }}
                styles={iconWrapMoreStyles}
                title={t('OATPropertyEditor.more')}
                onClick={() => setSubMenuActive(!subMenuActive)}
            >
                {subMenuActive && (
                    <PropertyListItemSubMenu
                        deleteNestedItem={deleteNestedItem}
                        index={index}
                        parentIndex={parentIndex}
                        subMenuActive={subMenuActive}
                        duplicateItem={false}
                        addItemToTemplates={false}
                        targetId={`enum_${item.name}`}
                        setSubMenuActive={setSubMenuActive}
                        onMoveUp={
                            // Use function if item is not the first item in the list
                            index > 0 ? onMove : null
                        }
                        onMoveDown={
                            // Use function if item is not the last item in the list
                            index < collectionLength - 1 ? onMove : null
                        }
                    />
                )}
            </IconButton>
        </div>
    );
};

export default PropertyListEnumItemNested;
