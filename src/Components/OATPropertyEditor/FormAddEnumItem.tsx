import React, { useState } from 'react';
import {
    TextField,
    Text,
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

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<any>>;
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: number;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state: any;
}

export const FormAddEnumItem = ({
    dispatch,
    setModalOpen,
    currentPropertyIndex,
    setModalBody,
    state
}: IModal) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const columnLeftTextStyles = getModalLabelStyles();
    const [displayName, setDisplayName] = useState(null);
    const [name, setName] = useState(null);
    const [enumValue, setEnumValue] = useState(null);
    const [id, setId] = useState(null);
    const [comment, setComment] = useState(null);
    const [description, setDescription] = useState(null);
    const [error, setError] = useState(null);

    const handleAddEnumValue = () => {
        const activeItem =
            state.model.contents[currentPropertyIndex].schema.enumValues;
        const prop = {
            '@id': id ? `dtmi:com:adt:${id};` : 'dtmi:com:adt:enum;',
            name: name ? name : activeItem.name,
            displayName: displayName ? displayName : 'enum_item',
            enumValue: enumValue ? enumValue : activeItem.enumValue,
            comment: comment ? comment : activeItem.comment,
            description: description ? description : activeItem.description
        };

        const modelCopy = Object.assign({}, state.model);
        modelCopy.contents[currentPropertyIndex].schema.enumValues.push(prop);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
        setModalOpen(false);
        setModalBody(null);
    };

    const getErrorMessage = (value) => {
        const find = state.model.contents[
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
            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Label>{t('OATPropertyEditor.addEnumValue')}</Label>
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
                    {`*${t('OATPropertyEditor.name')}`}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setName(value)}
                />
            </div>

            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.displayName')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => setDisplayName(value)}
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
                onClick={handleAddEnumValue}
                disabled={error || !enumValue || !name}
            />
        </>
    );
};

export default FormAddEnumItem;
