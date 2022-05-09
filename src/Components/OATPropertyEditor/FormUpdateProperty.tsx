import React, { useState } from 'react';
import {
    TextField,
    Text,
    Toggle,
    ActionButton,
    FontIcon,
    Label
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getModalLabelStyles
} from './OATPropertyEditor.styles';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: number;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: any;
}

export const FormUpdateProperty = ({
    dispatch,
    setModalOpen,
    currentPropertyIndex,
    currentNestedPropertyIndex,
    setCurrentNestedPropertyIndex,
    setModalBody,
    state
}: IModal) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const columnLeftTextStyles = getModalLabelStyles();
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
            state.model.contents[currentPropertyIndex].schema.fields[
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

        const modelCopy = Object.assign({}, state.model);
        modelCopy.contents[currentPropertyIndex].schema.fields[
            currentNestedPropertyIndex
        ] = prop;

        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
        setModalOpen(false);
        setModalBody(null);
        setCurrentNestedPropertyIndex(null);
    };

    const handleUpdateProperty = () => {
        if (currentNestedPropertyIndex !== null) {
            handleUpdatedNestedProperty();
            return;
        }
        const activeProperty = state.model.contents[currentPropertyIndex];
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

        const modelCopy = Object.assign({}, state.model);
        modelCopy.contents[currentPropertyIndex] = prop;
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
        setModalOpen(false);
        setModalBody(null);
    };

    const getErrorMessage = (value) => {
        const find = state.model.contents.find((item) => item.name === value);

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
            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Label>
                    {state.model.contents[currentPropertyIndex]
                        ? state.model.contents[currentPropertyIndex].name
                        : t('OATPropertyEditor.property')}
                </Label>
                <ActionButton onClick={() => setModalOpen(false)}>
                    <FontIcon
                        iconName={'ChromeClose'}
                        className={
                            propertyInspectorStyles.iconClosePropertySelector
                        }
                    />
                </ActionButton>
            </div>

            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.comment')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setComment(value)}
                />
            </div>

            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.description')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolderDescription'
                    )}
                    onChange={(_ev, value) => setDescription(value)}
                />
            </div>

            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text styles={columnLeftTextStyles}>
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
            </div>

            <div className={propertyInspectorStyles.row}>
                <Toggle
                    styles={columnLeftTextStyles}
                    defaultChecked={writable}
                    onChange={() => {
                        setWritable(!writable);
                    }}
                />
                <Text>{t('OATPropertyEditor.writable')}</Text>
            </div>

            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.semanticType')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolderSemanticType'
                    )}
                    onChange={(_ev, value) => setSemanticType(value)}
                />
            </div>

            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.unit')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolderUnit'
                    )}
                    onChange={(_ev, value) => setUnit(value)}
                    disabled={semanticType === null || semanticType === ''}
                />
            </div>

            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.id')}
                </Text>
                <TextField
                    placeholder={t('OATPropertyEditor.id')}
                    onChange={(_ev, value) => setId(value)}
                />
            </div>

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
