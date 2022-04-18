import React from 'react';
import { TextField, Stack, Text } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';

type IEnumItem = {
    item?: any;
    index?: number;
    setModel?: any;
    model?: any;
};

export const PropertyListMapItemNested = ({
    item,
    model,
    setModel,
    index
}: IEnumItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const updateMapKeyName = (value) => {
        const modelCopy = Object.assign({}, model);
        modelCopy.contents[index].schema.mapKey.name = value;
        setModel(modelCopy);
    };

    const updateMapValueName = (value) => {
        const modelCopy = Object.assign({}, model);
        modelCopy.contents[index].schema.mapValue.name = value;
        setModel(modelCopy);
    };

    return (
        <>
            <Stack className={propertyInspectorStyles.mapItem} tabIndex={0}>
                <Text className={propertyInspectorStyles.mapItemKeyValueLabel}>
                    {t('OATPropertyEditor.key')}
                </Text>
                <Stack className={propertyInspectorStyles.mapItemInputWrap}>
                    <TextField
                        className={
                            propertyInspectorStyles.propertyItemTextField
                        }
                        borderless
                        placeholder={item.schema.mapKey.name}
                        onChange={(_ev, value) => updateMapKeyName(value)}
                    />
                    <Text>{item.schema.mapKey.schema}</Text>
                </Stack>
            </Stack>
            <Stack className={propertyInspectorStyles.mapItem} tabIndex={0}>
                <Text className={propertyInspectorStyles.mapItemKeyValueLabel}>
                    {t('OATPropertyEditor.value')}
                </Text>
                <Stack className={propertyInspectorStyles.mapItemInputWrap}>
                    <TextField
                        className={
                            propertyInspectorStyles.propertyItemTextField
                        }
                        borderless
                        placeholder={item.schema.mapValue.name}
                        onChange={(_ev, value) => updateMapValueName(value)}
                    />
                    <Text>{item.schema.mapValue.schema}</Text>
                </Stack>
            </Stack>
        </>
    );
};

export default PropertyListMapItemNested;
