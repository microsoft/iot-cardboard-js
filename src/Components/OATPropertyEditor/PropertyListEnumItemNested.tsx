import React, { useState, useContext } from 'react';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertyListItemIconWrapMoreStyles,
    getPropertyEditorTextFieldStyles
} from './OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { SET_OAT_SELECTED_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { deepCopy } from '../../Models/Services/Utils';
import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName
} from './Utils';

type IEnumItem = {
    collectionLength?: number;
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    index?: number;
    item?: any;
    onMove?: (index: number, moveUp: boolean) => void;
    parentIndex?: number;
    state?: IOATEditorState;
};

export const PropertyListEnumItemNested = ({
    collectionLength,
    deleteNestedItem,
    dispatch,
    item,
    onMove,
    index,
    parentIndex,
    state
}: IEnumItem) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const { model } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const updateEnum = (value: string) => {
        const update = () => {
            const activeItem =
                model[propertiesKeyName][parentIndex].schema.enumValues[index];
            const prop = {
                displayName: value
            };
            const modelCopy = deepCopy(model);
            modelCopy[propertiesKeyName][parentIndex].schema.enumValues[
                index
            ] = {
                ...activeItem,
                ...prop
            };

            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: modelCopy
            });
        };

        const undoUpdate = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
        };

        execute(update, undoUpdate);
    };

    const onGetErrorMessage = (value: string) => {
        if (value === '') {
            return value;
        }

        const find = model[propertiesKeyName][
            parentIndex
        ].schema.enumValues.find((item) => item.name === value);

        if (!find) {
            updateEnum(value);
        }

        return find
            ? `${t('OATPropertyEditor.errorRepeatedPropertyName')}`
            : '';
    };

    return (
        <div
            className={propertyInspectorStyles.enumItem}
            tabIndex={0}
            id={`enum_${item.name}`}
        >
            <div></div> {/* Needed for gridTemplateColumns style  */}
            <TextField
                styles={textFieldStyles}
                borderless
                placeholder={
                    item.displayName
                        ? getModelPropertyListItemName(item.displayName)
                        : getModelPropertyListItemName(item.name)
                }
                validateOnFocusOut
                onGetErrorMessage={onGetErrorMessage}
            />
            <Text>{item.enumValue}</Text>
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
