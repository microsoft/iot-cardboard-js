import React, { useState, useEffect } from 'react';
import {
    TextField,
    Text,
    ActionButton,
    FontIcon,
    Label,
    ChoiceGroup,
    IconButton,
    Dropdown,
    IChoiceGroupOption,
    IDropdownOption
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getModalLabelStyles,
    getRadioGroupRowStyles,
    getModalTextFieldStyles
} from './OATPropertyEditor.styles';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { deepCopy } from '../../Models/Services/Utils';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { MultiLanguageSelectionType } from '../../Models/Constants/Enums';
import {
    getModelPropertyCollectionName,
    handleMultiLanguageSelectionRemoval,
    handleMultiLanguageSelectionsDescriptionKeyChange,
    handleMultiLanguageSelectionsDescriptionValueChange,
    handleMultiLanguageSelectionsDisplayNameKeyChange,
    handleMultiLanguageSelectionsDisplayNameValueChange
} from './Utils';
import {
    commentLengthLimit,
    descriptionLengthLimit,
    displayNameLengthLimit,
    idLengthLimit
} from './Constants';

const multiLanguageOptionValue = 'multiLanguage';
const singleLanguageOptionValue = 'singleLanguage';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: number;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
    languages: IDropdownOption[];
}

export const FormAddEnumItem = ({
    dispatch,
    setModalOpen,
    currentPropertyIndex,
    setModalBody,
    state,
    languages
}: IModal) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const columnLeftTextStyles = getModalLabelStyles();
    const textFieldStyles = getModalTextFieldStyles();
    const radioGroupRowStyle = getRadioGroupRowStyles();
    const [displayName, setDisplayName] = useState(null);
    const [name, setName] = useState(null);
    const [enumValue, setEnumValue] = useState(null);
    const [id, setId] = useState(null);
    const [comment, setComment] = useState(null);
    const [description, setDescription] = useState(null);
    const [error, setError] = useState(null);
    const [languageSelection, setLanguageSelection] = useState(
        singleLanguageOptionValue
    );
    const [
        languageSelectionDescription,
        setLanguageSelectionDescription
    ] = useState(singleLanguageOptionValue);
    const [
        multiLanguageSelectionsDisplayName,
        setMultiLanguageSelectionsDisplayName
    ] = useState({});
    const [
        multiLanguageSelectionsDisplayNames,
        setMultiLanguageSelectionsDisplayNames
    ] = useState([]);
    const [
        isAMultiLanguageDisplayNameEmpty,
        setIsAMultiLanguageDisplayNameEmpty
    ] = useState(true);
    const [
        multiLanguageSelectionsDescription,
        setMultiLanguageSelectionsDescription
    ] = useState({});
    const [
        multiLanguageSelectionsDescriptions,
        setMultiLanguageSelectionsDescriptions
    ] = useState([]);
    const [
        isAMultiLanguageDescriptionEmpty,
        setIsAMultiLanguageDescriptionEmpty
    ] = useState(true);
    const [commentError, setCommentError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [displayNameError, setDisplayNameError] = useState(null);
    const [idError, setIdError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const { model } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const options: IChoiceGroupOption[] = [
        {
            key: singleLanguageOptionValue,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageSelectionsDisplayNames.length > 0
        },
        {
            key: multiLanguageOptionValue,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

    const optionsDescription: IChoiceGroupOption[] = [
        {
            key: singleLanguageOptionValue,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageSelectionsDescriptions.length > 0
        },
        {
            key: multiLanguageOptionValue,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

    const onLanguageSelectDescription = (
        ev: React.FormEvent<HTMLInputElement>,
        option: IChoiceGroupOption
    ): void => {
        setLanguageSelectionDescription(option.key);
    };

    const onLanguageSelect = (
        ev: React.FormEvent<HTMLInputElement>,
        option: IChoiceGroupOption
    ): void => {
        setLanguageSelection(option.key);
    };

    const handleAddEnumValue = () => {
        const activeItem =
            model[propertiesKeyName][currentPropertyIndex].schema.enumValues;
        const prop = {
            '@id': id ? `dtmi:com:adt:${id};` : 'dtmi:com:adt:enum;',
            name: name ? name : activeItem.name,
            description:
                languageSelectionDescription === singleLanguageOptionValue
                    ? description
                        ? description
                        : activeItem.description
                    : multiLanguageSelectionsDescription,
            displayName:
                languageSelection === singleLanguageOptionValue
                    ? displayName
                        ? displayName
                        : 'enum_item'
                    : multiLanguageSelectionsDisplayName,
            enumValue: enumValue ? enumValue : activeItem.enumValue,
            comment: comment ? comment : activeItem.comment
        };

        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName][
            currentPropertyIndex
        ].schema.enumValues.push(prop);
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
        setModalOpen(false);
        setModalBody(null);
    };

    const getErrorMessage = (value) => {
        const find = model[propertiesKeyName][
            currentPropertyIndex
        ].schema.enumValues.find((item) => item.enumValue === value);
        if (!find && value !== '') {
            setEnumValue(value);
        }

        setError(!!find);

        return find ? `${t('OATPropertyEditor.errorRepeatedEnumValue')}` : '';
    };

    const handleDisplayNameChange = (value) => {
        if (value.length <= displayNameLengthLimit) {
            setDisplayName(value);
            setDisplayNameError(null);
        } else {
            setDisplayNameError(true);
        }
    };

    const handleDescriptionChange = (value) => {
        if (value.length <= descriptionLengthLimit) {
            setDescription(value);
            setDescriptionError(null);
        } else {
            setDescriptionError(true);
        }
    };

    const handleCommentChange = (value) => {
        if (value.length <= commentLengthLimit) {
            setComment(value);
            setCommentError(null);
        } else {
            setCommentError(true);
        }
    };

    const handleIdChange = (value) => {
        if (value.length <= idLengthLimit) {
            setId(value);
            setIdError(null);
        } else {
            setIdError(true);
        }
    };

    const handleNameChange = (value) => {
        // ^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$
        const regularExpression = new RegExp(
            '^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$'
        );
        const isValid = regularExpression.exec(value);

        if (isValid) {
            setName(value);
            setNameError(null);
        } else {
            setNameError(true);
        }
    };

    useEffect(() => {
        // Create an array of the keys and values
        const newMultiLanguageSelectionsDisplayNames = Object.keys(
            multiLanguageSelectionsDisplayName
        ).map((key) => {
            return {
                key,
                value: multiLanguageSelectionsDisplayName[key]
            };
        });

        setMultiLanguageSelectionsDisplayNames(
            newMultiLanguageSelectionsDisplayNames
        );

        // Check if array of object includes empty values
        const hasEmptyValues = newMultiLanguageSelectionsDisplayNames.some(
            (item) => item.value === ''
        );
        setIsAMultiLanguageDisplayNameEmpty(hasEmptyValues);
    }, [multiLanguageSelectionsDisplayName]);

    // Update multiLanguageSelectionsDescriptions on every new language change
    useEffect(() => {
        // Create an array of the keys and values
        const newMultiLanguageSelectionsDescriptions = Object.keys(
            multiLanguageSelectionsDescription
        ).map((key) => {
            return {
                key,
                value: multiLanguageSelectionsDescription[key]
            };
        });

        setMultiLanguageSelectionsDescriptions(
            newMultiLanguageSelectionsDescriptions
        );

        // Check if array of object includes empty values
        const hasEmptyValues = newMultiLanguageSelectionsDescriptions.some(
            (item) => item.value === ''
        );
        setIsAMultiLanguageDescriptionEmpty(hasEmptyValues);
    }, [multiLanguageSelectionsDescription]);

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

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.displayName')}
                </Text>
                <ChoiceGroup
                    defaultSelectedKey={singleLanguageOptionValue}
                    options={options}
                    onChange={onLanguageSelect}
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>

            {languageSelection === singleLanguageOptionValue && (
                <div className={propertyInspectorStyles.modalRow}>
                    <div></div> {/* Needed for gridTemplateColumns style  */}
                    <TextField
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolder'
                        )}
                        value={displayName}
                        styles={textFieldStyles}
                        onChange={(e, v) => handleDisplayNameChange(v)}
                        errorMessage={
                            displayNameError
                                ? t('OATPropertyEditor.errorDisplayName')
                                : ''
                        }
                    />
                </div>
            )}

            {languageSelection === multiLanguageOptionValue &&
                multiLanguageSelectionsDisplayNames.length > 0 &&
                multiLanguageSelectionsDisplayNames.map((language, index) => (
                    <div
                        key={index}
                        className={
                            propertyInspectorStyles.modalRowLanguageSelection
                        }
                    >
                        <IconButton
                            iconProps={{ iconName: 'Cancel' }}
                            title={t('OATPropertyEditor.delete')}
                            ariaLabel={t('OATPropertyEditor.delete')}
                            onClick={() =>
                                handleMultiLanguageSelectionRemoval(
                                    index,
                                    MultiLanguageSelectionType.displayName,
                                    multiLanguageSelectionsDisplayName,
                                    multiLanguageSelectionsDisplayNames,
                                    multiLanguageSelectionsDescription,
                                    multiLanguageSelectionsDescriptions,
                                    setMultiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayNames,
                                    setMultiLanguageSelectionsDescription,
                                    setMultiLanguageSelectionsDescriptions
                                )
                            }
                        />
                        <Dropdown
                            placeholder={t('OATPropertyEditor.region')}
                            options={languages}
                            onChange={(_ev, option) =>
                                handleMultiLanguageSelectionsDisplayNameKeyChange(
                                    option.key,
                                    index,
                                    multiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayName
                                )
                            }
                            value={language.key}
                        />
                        <TextField
                            placeholder={t('OATPropertyEditor.displayName')}
                            value={language.value}
                            onChange={(_ev, value) =>
                                handleMultiLanguageSelectionsDisplayNameValueChange(
                                    value,
                                    index,
                                    multiLanguageSelectionsDisplayNames,
                                    multiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayName,
                                    setDisplayNameError
                                )
                            }
                            disabled={
                                !multiLanguageSelectionsDisplayNames[index].key
                            }
                            styles={textFieldStyles}
                            errorMessage={
                                displayNameError
                                    ? t('OATPropertyEditor.errorDisplayName')
                                    : ''
                            }
                        />
                    </div>
                ))}

            {languageSelection === multiLanguageOptionValue && (
                <div className={propertyInspectorStyles.modalRow}>
                    <ActionButton
                        disabled={
                            isAMultiLanguageDisplayNameEmpty &&
                            multiLanguageSelectionsDisplayNames.length !== 0
                        }
                        onClick={() => {
                            const newMultiLanguageSelectionsDisplayNames = [
                                ...multiLanguageSelectionsDisplayNames,
                                {
                                    key: '',
                                    value: ''
                                }
                            ];

                            setMultiLanguageSelectionsDisplayNames(
                                newMultiLanguageSelectionsDisplayNames
                            );
                            if (
                                newMultiLanguageSelectionsDisplayNames.length >
                                0
                            ) {
                                setIsAMultiLanguageDisplayNameEmpty(true);
                            }
                        }}
                    >
                        <FontIcon
                            iconName={'Add'}
                            className={propertyInspectorStyles.iconAddProperty}
                        />
                        <Text>{t('OATPropertyEditor.region')}</Text>
                    </ActionButton>
                </div>
            )}

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.description')}
                </Text>
                <ChoiceGroup
                    defaultSelectedKey={singleLanguageOptionValue}
                    options={optionsDescription}
                    onChange={onLanguageSelectDescription}
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>

            {languageSelectionDescription === singleLanguageOptionValue && (
                <div className={propertyInspectorStyles.modalRow}>
                    <div></div> {/* Needed for gridTemplateColumns style  */}
                    <TextField
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolderDescription'
                        )}
                        value={description}
                        styles={textFieldStyles}
                        onChange={(_ev, value) =>
                            handleDescriptionChange(value)
                        }
                        errorMessage={
                            descriptionError
                                ? t('OATPropertyEditor.errorDescription')
                                : ''
                        }
                    />
                </div>
            )}

            {languageSelectionDescription === multiLanguageOptionValue &&
                multiLanguageSelectionsDescriptions.length > 0 &&
                multiLanguageSelectionsDescriptions.map((language, index) => (
                    <div
                        key={index}
                        className={
                            propertyInspectorStyles.modalRowLanguageSelection
                        }
                    >
                        <IconButton
                            iconProps={{ iconName: 'Cancel' }}
                            title={t('OATPropertyEditor.delete')}
                            ariaLabel={t('OATPropertyEditor.delete')}
                            onClick={() =>
                                handleMultiLanguageSelectionRemoval(
                                    index,
                                    MultiLanguageSelectionType.description,
                                    multiLanguageSelectionsDisplayName,
                                    multiLanguageSelectionsDisplayNames,
                                    multiLanguageSelectionsDescription,
                                    multiLanguageSelectionsDescriptions,
                                    setMultiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayNames,
                                    setMultiLanguageSelectionsDescription,
                                    setMultiLanguageSelectionsDescriptions
                                )
                            }
                        />
                        <Dropdown
                            placeholder={t('OATPropertyEditor.region')}
                            options={languages}
                            onChange={(_ev, option) =>
                                handleMultiLanguageSelectionsDescriptionKeyChange(
                                    option.key,
                                    index,
                                    multiLanguageSelectionsDescription,
                                    setMultiLanguageSelectionsDescription
                                )
                            }
                            value={language.key}
                        />
                        <TextField
                            placeholder={t('OATPropertyEditor.description')}
                            value={language.value}
                            onChange={(_ev, value) =>
                                handleMultiLanguageSelectionsDescriptionValueChange(
                                    value,
                                    index,
                                    multiLanguageSelectionsDescription,
                                    multiLanguageSelectionsDescriptions,
                                    setMultiLanguageSelectionsDescription,
                                    setDescriptionError
                                )
                            }
                            disabled={
                                !multiLanguageSelectionsDescriptions[index].key
                            }
                            styles={textFieldStyles}
                            errorMessage={
                                descriptionError
                                    ? t('OATPropertyEditor.errorDescription')
                                    : ''
                            }
                        />
                    </div>
                ))}

            {languageSelectionDescription === multiLanguageOptionValue && (
                <div className={propertyInspectorStyles.modalRow}>
                    <ActionButton
                        disabled={
                            isAMultiLanguageDescriptionEmpty &&
                            multiLanguageSelectionsDescriptions.length !== 0
                        }
                        onClick={() => {
                            const newMultiLanguageSelectionsDescriptions = [
                                ...multiLanguageSelectionsDescriptions,
                                {
                                    key: '',
                                    value: ''
                                }
                            ];

                            setMultiLanguageSelectionsDescriptions(
                                newMultiLanguageSelectionsDescriptions
                            );
                            if (
                                newMultiLanguageSelectionsDescriptions.length >
                                0
                            ) {
                                setIsAMultiLanguageDescriptionEmpty(true);
                            }
                        }}
                    >
                        <FontIcon
                            iconName={'Add'}
                            className={propertyInspectorStyles.iconAddProperty}
                        />
                        <Text>{t('OATPropertyEditor.region')}</Text>
                    </ActionButton>
                </div>
            )}

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.comment')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    styles={textFieldStyles}
                    onChange={(_ev, value) => handleCommentChange(value)}
                    errorMessage={
                        commentError ? t('OATPropertyEditor.errorComment') : ''
                    }
                />
            </div>

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {`*${t('OATPropertyEditor.name')}`}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => handleNameChange(value)}
                    styles={textFieldStyles}
                    errorMessage={
                        nameError ? t('OATPropertyEditor.errorName') : ''
                    }
                />
            </div>

            <div className={propertyInspectorStyles.modalRow}>
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
                    styles={textFieldStyles}
                />
            </div>

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.id')}
                </Text>
                <TextField
                    placeholder={t('OATPropertyEditor.id')}
                    styles={textFieldStyles}
                    onChange={(_ev, value) => handleIdChange(value)}
                    errorMessage={idError ? t('OATPropertyEditor.errorId') : ''}
                />
            </div>

            <PrimaryButton
                text={t('OATPropertyEditor.update')}
                allowDisabledFocus
                onClick={handleAddEnumValue}
                disabled={
                    error ||
                    !enumValue ||
                    !name ||
                    nameError ||
                    commentError ||
                    descriptionError ||
                    idError
                }
            />
        </>
    );
};

export default FormAddEnumItem;
