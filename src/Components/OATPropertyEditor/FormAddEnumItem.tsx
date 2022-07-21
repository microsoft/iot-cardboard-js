import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
    TextField,
    Text,
    ActionButton,
    FontIcon,
    Label,
    ChoiceGroup,
    IconButton,
    Dropdown,
    IChoiceGroupOption
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getModalLabelStyles,
    getRadioGroupRowStyles,
    getModalTextFieldStyles
} from './OATPropertyEditor.styles';
import { SET_OAT_MODELS } from '../../Models/Constants/ActionTypes';
import { deepCopy } from '../../Models/Services/Utils';
import { MultiLanguageSelectionType } from '../../Models/Constants/Enums';
import {
    getModelPropertyCollectionName,
    validateCommentChange,
    validateDescriptionChange,
    validateDisplayNameChange,
    validateIdChange,
    setMultiLanguageSelectionRemoval,
    setMultiLanguageSelectionsDescriptionKey,
    validateMultiLanguageSelectionsDescriptionValueChange,
    setMultiLanguageSelectionsDisplayNameKey,
    setMultiLanguageSelectionsDisplayNameValue,
    getTargetFromSelection
} from './Utils';
import {
    DTDLNameRegex,
    OATNameLengthLimit
} from '../../Models/Constants/Constants';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { ModalFormAddEnumItemProps } from './FormAddEnumItem.types';

const multiLanguageOptionValue = 'multiLanguage';
const singleLanguageOptionValue = 'singleLanguage';

export const FormAddEnumItem = ({
    dispatch,
    onClose,
    state,
    languages
}: ModalFormAddEnumItemProps) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
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
    const [errorRepeatedEnumValue, setErrorRepeatedEnumValue] = useState(null);
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
    const [idLengthError, setIdLengthError] = useState(null);
    const [idValidDTMIError, setIdValidDTMIError] = useState(null);
    const [nameLengthError, setNameLengthError] = useState(false);
    const [nameValidCharactersError, setNameValidCharactersError] = useState(
        false
    );
    const { selection, models, currentPropertyIndex } = state;

    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );

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

    const onAddEnumValue = () => {
        const update = () => {
            const prop = {
                '@id': id ? `dtmi:com:adt:${id};` : 'dtmi:com:adt:enum;',
                name: name ? name : '',
                description:
                    languageSelectionDescription === singleLanguageOptionValue
                        ? description
                            ? description
                            : ''
                        : multiLanguageSelectionsDescription,
                displayName:
                    languageSelection === singleLanguageOptionValue
                        ? displayName
                            ? displayName
                            : 'enum_item'
                        : multiLanguageSelectionsDisplayName,
                enumValue: enumValue ? enumValue : '',
                comment: comment ? comment : ''
            };

            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            modelCopy[propertiesKeyName][
                currentPropertyIndex
            ].schema.enumValues.push(prop);

            dispatch({
                type: SET_OAT_MODELS,
                payload: modelsCopy
            });
        };

        const undoUpdate = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
        };

        execute(update, undoUpdate);

        onClose();
    };

    const getErrorMessage = (value: string) => {
        const find = model[propertiesKeyName][
            currentPropertyIndex
        ].schema.enumValues.find((item) => item.enumValue === value);
        if (!find && value !== '') {
            setEnumValue(value);
        }

        setErrorRepeatedEnumValue(!!find);

        return find ? `${t('OATPropertyEditor.errorRepeatedEnumValue')}` : '';
    };

    const onNameChange = (value: string) => {
        if (value.length <= OATNameLengthLimit) {
            setNameLengthError(null);
            // Name may only contain the characters a-z, A-Z, 0-9, and underscore.
            if (DTDLNameRegex.test(value)) {
                setNameValidCharactersError(null);
                setName(value);
            } else {
                setNameValidCharactersError(true);
            }
        } else {
            setNameLengthError(true);
        }
    };

    const getNameErrorMessage = () => {
        return nameLengthError
            ? t('OATPropertyEditor.errorNameLength')
            : nameValidCharactersError
            ? t('OATPropertyEditor.errorName')
            : '';
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
                <ActionButton onClick={onClose}>
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
                        onChange={(e, v) =>
                            validateDisplayNameChange(
                                v,
                                setDisplayName,
                                setDisplayNameError
                            )
                        }
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
                                setMultiLanguageSelectionRemoval(
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
                                setMultiLanguageSelectionsDisplayNameKey(
                                    option.key,
                                    index,
                                    multiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayName
                                )
                            }
                            defaultSelectedKey={language.key}
                        />
                        <TextField
                            placeholder={t('OATPropertyEditor.displayName')}
                            value={language.value}
                            onChange={(_ev, value) =>
                                setMultiLanguageSelectionsDisplayNameValue(
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
                <div className={propertyInspectorStyles.regionButton}>
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
                            validateDescriptionChange(
                                value,
                                setDescription,
                                setDescriptionError
                            )
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
                                setMultiLanguageSelectionRemoval(
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
                                setMultiLanguageSelectionsDescriptionKey(
                                    option.key,
                                    index,
                                    multiLanguageSelectionsDescription,
                                    setMultiLanguageSelectionsDescription
                                )
                            }
                            defaultSelectedKey={language.key}
                        />
                        <TextField
                            placeholder={t('OATPropertyEditor.description')}
                            value={language.value}
                            onChange={(_ev, value) =>
                                validateMultiLanguageSelectionsDescriptionValueChange(
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
                <div className={propertyInspectorStyles.regionButton}>
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
                    onChange={(_ev, value) =>
                        validateCommentChange(
                            value,
                            setComment,
                            setCommentError
                        )
                    }
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
                    onChange={(_ev, value) => onNameChange(value)}
                    styles={textFieldStyles}
                    errorMessage={getNameErrorMessage()}
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
                    onChange={(_ev, value) =>
                        validateIdChange(
                            value,
                            setId,
                            setIdLengthError,
                            setIdValidDTMIError
                        )
                    }
                    errorMessage={
                        idLengthError
                            ? t('OATPropertyEditor.errorIdLength')
                            : idValidDTMIError
                            ? t('OATPropertyEditor.errorIdValidDTMI')
                            : ''
                    }
                />
            </div>

            <div className={propertyInspectorStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATPropertyEditor.update')}
                    allowDisabledFocus
                    onClick={onAddEnumValue}
                    disabled={
                        errorRepeatedEnumValue ||
                        !enumValue ||
                        !name ||
                        nameLengthError ||
                        nameValidCharactersError ||
                        commentError ||
                        descriptionError ||
                        idLengthError ||
                        idValidDTMIError
                    }
                />
            </div>
        </>
    );
};

export default FormAddEnumItem;
