import React, { useState, useEffect, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
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
    IChoiceGroupOption,
    IDropdownOption
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getModalLabelStyles,
    getRadioGroupRowStyles
} from './OATPropertyEditor.styles';
import {
    SET_OAT_MODELS,
    SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX
} from '../../Models/Constants/ActionTypes';
import { deepCopy } from '../../Models/Services/Utils';
import { MultiLanguageSelectionType } from '../../Models/Constants/Enums';
import {
    getModelPropertyCollectionName,
    getModelPropertyListItemName,
    validateCommentChange,
    validateDescriptionChange,
    validateDisplayNameChange,
    setMultiLanguageSelectionRemoval,
    setMultiLanguageSelectionsDescriptionKey,
    validateMultiLanguageSelectionsDescriptionValueChange,
    setMultiLanguageSelectionsDisplayNameKey,
    setMultiLanguageSelectionsDisplayNameValue,
    getTargetFromSelection,
    getNestedPropertyCollectionName
} from './Utils';
import { FormUpdatePropertyProps } from './FormUpdateProperty.types';
const multiLanguageOptionValue = 'multiLanguage';
const singleLanguageOptionValue = 'singleLanguage';

export const FormUpdateProperty = ({
    dispatch,
    state,
    languages,
    onClose
}: FormUpdatePropertyProps) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const radioGroupRowStyle = getRadioGroupRowStyles();
    const columnLeftTextStyles = getModalLabelStyles();

    const {
        models,
        selection,
        currentPropertyIndex,
        currentNestedPropertyIndex
    } = state;

    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const nestedPropertyCollectionName = getNestedPropertyCollectionName(
        model[propertiesKeyName][currentPropertyIndex].schema['@type']
    );

    const activeProperty = model[propertiesKeyName][currentPropertyIndex];

    const activeNestedProperty =
        model[propertiesKeyName][currentPropertyIndex].schema[
            nestedPropertyCollectionName
        ] &&
        model[propertiesKeyName][currentPropertyIndex].schema[
            nestedPropertyCollectionName
        ][currentNestedPropertyIndex];
    const targetProperty = activeNestedProperty || activeProperty;
    const [comment, setComment] = useState('');
    const [name, setName] = useState(targetProperty.name);
    const [enumValue, setEnumValue] = useState(targetProperty.enumValue);
    const [errorRepeatedEnumValue, setErrorRepeatedEnumValue] = useState(null);
    const [nameError, setNameError] = useState('');
    const [description, setDescription] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [writable, setWritable] = useState(true);
    const [languageSelection, setLanguageSelection] = useState('');
    const [
        languageSelectionDescription,
        setLanguageSelectionDescription
    ] = useState('');
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

    const [valueSchema, setValueSchema] = useState(
        activeProperty.schema.valueSchema
            ? activeProperty.schema.valueSchema
            : 'integer'
    );

    const valueSchemaOptions: IDropdownOption[] = [
        { key: 'integer', text: 'integer' },
        { key: 'string', text: 'string' }
    ];

    useEffect(() => {
        setComment(targetProperty.comment);
        setDescription(targetProperty.description);
        setDisplayName(
            getModelPropertyListItemName(
                targetProperty.displayName || targetProperty.name
            )
        );
        setWritable(targetProperty.writable || true);
        setLanguageSelection(
            !targetProperty.displayName ||
                typeof targetProperty.displayName === 'string'
                ? singleLanguageOptionValue
                : multiLanguageOptionValue
        );
        setLanguageSelectionDescription(
            !targetProperty.description ||
                typeof targetProperty.description === 'string'
                ? singleLanguageOptionValue
                : multiLanguageOptionValue
        );
        setMultiLanguageSelectionsDisplayName(
            targetProperty.displayName &&
                typeof targetProperty.displayName === 'object'
                ? targetProperty.displayName
                : {}
        );
        setMultiLanguageSelectionsDescription(
            targetProperty.description &&
                typeof targetProperty.description === 'object'
                ? targetProperty.description
                : {}
        );
    }, [model]);

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
        const update = () => {
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
                schema: activeNestedProperty.schema,
                name: activeNestedProperty.name
            };

            // Update nested enum value
            if (
                activeNestedProperty &&
                activeProperty.schema['@type'] === 'Enum'
            ) {
                delete prop.displayName;
                prop.name = name;
                prop.enumValue = enumValue;
            }

            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            modelCopy[propertiesKeyName][currentPropertyIndex].schema[
                nestedPropertyCollectionName
            ][currentNestedPropertyIndex] = prop;

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
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
            payload: null
        });
    };

    const onUpdateProperty = () => {
        if (currentNestedPropertyIndex !== null) {
            handleUpdatedNestedProperty();
            return;
        }

        const update = () => {
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
                schema: activeProperty.schema,
                name: activeProperty.name
            };

            // Set valueSchema if enum
            if (
                targetProperty.schema &&
                targetProperty.schema['@type'] === 'Enum'
            ) {
                prop.schema.valueSchema = valueSchema;
            }

            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            modelCopy[propertiesKeyName][currentPropertyIndex] = prop;
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

    const onEnumValueChange = (value: string) => {
        const find = activeProperty.schema.enumValues.find(
            (item) => item.enumValue === value
        );

        // If enumValue found, but same value as before, do not set error
        if (find && find.enumValue === targetProperty.enumValue) {
            setEnumValue(value);
            return;
        }

        if (!find && value !== '') {
            setEnumValue(value);
        }

        setErrorRepeatedEnumValue(!!find);
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
                <Label>{targetProperty.name}</Label>
                <ActionButton onClick={onClose}>
                    <FontIcon
                        iconName={'ChromeClose'}
                        className={
                            propertyInspectorStyles.iconClosePropertySelector
                        }
                    />
                </ActionButton>
            </div>

            {targetProperty.displayName && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Text styles={columnLeftTextStyles}>
                        {t('OATPropertyEditor.displayName')}
                    </Text>
                    <ChoiceGroup
                        selectedKey={languageSelection}
                        options={options}
                        onChange={onLanguageSelect}
                        required={true}
                        styles={radioGroupRowStyle}
                    />
                </div>
            )}

            {languageSelection === singleLanguageOptionValue &&
                targetProperty.displayName && (
                    <div className={propertyInspectorStyles.modalRow}>
                        <div></div>
                        {/* Needed for gridTemplateColumns style  */}
                        <TextField
                            placeholder={t(
                                'OATPropertyEditor.modalTextInputPlaceHolder'
                            )}
                            value={displayName}
                            validateOnFocusOut
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

            {activeNestedProperty && activeProperty.schema['@type'] === 'Enum' && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Text styles={columnLeftTextStyles}>
                        {t('OATPropertyEditor.name')}
                    </Text>
                    <TextField
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolder'
                        )}
                        onChange={(_ev, value) =>
                            validateDisplayNameChange(
                                value,
                                setName,
                                setNameError
                            )
                        }
                        errorMessage={
                            nameError
                                ? t('OATPropertyEditor.errorDisplayNameLength')
                                : ''
                        }
                        value={name}
                    />
                </div>
            )}

            {activeNestedProperty && activeProperty.schema['@type'] === 'Enum' && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Text styles={columnLeftTextStyles}>
                        {`${t('OATPropertyEditor.enumValue')}`}
                    </Text>
                    <TextField
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolder'
                        )}
                        type="number"
                        onChange={(_ev, value) => onEnumValueChange(value)}
                        value={enumValue}
                        errorMessage={
                            errorRepeatedEnumValue
                                ? t('OATPropertyEditor.errorRepeatedEnumValue')
                                : ''
                        }
                    />
                </div>
            )}

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.description')}
                </Text>
                <ChoiceGroup
                    selectedKey={languageSelectionDescription}
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
                        validateCommentChange(
                            value,
                            setComment,
                            setCommentError
                        )
                    }
                    errorMessage={
                        commentError ? t('OATPropertyEditor.errorComment') : ''
                    }
                    value={comment}
                />
            </div>

            {targetProperty.schema &&
                targetProperty.schema['@type'] === 'Enum' && (
                    <div className={propertyInspectorStyles.modalRow}>
                        <Text styles={columnLeftTextStyles}>
                            {t('OATPropertyEditor.valueSchema')}
                        </Text>
                        <Dropdown
                            placeholder={t('OATPropertyEditor.valueSchema')}
                            options={valueSchemaOptions}
                            onChange={(_ev, option) =>
                                setValueSchema(option.key)
                            }
                            defaultSelectedKey={valueSchema}
                        />
                    </div>
                )}

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
                        displayNameError || commentError || descriptionError
                    }
                />
            </div>
        </>
    );
};

export default FormUpdateProperty;
