import React, { useState, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { TextField, Text, IconButton } from '@fluentui/react';
import {
    getPropertyEditorTextFieldStyles,
    getPropertyListItemIconWrapStyles,
    getPropertyListItemIconWrapMoreStyles
} from '../OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { deepCopy } from '../../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
    SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../../Models/Constants/ActionTypes';

import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName,
    getTargetFromSelection
} from '../Utils';
import { FormBody } from '../Shared/Constants';
import { PropertyListItemNestedProps } from './PropertyListItemNested.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

export const PropertyListItemNested: React.FC<PropertyListItemNestedProps> = (
    props
) => {
    const {
        collectionLength,
        deleteNestedItem,
        dispatch,
        getErrorMessage,
        getItemClassName,
        index,
        item,
        onMove,
        parentIndex
    } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // styles
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const iconWrapStyles = getPropertyListItemIconWrapStyles();
    const iconWrapMoreStyles = getPropertyListItemIconWrapMoreStyles();

    // state
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);

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
    const onDuplicate = () => {
        const duplicate = () => {
            const itemCopy = deepCopy(item);
            itemCopy.name = `${itemCopy.name}_${t('OATPropertyEditor.copy')}`;
            itemCopy.displayName = `${itemCopy.displayName}_${t(
                'OATPropertyEditor.copy'
            )}`;
            itemCopy['@id'] = `${itemCopy['@id']}_${t(
                'OATPropertyEditor.copy'
            )}`;

            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                oatPageState.selection
            );
            modelCopy[propertiesKeyName][parentIndex].schema.fields.push(
                itemCopy
            );
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: modelsCopy }
            });
        };

        const undoDuplicate = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(duplicate, undoDuplicate);
    };

    const onTemplateAddition = () => {
        const addition = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_TEMPLATES,
                payload: {
                    templates: [...oatPageState.currentOntologyTemplates, item]
                }
            });
        };

        const undoAddition = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_TEMPLATES,
                payload: { templates: oatPageState.currentOntologyTemplates }
            });
        };

        execute(addition, undoAddition);
    };

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
            className={getItemClassName(index)}
            id={getModelPropertyListItemName(item.name)}
        >
            <div></div> {/* Needed for gridTemplateColumns style  */}
            {!displayNameEditor && (
                <Text onDoubleClick={() => setDisplayNameEditor(true)}>
                    {item.displayName}
                </Text>
            )}
            {displayNameEditor && (
                <TextField
                    styles={textFieldStyles}
                    borderless
                    placeholder={getModelPropertyListItemName(item.name)}
                    validateOnFocusOut
                    onChange={() => {
                        dispatch({
                            type: SET_OAT_PROPERTY_EDITOR_CURRENT_PROPERTY_INDEX,
                            payload: parentIndex
                        });
                    }}
                    onBlur={() => setDisplayNameEditor(false)}
                    onGetErrorMessage={getErrorMessage}
                />
            )}
            <Text>{item.schema}</Text>
            <IconButton
                styles={iconWrapStyles}
                iconProps={{ iconName: 'info' }}
                title={t('OATPropertyEditor.info')}
                onClick={onInfoButtonClick}
            />
            <IconButton
                styles={iconWrapMoreStyles}
                iconProps={{ iconName: 'more' }}
                title={t('OATPropertyEditor.more')}
                onClick={() => setSubMenuActive(!subMenuActive)}
            >
                {subMenuActive && (
                    <PropertyListItemSubMenu
                        deleteNestedItem={deleteNestedItem}
                        index={index}
                        parentIndex={parentIndex}
                        subMenuActive={subMenuActive}
                        onTemplateAddition={() => {
                            onTemplateAddition();
                        }}
                        onDuplicate={() => {
                            onDuplicate();
                        }}
                        targetId={getModelPropertyListItemName(item.name)}
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

export default PropertyListItemNested;
