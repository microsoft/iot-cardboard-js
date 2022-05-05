import React from 'react';
import { TextField, Stack, Label, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getGeneralPropertiesWrapStyles,
    getPropertyEditorTextFieldStyles
} from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';

type IPropertiesModelSummary = {
    model?: DTDLModel;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
};

export const PropertiesModelSummary = ({
    model,
    setModel
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
                    disabled={!model}
                    value={model ? model.displayName : ''}
                    onChange={(_ev, value) => {
                        const modelCopy = Object.assign({}, model);
                        modelCopy.displayName = value;
                        setModel(modelCopy);
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
                    onChange={(_ev, value) => {
                        const modelCopy = Object.assign({}, model);
                        modelCopy['@id'] = value;
                        setModel(modelCopy);
                    }}
                />
            </div>
        </Stack>
    );
};

export default PropertiesModelSummary;
