import React, { useState, useEffect } from 'react';
import {
    TextField,
    Text,
    Toggle,
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
    getRadioGroupRowStyles
} from './OATPropertyEditor.styles';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { deepCopy } from '../../Models/Services/Utils';
import { MultiLanguageSelectionType } from '../../Models/Constants/Enums';
import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName,
    handleCommentChange,
    handleDescriptionChange,
    handleDisplayNameChange,
    handleIdChange,
    handleMultiLanguageSelectionRemoval,
    handleMultiLanguageSelectionsDescriptionKeyChange,
    handleMultiLanguageSelectionsDescriptionValueChange,
    handleMultiLanguageSelectionsDisplayNameKeyChange,
    handleMultiLanguageSelectionsDisplayNameValueChange
} from './Utils';
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
    languages: IChoiceGroupOption[];
}

export const FormUpdateProperty = ({
    dispatch,
    setModalOpen,
    currentPropertyIndex,
    currentNestedPropertyIndex,
    setCurrentNestedPropertyIndex,
    setModalBody,
    state,
    languages
}: IModal) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const radioGroupRowStyle = getRadioGroupRowStyles();
    const columnLeftTextStyles = getModalLabelStyles();

    const { model } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const activeProperty = model[propertiesKeyName][currentPropertyIndex];

    const activeNestedProperty =
        currentNestedPropertyIndex && currentNestedPropertyIndex >= 0
            ? model[propertiesKeyName][currentPropertyIndex].schema.fields[
                  currentNestedPropertyIndex
              ]
            : null;

    const [comment, setComment] = useState(null);
    const [description, setDescription] = useState(
        activeNestedProperty
            ? activeNestedProperty.description
            : activeProperty.description
    );
    const [displayName, setDisplayName] = useState(
        getModelPropertyListItemName(
            activeNestedProperty
                ? activeNestedProperty.displayName
                    ? activeNestedProperty.displayName
                    : activeNestedProperty.name
                : activeProperty.displayName
                ? activeProperty.displayName
                : activeProperty.name
        )
    );
    const [writable, setWritable] = useState(true);
    const [id, setId] = useState(
        activeNestedProperty
            ? activeNestedProperty['@id']
            : activeProperty['@id']
    );
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

    const onLanguageSelect = (
        ev: React.FormEvent<HTMLInputElement>,
        option: IChoiceGroupOption
    ): void => {
        setLanguageSelection(option.key);
    };

    const onLanguageSelectDescription = (
        ev: React.FormEvent<HTMLInputElement>,
        option: IChoiceGroupOption
    ): void => {
        setLanguageSelectionDescription(option.key);
    };

    const handleUpdatedNestedProperty = () => {
        const activeNestedProperty =
            model[propertiesKeyName][currentPropertyIndex].schema.fields[
                currentNestedPropertyIndex
            ];
        const prop = {
            comment: comment ? comment : activeNestedProperty.comment,
            description:
                languageSelectionDescription === singleLanguageOptionValue
                    ? description
                        ? description
                        : activeNestedProperty.description
                    : multiLanguageSelectionsDescription,
            displayName:
                languageSelection === singleLanguageOptionValue
                    ? displayName
                        ? displayName
                        : activeNestedProperty.name
                    : multiLanguageSelectionsDisplayName,
            writable,
            unit: activeNestedProperty.unit,
            '@id': id ? id : activeNestedProperty['@id'],
            schema: activeNestedProperty.schema,
            name: activeNestedProperty.name
        };

        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName][currentPropertyIndex].schema.fields[
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

    const onUpdateProperty = () => {
        if (currentNestedPropertyIndex !== null) {
            handleUpdatedNestedProperty();
            return;
        }

        const prop = {
            comment: comment ? comment : activeProperty.comment,
            description:
                languageSelectionDescription === singleLanguageOptionValue
                    ? description
                        ? description
                        : activeProperty.description
                    : multiLanguageSelectionsDescription
                    ? multiLanguageSelectionsDescription
                    : activeProperty.description,
            displayName:
                languageSelection === singleLanguageOptionValue
                    ? displayName
                        ? displayName
                        : activeProperty.name
                    : multiLanguageSelectionsDisplayName
                    ? multiLanguageSelectionsDisplayName
                    : activeProperty.name,
            writable,
            '@type': activeProperty['@type'],
            unit: activeProperty.unit,
            '@id': id ? id : activeProperty['@id'],
            schema: activeProperty.schema,
            name: activeProperty.name
        };

        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName][currentPropertyIndex] = prop;
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
        setModalOpen(false);
        setModalBody(null);
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

    const getIdErrorMessage = () => {
        return idLengthError
            ? t('OATPropertyEditor.errorIdLength')
            : idValidDTMIError
            ? t('OATPropertyEditor.errorIdValidDTMI')
            : '';
    };

    return (
        <>
            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Label>
                    {model[propertiesKeyName][currentPropertyIndex]
                        ? typeof model[propertiesKeyName][currentPropertyIndex]
                              .displayName === 'string'
                            ? model[propertiesKeyName][currentPropertyIndex]
                                  .displayName
                            : Object.values(model.displayName)[0]
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

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.id')}
                </Text>
                <TextField
                    placeholder={t('OATPropertyEditor.id')}
                    onChange={(_ev, value) =>
                        handleIdChange(
                            value,
                            setId,
                            setIdLengthError,
                            setIdValidDTMIError
                        )
                    }
                    errorMessage={getIdErrorMessage()}
                    value={id}
                />
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
                        validateOnFocusOut
                        onChange={(e, v) =>
                            handleDisplayNameChange(
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
                        <Text>{t('OATPropertyEditor.region')}1</Text>
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
                        onChange={(_ev, value) =>
                            handleDescriptionChange(
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
                        value={description}
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
                    onChange={(_ev, value) =>
                        handleCommentChange(value, setComment, setCommentError)
                    }
                    errorMessage={
                        commentError ? t('OATPropertyEditor.errorComment') : ''
                    }
                    value={comment}
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

            <div className={propertyInspectorStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATPropertyEditor.update')}
                    allowDisabledFocus
                    onClick={onUpdateProperty}
                    disabled={
                        displayNameError ||
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

export default FormUpdateProperty;
