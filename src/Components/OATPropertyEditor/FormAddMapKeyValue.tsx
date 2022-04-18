import React, { useState } from 'react';
import {
    TextField,
    Stack,
    Text,
    ActionButton,
    FontIcon,
    Label
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

interface IModal {
    setModalOpen?: any;
    model?: any;
    setModel?: any;
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: any;
    setCurrentNestedPropertyIndex?: any;
    setModalBody?: any;
}

export const FormAddEnumItem = ({
    setModalOpen,
    model,
    setModel,
    currentPropertyIndex,
    setModalBody
}: IModal) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const [keyName, setKeyName] = useState(null);
    const [valueName, setValueName] = useState(null);
    const [schema, setSchema] = useState(null);
    const [id, setId] = useState(null);

    const handelAddEnumValue = () => {
        const activeItem = model.contents[currentPropertyIndex].schema;

        const mapKey = {
            '@id': id ? `dtmi:com:adt:mapKey${id};` : 'dtmi:com:adt:mapKey;',
            name: keyName ? keyName : activeItem.name,
            schema: 'string'
        };
        const mapValue = {
            '@id': id
                ? `dtmi:com:adt:mapValue${id};`
                : 'dtmi:com:adt:mapValue;',
            name: valueName ? valueName : activeItem.name,
            schema: schema ? schema : 'string'
        };

        const modelCopy = Object.assign({}, model);
        modelCopy.contents[currentPropertyIndex].schema.mapKey = mapKey;
        modelCopy.contents[currentPropertyIndex].schema.mapValue = mapValue;
        setModel(modelCopy);
        setModalOpen(false);
        setModalBody(null);
    };

    return (
        <>
            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Label>{t('OATPropertyEditor.addEnumValue')}</Label>
                <ActionButton
                    onClick={() => setModalOpen(false)}
                    className={
                        propertyInspectorStyles.iconClosePropertySelectorWrap
                    }
                >
                    <FontIcon
                        iconName={'ChromeClose'}
                        className={
                            propertyInspectorStyles.iconClosePropertySelector
                        }
                    />
                </ActionButton>
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {`*${t('OATPropertyEditor.mapKeyName')}`}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setKeyName(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {`*${t('OATPropertyEditor.mapValueName')}`}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setValueName(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {`*${t('OATPropertyEditor.schemaType')}`}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setSchema(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.id')}
                </Text>
                <TextField
                    placeholder={t('OATPropertyEditor.id')}
                    onChange={(_ev, value) => setId(value)}
                />
            </Stack>

            <PrimaryButton
                text={t('OATPropertyEditor.update')}
                allowDisabledFocus
                onClick={handelAddEnumValue}
                disabled={
                    !!valueName === false ||
                    !!keyName === false ||
                    !!schema === false
                }
            />
        </>
    );
};

export default FormAddEnumItem;
