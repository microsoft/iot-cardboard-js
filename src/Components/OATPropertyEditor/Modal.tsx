import React, { useState } from 'react';
import {
    Modal as FluentModal,
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

export const Modal = ({
    modalOpen,
    setModalOpen,
    model,
    setModel,
    currentPropertyIndex
}) => {
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

    const handleUpdateProperty = () => {
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
            '@id': id ? id : activeProperty.unit
        };

        const modelCopy = Object.assign({}, model);
        modelCopy.contents[currentPropertyIndex] = prop;
        setModel(modelCopy);
        setModalOpen(false);
    };

    const getErrorMessage = (value) => {
        const find = model.contents.find((item) => item.name === value);

        if (!find && value !== '') {
            setDisplayName(value);
        }

        if (find) {
            setError(true);
        } else {
            setError(false);
        }

        return find ? `A property with the same name already exists` : '';
    };

    return (
        <FluentModal
            isOpen={modalOpen}
            containerClassName={propertyInspectorStyles.modal}
        >
            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Label>
                    {model.contents[currentPropertyIndex]
                        ? model.contents[currentPropertyIndex].name
                        : 'Property'}
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
                    placeholder="This property..."
                    onChange={(_ev, value) => setComment(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.description')}
                </Text>
                <TextField
                    placeholder="Line1"
                    onChange={(_ev, value) => setDescription(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.displayName')}
                </Text>
                <TextField
                    className={propertyInspectorStyles.modalTexField}
                    placeholder="This property..."
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
                    Semantic Type
                </Text>
                <TextField
                    placeholder="current..."
                    onChange={(_ev, value) => setSemanticType(value)}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.unit')}
                </Text>
                <TextField
                    placeholder="unit..."
                    onChange={(_ev, value) => setUnit(value)}
                    disabled={semanticType === null || semanticType === ''}
                />
            </Stack>

            <Stack className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text className={propertyInspectorStyles.modalColumnLeftItem}>
                    {t('OATPropertyEditor.id')}
                </Text>
                <TextField
                    placeholder="id"
                    onChange={(_ev, value) => setId(value)}
                />
            </Stack>

            <PrimaryButton
                text={t('OATPropertyEditor.update')}
                allowDisabledFocus
                onClick={handleUpdateProperty}
                disabled={error}
            />
        </FluentModal>
    );
};

export default Modal;
