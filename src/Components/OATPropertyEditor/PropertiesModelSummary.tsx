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

type IPropertiesModelSummary = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state: any;
};

export const PropertiesModelSummary = ({
    dispatch,
    state
}: IPropertiesModelSummary) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const generalPropertiesWrapStyles = getGeneralPropertiesWrapStyles();
    const textFieldStyes = getPropertyEditorTextFieldStyles();

    return (
        <Stack styles={generalPropertiesWrapStyles}>
            <Label>{`${t('OATPropertyEditor.general')} (3)`}</Label>
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.displayName')}</Text>
                <TextField
                    styles={textFieldStyes}
                    borderless
                    disabled={!state.model}
                    value={state.model ? state.model.displayName : ''}
                    onChange={(_ev, value) => {
                        const modelCopy = Object.assign({}, state.model);
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
                    disabled={!state.model}
                    value={state.model ? state.model['@id'] : ''}
                    onChange={(_ev, value) => {
                        const modelCopy = Object.assign({}, state.model);
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
