import React from 'react';
import { TextField, Stack, Label, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getGeneralPropertiesWrapStyles,
    getPropertyEditorTextFieldStyles
} from './OATPropertyEditor.styles';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { deepCopy } from '../../Models/Services/Utils';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

type IPropertiesModelSummary = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};

export const PropertiesModelSummary = ({
    dispatch,
    state
}: IPropertiesModelSummary) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const generalPropertiesWrapStyles = getGeneralPropertiesWrapStyles();
    const textFieldStyes = getPropertyEditorTextFieldStyles();
    const { model } = state;

    return (
        <Stack styles={generalPropertiesWrapStyles}>
            <Label>{`${t('OATPropertyEditor.general')}`}</Label>
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.displayName')}</Text>
                <TextField
                    styles={textFieldStyes}
                    borderless
                    disabled={!model}
                    value={model ? model.displayName : ''}
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
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.assetId')}</Text>
                <TextField
                    styles={textFieldStyes}
                    borderless
                    disabled={!model}
                    value={model ? model['@id'] : ''}
                    placeholder={t('OATPropertyEditor.assetId')}
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
        </Stack>
    );
};

export default PropertiesModelSummary;
