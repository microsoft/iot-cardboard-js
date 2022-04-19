import React from 'react';
import { TextField, Stack, Label, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

type IPropertiesModelSummary = {
    model?: any;
    setModel?: React.Dispatch<React.SetStateAction<any>>;
};

export const PropertiesModelSummary = ({
    model,
    setModel
}: IPropertiesModelSummary) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <Stack className={propertyInspectorStyles.gridGeneralPropertiesWrap}>
            <Label>{`${t('OATPropertyEditor.displayName')} (3)`}</Label>
            <Stack className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.general')}</Text>
                <TextField
                    className={propertyInspectorStyles.propertyItemTextField}
                    borderless
                    placeholder={model.displayName}
                    onChange={(_ev, value) => {
                        const modelCopy = {
                            ...model,
                            displayName: value
                        };
                        setModel(modelCopy);
                    }}
                />
            </Stack>
            <Stack className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.assetId')}</Text>
                <TextField
                    className={propertyInspectorStyles.propertyItemTextField}
                    borderless
                    placeholder={model['@id']}
                    onChange={(_ev, value) => {
                        const modelCopy = {
                            ...model,
                            '@id': value
                        };
                        setModel(modelCopy);
                    }}
                />
            </Stack>
            <Stack className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.type')}</Text>
                <TextField
                    className={propertyInspectorStyles.propertyItemTextField}
                    borderless
                    placeholder={model['@type']}
                    onChange={(_ev, value) => {
                        const modelCopy = {
                            ...model,
                            '@type': value
                        };
                        setModel(modelCopy);
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default PropertiesModelSummary;
