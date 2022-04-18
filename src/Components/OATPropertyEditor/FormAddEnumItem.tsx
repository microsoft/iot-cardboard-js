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
    const [displayName, setDisplayName] = useState(null);
    const [name, setName] = useState(null);
    const [enumValue, setEnumValue] = useState(null);
    const [id, setId] = useState(null);
    const [comment, setComment] = useState(null);
    const [description, setDescription] = useState(null);
    const [error, setError] = useState(null);

    const handelAddEnumValue = () => {
        const activeItem =
            model.contents[currentPropertyIndex].schema.enumValues;
        const prop = {
            '@id': id ? `dtmi:com:adt:${id};` : 'dtmi:com:adt:enum;',
            name: name ? name : activeItem.name,
            displayName: displayName ? displayName : 'enum_item',
            enumValue: enumValue ? enumValue : activeItem.enumValue,
            comment: comment ? comment : activeItem.comment,
            description: description ? description : activeItem.description
        };

        const modelCopy = Object.assign({}, model);
        modelCopy.contents[currentPropertyIndex].schema.enumValues.push(prop);
        setModel(modelCopy);
        setModalOpen(false);
        setModalBody(null);
    };

    const getErrorMessage = (value) => {
        const find = model.contents[
            currentPropertyIndex
        ].schema.enumValues.find((item) => item.enumValue === value);
        if (!find && value !== '') {
            setEnumValue(value);
        }

        setError(!!find);

        return find ? `${t('OATPropertyEditor.errorRepeatedEnumValue')}` : '';
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
                    {t('OATPropertyEditor.comment')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setComment(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {`*${t('OATPropertyEditor.name')}`}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setName(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.displayName')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setDisplayName(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.description')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolderDescription'
                    )}
                    onChange={(_ev, value) => setDescription(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {`*${t('OATPropertyEditor.enumValue')}`}
                </Text>
                <TextField
                    className={propertyInspectorStyles.modalTexField}
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    type="number"
                    validateOnFocusOut
                    onGetErrorMessage={getErrorMessage}
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
                disabled={error || !!enumValue === false || !!name === false}
            />
        </>
    );
};

export default FormAddEnumItem;
