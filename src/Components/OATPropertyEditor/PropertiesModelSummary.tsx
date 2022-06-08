import React from 'react';
import { TextField, Stack, Label, Text, IconButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getGeneralPropertiesWrapStyles,
    getPropertyEditorTextFieldStyles,
    geIconWrapFitContentStyles
} from './OATPropertyEditor.styles';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { deepCopy } from '../../Models/Services/Utils';
import { getModelPropertyListItemName } from './Utils';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { ModelTypes } from '../../Models/Constants/Enums';

type IPropertiesModelSummary = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
};

export const PropertiesModelSummary = ({
    dispatch,
    setModalBody,
    setModalOpen,
    state
}: IPropertiesModelSummary) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapStyles = geIconWrapFitContentStyles();
    const generalPropertiesWrapStyles = getGeneralPropertiesWrapStyles();
    const textFieldStyes = getPropertyEditorTextFieldStyles();
    const { model } = state;

    return (
        <Stack styles={generalPropertiesWrapStyles}>
            <div className={propertyInspectorStyles.rowSpaceBetween}>
                <Label>{`${t('OATPropertyEditor.general')}`}</Label>
                {model && model['@type'] === ModelTypes.interface && (
                    <IconButton
                        styles={iconWrapStyles}
                        iconProps={{ iconName: 'info' }}
                        title={t('OATPropertyEditor.info')}
                        onClick={() => {
                            setModalBody('FormRootModel');
                            setModalOpen(true);
                        }}
                    />
                )}
            </div>
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('type')}</Text>
                <Text className={propertyInspectorStyles.typeTextField}>
                    {model ? model['@type'] : ''}
                </Text>
            </div>
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('id')}</Text>
                <TextField
                    styles={textFieldStyes}
                    borderless
                    disabled={!model}
                    value={model ? model['@id'] : ''}
                    placeholder={t('id')}
                    onChange={(_ev, value) => {
                        const modelCopy = deepCopy(model);
                        modelCopy['@id'] = value;
                        dispatch({
                            type: SET_OAT_PROPERTY_EDITOR_MODEL,
                            payload: modelCopy
                        });
                    }}
                />
            </div>
            {model && model.name && (
                <div className={propertyInspectorStyles.gridRow}>
                    <Text>{t('name')}</Text>
                    <TextField
                        styles={textFieldStyes}
                        borderless
                        disabled={!model}
                        value={
                            model && model.name
                                ? getModelPropertyListItemName(model.name)
                                : ''
                        }
                        placeholder={t('name')}
                        onChange={(_ev, value) => {
                            const modelCopy = deepCopy(model);
                            modelCopy.name = value;
                            dispatch({
                                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                                payload: modelCopy
                            });
                        }}
                    />
                </div>
            )}
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.displayName')}</Text>
                <TextField
                    styles={textFieldStyes}
                    borderless
                    disabled={!model}
                    value={
                        model && model.displayName
                            ? getModelPropertyListItemName(model.displayName)
                            : ''
                    }
                    placeholder={t('OATPropertyEditor.displayName')}
                    onChange={(_ev, value) => {
                        const modelCopy = deepCopy(model);
                        modelCopy.displayName = value;
                        dispatch({
                            type: SET_OAT_PROPERTY_EDITOR_MODEL,
                            payload: modelCopy
                        });
                    }}
                />
            </div>
        </Stack>
    );
};

export default PropertiesModelSummary;
