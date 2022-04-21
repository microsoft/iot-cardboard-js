import React, { useState } from 'react';
import {
    TextField,
    Stack,
    Text,
    Toggle,
    ActionButton,
    FontIcon,
    Label
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';

interface IModal {
    model?: DTDLModel;
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: number;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
}

export const FormUpdateProperty = ({
    setModalOpen,
    model,
    setModel,
    currentPropertyIndex,
    currentNestedPropertyIndex,
    setCurrentNestedPropertyIndex,
    setModalBody
}: IModal) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const [comment, setComment] = useState(null);
    const [description, setDescription] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [writable, setWritable] = useState(true);
    const [semanticType, setSemanticType] = useState(null);
    const [unit, setUnit] = useState(null);
    const [id, setId] = useState(null);
    const [error, setError] = useState(null);

    const handleUpdatedNestedProperty = () => {
        const activeNestedProperty =
            model.contents[currentPropertyIndex].schema.fields[
                currentNestedPropertyIndex
            ];

        const prop = {
            comment: comment ? comment : activeNestedProperty.comment,
            description: description
                ? description
                : activeNestedProperty.description,
            name: displayName ? displayName : activeNestedProperty.name,
            writable,
            unit: unit ? unit : activeNestedProperty.unit,
            '@id': id ? id : activeNestedProperty['@id'],
            schema: activeNestedProperty.schema
        };

        const modelCopy = Object.assign({}, model);
        modelCopy.contents[currentPropertyIndex].schema.fields[
            currentNestedPropertyIndex
        ] = prop;

        setModel(modelCopy);
        setModalOpen(false);
        setModalBody(null);
        setCurrentNestedPropertyIndex(null);
    };

    const handleUpdateProperty = () => {
        if (currentNestedPropertyIndex !== null) {
            handleUpdatedNestedProperty();
            return;
        }
        const activeProperty = model.contents[currentPropertyIndex];
        const prop = {
            comment: comment ? comment : activeProperty.comment,
            description: description ? description : activeProperty.description,
            name: displayName ? displayName : activeProperty.name,
            writable,
            '@type': semanticType
                ? [...activeProperty['@type'], ...[semanticType]]
                : activeProperty['@type'],
            unit: unit ? unit : activeProperty.unit,
            '@id': id ? id : activeProperty['@id'],
            schema: activeProperty.schema
        };

        const modelCopy = Object.assign({}, model);
        modelCopy.contents[currentPropertyIndex] = prop;
        setModel(modelCopy);
        setModalOpen(false);
        setModalBody(null);
    };

    const getErrorMessage = (value) => {
        const find = model.contents.find((item) => item.name === value);

        if (!find && value !== '') {
            setDisplayName(value);
        }

        setError(!!find);

        return find
            ? `${t('OATPropertyEditor.errorRepeatedPropertyName')}`
            : '';
    };

    return (
        <>
            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Label>
                    {model.contents[currentPropertyIndex]
                        ? model.contents[currentPropertyIndex].name
                        : t('OATPropertyEditor.property')}
                </Label>
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
                    {t('OATPropertyEditor.displayName')}
                </Text>
                <TextField
                    className={propertyInspectorStyles.modalTexField}
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    validateOnFocusOut
                    onGetErrorMessage={getErrorMessage}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.row}>
                <Toggle
                    className={propertyInspectorStyles.modalColumnLeftItem}
                    defaultChecked={writable}
                    onChange={() => {
                        setWritable(!writable);
                    }}
                />
                <Text>{t('OATPropertyEditor.writable')}</Text>
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.semanticType')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolderSemanticType'
                    )}
                    onChange={(_ev, value) => setSemanticType(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.unit')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolderUnit'
                    )}
                    onChange={(_ev, value) => setUnit(value)}
                    disabled={semanticType === null || semanticType === ''}
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
                onClick={handleUpdateProperty}
                disabled={error}
            />
        </>
    );
};

export default FormUpdateProperty;
